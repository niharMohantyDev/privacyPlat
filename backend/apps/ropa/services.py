"""
ProcessingActivityService — orchestrates the RoPA use cases: creating
an entry, transitioning its lifecycle status, and marking it reviewed.
Same shape as apps.cases.services.CaseService: Single Responsibility,
constructor-injected dependencies (Dependency Inversion), depends only
on interfaces.
"""

from __future__ import annotations

import uuid
from dataclasses import replace
from datetime import datetime, timezone
from typing import Callable

from apps.ropa.domain.entities import ProcessingActivityEntity
from apps.ropa.domain.exceptions import InvalidTransitionError
from apps.ropa.domain.interfaces import ProcessingActivityRepository
from apps.ropa.domain.review import ReviewCycleStrategyFactory
from apps.ropa.domain.states import ProcessingActivityStateRegistry


class ProcessingActivityService:
    def __init__(
        self,
        repository: ProcessingActivityRepository,
        audit_logger: Callable[..., None] | None = None,
        review_strategy_factory: type[ReviewCycleStrategyFactory] = ReviewCycleStrategyFactory,
        state_registry: type[ProcessingActivityStateRegistry] = ProcessingActivityStateRegistry,
    ):
        self._repository = repository
        self._audit_logger = audit_logger
        self._review_strategy_factory = review_strategy_factory
        self._state_registry = state_registry

    def create_activity(
        self,
        *,
        organization_id: uuid.UUID,
        title: str,
        legal_basis: str,
        risk_level: str = "medium",
        description: str = "",
        data_categories: str = "",
        data_subject_categories: str = "",
        recipients: str = "",
        retention_period: str = "",
        security_measures: str = "",
        owner: str = "",
        third_country_transfer: bool = False,
        transfer_safeguards: str = "",
        purpose_id: uuid.UUID | None = None,
        workspace_id: uuid.UUID | None = None,
        actor=None,
        request=None,
    ) -> ProcessingActivityEntity:
        now = datetime.now(timezone.utc)
        review_strategy = self._review_strategy_factory.get_strategy(risk_level)
        initial_status = self._state_registry.get("draft").code

        entity = ProcessingActivityEntity(
            id=uuid.uuid4(),
            organization_id=organization_id,
            title=title,
            description=description,
            legal_basis=legal_basis,
            risk_level=risk_level,
            status=initial_status,
            data_categories=data_categories,
            data_subject_categories=data_subject_categories,
            recipients=recipients,
            retention_period=retention_period,
            security_measures=security_measures,
            owner=owner,
            third_country_transfer=third_country_transfer,
            transfer_safeguards=transfer_safeguards,
            purpose_id=purpose_id,
            workspace_id=workspace_id,
            review_due_at=review_strategy.next_review_date(now),
        )
        saved = self._repository.save(entity)

        if self._audit_logger:
            self._audit_logger(
                action="ropa.activity.created",
                entity_type="ProcessingActivity",
                entity_id=saved.id,
                actor=actor,
                organization=organization_id,
                metadata={"title": saved.title, "risk_level": saved.risk_level},
                request=request,
            )
        return saved

    def transition(
        self,
        *,
        organization_id: uuid.UUID,
        activity_id: uuid.UUID,
        target_status: str,
        actor=None,
        request=None,
    ) -> ProcessingActivityEntity:
        existing = self._repository.get(organization_id, activity_id)
        if existing is None:
            raise LookupError("Processing activity not found.")

        current_state = self._state_registry.get(existing.status)
        if not current_state.can_transition_to(target_status):
            raise InvalidTransitionError(existing.status, target_status)

        updated = replace(existing, status=target_status)
        saved = self._repository.save(updated)

        if self._audit_logger:
            self._audit_logger(
                action=f"ropa.activity.transitioned.{target_status}",
                entity_type="ProcessingActivity",
                entity_id=saved.id,
                actor=actor,
                organization=organization_id,
                metadata={"from": existing.status, "to": target_status},
                request=request,
            )
        return saved

    def mark_reviewed(
        self,
        *,
        organization_id: uuid.UUID,
        activity_id: uuid.UUID,
        actor=None,
        request=None,
    ) -> ProcessingActivityEntity:
        existing = self._repository.get(organization_id, activity_id)
        if existing is None:
            raise LookupError("Processing activity not found.")

        now = datetime.now(timezone.utc)
        review_strategy = self._review_strategy_factory.get_strategy(existing.risk_level)
        updated = replace(existing, reviewed_at=now, review_due_at=review_strategy.next_review_date(now))
        saved = self._repository.save(updated)

        if self._audit_logger:
            self._audit_logger(
                action="ropa.activity.reviewed",
                entity_type="ProcessingActivity",
                entity_id=saved.id,
                actor=actor,
                organization=organization_id,
                metadata={"next_review_due_at": saved.review_due_at.isoformat() if saved.review_due_at else None},
                request=request,
            )
        return saved

    def list_activities(
        self, *, organization_id: uuid.UUID, status: str | None = None
    ) -> list[ProcessingActivityEntity]:
        return self._repository.list_for_organization(organization_id, status)
