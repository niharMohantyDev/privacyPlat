"""Abstractions DSARService depends on (Dependency Inversion) — see
apps.consent.domain.interfaces for the same convention applied there."""

from __future__ import annotations

import uuid
from abc import ABC, abstractmethod
from datetime import datetime

from .entities import DSARRequestEntity


class DSARRequestRepository(ABC):
    @abstractmethod
    def save(self, request: DSARRequestEntity) -> DSARRequestEntity:
        ...

    @abstractmethod
    def get(self, organization_id: uuid.UUID, request_id: uuid.UUID) -> DSARRequestEntity | None:
        ...

    @abstractmethod
    def list_for_organization(self, organization_id: uuid.UUID) -> list[DSARRequestEntity]:
        ...


class SLAStrategy(ABC):
    """
    Encapsulates one jurisdiction's statutory response deadline (Strategy
    pattern — same shape as apps.consent.domain.strategies.RegionRuleStrategy,
    deliberately not shared code: Rights and Consent are different bounded
    contexts that happen to both need region-aware rules).
    """

    framework_code: str

    @abstractmethod
    def applies_to(self, region: str) -> bool:
        ...

    @abstractmethod
    def due_date(self, submitted_at: datetime) -> datetime:
        ...
