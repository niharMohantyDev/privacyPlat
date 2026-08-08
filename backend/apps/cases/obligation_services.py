"""
BreachNotificationObligationService — orchestrates the notification-
obligation use cases: adding a recipient to a breach's checklist,
marking one notified, and marking one not required. Same shape as
apps.cases.services.CaseService: Single Responsibility, constructor-
injected dependencies (Dependency Inversion), depends only on
interfaces — including CaseRepository, used only to validate a target
case exists and is actually a breach before an obligation can be
attached to it.
"""

from __future__ import annotations

import uuid
from dataclasses import replace
from datetime import datetime, timezone
from typing import Callable

from apps.cases.domain.exceptions import InvalidTransitionError
from apps.cases.domain.interfaces import CaseRepository
from apps.cases.domain.obligation_due_dates import ObligationDueDateStrategyFactory
from apps.cases.domain.obligation_entities import BreachNotificationObligationEntity
from apps.cases.domain.obligation_interfaces import BreachNotificationObligationRepository
from apps.cases.domain.obligation_states import ObligationStateRegistry


class BreachNotificationObligationService:
    def __init__(
        self,
        repository: BreachNotificationObligationRepository,
        case_repository: CaseRepository,
        audit_logger: Callable[..., None] | None = None,
        due_date_strategy_factory: type[ObligationDueDateStrategyFactory] = ObligationDueDateStrategyFactory,
        state_registry: type[ObligationStateRegistry] = ObligationStateRegistry,
    ):
        self._repository = repository
        self._case_repository = case_repository
        self._audit_logger = audit_logger
        self._due_date_strategy_factory = due_date_strategy_factory
        self._state_registry = state_registry

    def create_obligation(
        self,
        *,
        organization_id: uuid.UUID,
        case_id: uuid.UUID,
        recipient_type: str,
        recipient_identifier: str = "",
        actor=None,
        request=None,
    ) -> BreachNotificationObligationEntity:
        case = self._case_repository.get(organization_id, case_id)
        if case is None:
            raise LookupError("Case not found.")
        if case.case_type != "breach":
            raise ValueError("Notification obligations can only be attached to breach cases.")

        strategy = self._due_date_strategy_factory.get_strategy(recipient_type)
        detected_at = case.reported_at or datetime.now(timezone.utc)

        entity = BreachNotificationObligationEntity(
            id=uuid.uuid4(),
            case_id=case_id,
            organization_id=organization_id,
            recipient_type=recipient_type,
            recipient_identifier=recipient_identifier,
            status=self._state_registry.get("pending").code,
            due_at=strategy.due_date(detected_at),
        )
        saved = self._repository.save(entity)

        if self._audit_logger:
            self._audit_logger(
                action="case.breach.obligation.created",
                entity_type="BreachNotificationObligation",
                entity_id=saved.id,
                actor=actor,
                organization=organization_id,
                metadata={"case_id": str(case_id), "recipient_type": recipient_type},
                request=request,
            )
        return saved

    def mark_notified(
        self, *, organization_id: uuid.UUID, obligation_id: uuid.UUID, actor=None, request=None, notes: str = ""
    ) -> BreachNotificationObligationEntity:
        return self._transition(
            organization_id=organization_id,
            obligation_id=obligation_id,
            target_status="notified",
            actor=actor,
            request=request,
            notes=notes,
            set_notified_at=True,
        )

    def mark_not_required(
        self, *, organization_id: uuid.UUID, obligation_id: uuid.UUID, actor=None, request=None, notes: str = ""
    ) -> BreachNotificationObligationEntity:
        return self._transition(
            organization_id=organization_id,
            obligation_id=obligation_id,
            target_status="not_required",
            actor=actor,
            request=request,
            notes=notes,
            set_notified_at=False,
        )

    def _transition(
        self,
        *,
        organization_id: uuid.UUID,
        obligation_id: uuid.UUID,
        target_status: str,
        actor,
        request,
        notes: str,
        set_notified_at: bool,
    ) -> BreachNotificationObligationEntity:
        existing = self._repository.get(organization_id, obligation_id)
        if existing is None:
            raise LookupError("Notification obligation not found.")

        current_state = self._state_registry.get(existing.status)
        if not current_state.can_transition_to(target_status):
            raise InvalidTransitionError(existing.status, target_status)

        now = datetime.now(timezone.utc)
        updated = replace(
            existing,
            status=target_status,
            notified_at=now if set_notified_at else existing.notified_at,
            notes=f"{existing.notes}\n{notes}".strip() if notes else existing.notes,
        )
        saved = self._repository.save(updated)

        if self._audit_logger:
            self._audit_logger(
                action=f"case.breach.obligation.{target_status}",
                entity_type="BreachNotificationObligation",
                entity_id=saved.id,
                actor=actor,
                organization=organization_id,
                metadata={"case_id": str(saved.case_id), "recipient_type": saved.recipient_type},
                request=request,
            )
        return saved

    def list_for_case(
        self, *, organization_id: uuid.UUID, case_id: uuid.UUID
    ) -> list[BreachNotificationObligationEntity]:
        return self._repository.list_for_case(organization_id, case_id)
