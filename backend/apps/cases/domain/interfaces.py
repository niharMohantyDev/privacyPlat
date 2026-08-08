"""Abstractions CaseService depends on (Dependency Inversion) — see
apps.rights.domain.interfaces for the same convention."""

from __future__ import annotations

import uuid
from abc import ABC, abstractmethod
from datetime import datetime

from .entities import CaseEntity


class CaseRepository(ABC):
    @abstractmethod
    def save(self, case: CaseEntity) -> CaseEntity:
        ...

    @abstractmethod
    def get(self, organization_id: uuid.UUID, case_id: uuid.UUID) -> CaseEntity | None:
        ...

    @abstractmethod
    def list_for_organization(
        self, organization_id: uuid.UUID, case_type: str | None = None
    ) -> list[CaseEntity]:
        ...


class CaseSLAStrategy(ABC):
    """
    Encapsulates one case type's response-urgency rule (Strategy pattern
    keyed by case_type rather than region this time — breach and
    grievance differ far more in how fast they must be acted on than by
    jurisdiction, unlike Consent/Rights).
    """

    case_type: str

    @abstractmethod
    def due_date(self, reported_at: datetime) -> datetime:
        ...


class CaseNotifier(ABC):
    """
    Boundary to the notification system (apps.notifications), kept
    behind an interface for the same reason the repository is: it lets
    CaseService be unit-tested without a database, and it means
    CaseService doesn't need to know Notification is a Django model
    with a channel/recipient/payload shape — only that "something" gets
    told when a case is reported or resolved.
    """

    @abstractmethod
    def notify_reported(self, case: CaseEntity) -> None:
        ...

    @abstractmethod
    def notify_resolved(self, case: CaseEntity) -> None:
        ...
