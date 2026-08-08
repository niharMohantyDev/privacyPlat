"""
CaseService — orchestrates the two case use cases: reporting one and
transitioning its status. Same shape as apps.rights.services.DSARService:
Single Responsibility, constructor-injected dependencies (Dependency
Inversion), depends only on interfaces.
"""

from __future__ import annotations

import uuid
from dataclasses import replace
from datetime import datetime, timezone
from typing import Callable

from apps.cases.domain.entities import CaseEntity
from apps.cases.domain.exceptions import InvalidTransitionError
from apps.cases.domain.interfaces import CaseNotifier, CaseRepository
from apps.cases.domain.sla import CaseSLAStrategyFactory
from apps.cases.domain.states import CaseStateRegistry


class CaseService:
    def __init__(
        self,
        repository: CaseRepository,
        notifier: CaseNotifier | None = None,
        audit_logger: Callable[..., None] | None = None,
        sla_strategy_factory: type[CaseSLAStrategyFactory] = CaseSLAStrategyFactory,
        state_registry: type[CaseStateRegistry] = CaseStateRegistry,
        on_case_reported: Callable[[CaseEntity], None] | None = None,
    ):
        self._repository = repository
        self._notifier = notifier
        self._audit_logger = audit_logger
        self._sla_strategy_factory = sla_strategy_factory
        self._state_registry = state_registry
        # Optional extension point invoked after a case is saved and
        # notified — e.g. DjangoBreachObligationSeeder, which auto-adds
        # the standard notification checklist when the report is a
        # breach. Decides its own relevance; CaseService just calls it.
        self._on_case_reported = on_case_reported

    def report_case(
        self,
        *,
        organization_id: uuid.UUID,
        case_type: str,
        title: str,
        description: str = "",
        reported_by: str = "",
        region: str = "",
        severity: str = "",
        actor=None,
        request=None,
    ) -> CaseEntity:
        now = datetime.now(timezone.utc)
        sla = self._sla_strategy_factory.get_strategy(case_type)
        initial_status = self._state_registry.get("reported").code

        entity = CaseEntity(
            id=uuid.uuid4(),
            organization_id=organization_id,
            case_type=case_type,
            status=initial_status,
            title=title,
            description=description,
            reported_by=reported_by,
            region=region,
            severity=severity,
            reported_at=now,
            due_at=sla.due_date(now),
        )
        saved = self._repository.save(entity)

        if self._audit_logger:
            self._audit_logger(
                action=f"case.{case_type}.reported",
                entity_type="Case",
                entity_id=saved.id,
                actor=actor,
                organization=organization_id,
                metadata={"title": saved.title, "due_at": saved.due_at.isoformat() if saved.due_at else None},
                request=request,
            )
        if self._notifier:
            self._notifier.notify_reported(saved)
        if self._on_case_reported:
            self._on_case_reported(saved)

        return saved

    def transition(
        self,
        *,
        organization_id: uuid.UUID,
        case_id: uuid.UUID,
        target_status: str,
        actor=None,
        request=None,
        note: str = "",
    ) -> CaseEntity:
        existing = self._repository.get(organization_id, case_id)
        if existing is None:
            raise LookupError("Case not found.")

        current_state = self._state_registry.get(existing.status)
        if not current_state.can_transition_to(target_status):
            raise InvalidTransitionError(existing.status, target_status)

        now = datetime.now(timezone.utc)
        updated = replace(
            existing,
            status=target_status,
            resolved_at=now if target_status == "resolved" else existing.resolved_at,
            notes=f"{existing.notes}\n{note}".strip() if note else existing.notes,
        )
        saved = self._repository.save(updated)

        if self._audit_logger:
            self._audit_logger(
                action=f"case.transitioned.{target_status}",
                entity_type="Case",
                entity_id=saved.id,
                actor=actor,
                organization=organization_id,
                metadata={"from": existing.status, "to": target_status},
                request=request,
            )
        if self._notifier and target_status == "resolved":
            self._notifier.notify_resolved(saved)

        return saved

    def list_cases(self, *, organization_id: uuid.UUID, case_type: str | None = None) -> list[CaseEntity]:
        return self._repository.list_for_organization(organization_id, case_type)
