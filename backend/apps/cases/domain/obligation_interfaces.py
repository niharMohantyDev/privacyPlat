"""Abstractions BreachNotificationObligationService depends on
(Dependency Inversion) — see apps.cases.domain.interfaces for the same
convention."""

from __future__ import annotations

import uuid
from abc import ABC, abstractmethod
from datetime import datetime

from .obligation_entities import BreachNotificationObligationEntity


class BreachNotificationObligationRepository(ABC):
    @abstractmethod
    def save(
        self, obligation: BreachNotificationObligationEntity
    ) -> BreachNotificationObligationEntity:
        ...

    @abstractmethod
    def get(
        self, organization_id: uuid.UUID, obligation_id: uuid.UUID
    ) -> BreachNotificationObligationEntity | None:
        ...

    @abstractmethod
    def list_for_case(
        self, organization_id: uuid.UUID, case_id: uuid.UUID
    ) -> list[BreachNotificationObligationEntity]:
        ...


class ObligationDueDateStrategy(ABC):
    """
    Encapsulates one recipient type's notification deadline (Strategy
    pattern keyed by recipient_type — same shape as
    apps.cases.domain.sla, which is keyed by case_type). Deadline
    values are placeholders pending legal confirmation of the actual
    regulatory/contractual windows, same caveat as apps.cases.domain.sla.
    """

    recipient_type: str

    @abstractmethod
    def due_date(self, detected_at: datetime) -> datetime:
        ...
