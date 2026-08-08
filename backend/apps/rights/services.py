"""
DSARService — orchestrates the two DSAR use cases: submitting a request
and transitioning its status. Single Responsibility, constructor-injected
dependencies (Dependency Inversion), same shape as apps.consent.services.
"""

from __future__ import annotations

import uuid
from dataclasses import replace
from datetime import datetime, timezone
from typing import Callable

from apps.rights.domain.entities import DSARRequestEntity
from apps.rights.domain.exceptions import InvalidTransitionError
from apps.rights.domain.interfaces import DSARRequestRepository
from apps.rights.domain.sla import SLAStrategyFactory
from apps.rights.domain.states import RequestStateRegistry


class DSARService:
    def __init__(
        self,
        repository: DSARRequestRepository,
        audit_logger: Callable[..., None] | None = None,
        sla_strategy_factory: type[SLAStrategyFactory] = SLAStrategyFactory,
        state_registry: type[RequestStateRegistry] = RequestStateRegistry,
    ):
        self._repository = repository
        self._audit_logger = audit_logger
        self._sla_strategy_factory = sla_strategy_factory
        self._state_registry = state_registry

    def submit_request(
        self,
        *,
        organization_id: uuid.UUID,
        subject_key: str,
        request_type: str,
        region: str,
        actor=None,
        request=None,
    ) -> DSARRequestEntity:
        now = datetime.now(timezone.utc)
        sla = self._sla_strategy_factory.get_strategy(region)
        initial_status = self._state_registry.get("submitted").code

        entity = DSARRequestEntity(
            id=uuid.uuid4(),
            organization_id=organization_id,
            subject_key=subject_key,
            request_type=request_type,
            status=initial_status,
            region=region,
            submitted_at=now,
            due_at=sla.due_date(now),
        )
        saved = self._repository.save(entity)

        if self._audit_logger:
            self._audit_logger(
                action="dsar.submitted",
                entity_type="DSARRequest",
                entity_id=saved.id,
                actor=actor,
                organization=organization_id,
                metadata={
                    "request_type": saved.request_type,
                    "framework": sla.framework_code,
                    "due_at": saved.due_at.isoformat() if saved.due_at else None,
                },
                request=request,
            )
        return saved

    def transition(
        self,
        *,
        organization_id: uuid.UUID,
        request_id: uuid.UUID,
        target_status: str,
        actor=None,
        request=None,
        note: str = "",
    ) -> DSARRequestEntity:
        existing = self._repository.get(organization_id, request_id)
        if existing is None:
            raise LookupError("DSAR request not found.")

        current_state = self._state_registry.get(existing.status)
        if not current_state.can_transition_to(target_status):
            raise InvalidTransitionError(existing.status, target_status)

        now = datetime.now(timezone.utc)
        target_state = self._state_registry.get(target_status)
        updated = replace(
            existing,
            status=target_status,
            resolved_at=now if target_state.is_terminal else existing.resolved_at,
            notes=f"{existing.notes}\n{note}".strip() if note else existing.notes,
        )
        saved = self._repository.save(updated)

        if self._audit_logger:
            self._audit_logger(
                action=f"dsar.transitioned.{target_status}",
                entity_type="DSARRequest",
                entity_id=saved.id,
                actor=actor,
                organization=organization_id,
                metadata={"from": existing.status, "to": target_status},
                request=request,
            )
        return saved

    def list_requests(self, *, organization_id: uuid.UUID) -> list[DSARRequestEntity]:
        return self._repository.list_for_organization(organization_id)

    def get_request(
        self, *, organization_id: uuid.UUID, request_id: uuid.UUID
    ) -> DSARRequestEntity | None:
        return self._repository.get(organization_id, request_id)
