"""
Abstractions the service layer depends on (Dependency Inversion Principle).

ConsentService knows nothing about Django's ORM, sha256, or any concrete
region's rules — it only knows these interfaces. Swap the Postgres
repository for an in-memory one in tests, or add a new region's rules,
without touching ConsentService at all.
"""

from __future__ import annotations

import uuid
from abc import ABC, abstractmethod

from .entities import ConsentRecordEntity, ConsentReceipt, PurposeEntity


class ConsentRepository(ABC):
    """Persistence boundary for consent records and the purpose taxonomy."""

    @abstractmethod
    def get_purposes(self, organization_id: uuid.UUID) -> list[PurposeEntity]:
        ...

    @abstractmethod
    def save(self, record: ConsentRecordEntity) -> ConsentRecordEntity:
        ...

    @abstractmethod
    def get_latest(
        self, organization_id: uuid.UUID, subject_key: str
    ) -> ConsentRecordEntity | None:
        ...

    @abstractmethod
    def list_records(self, organization_id: uuid.UUID) -> list[ConsentRecordEntity]:
        ...


class RegionRuleStrategy(ABC):
    """
    Encapsulates one region's consent rules (Strategy pattern). Each
    supported region/framework (GDPR, DPDP, CCPA, ...) is a separate
    strategy class — adding a new region means adding a new class, not
    editing existing ones (Open/Closed Principle).
    """

    framework_code: str

    @abstractmethod
    def applies_to(self, region: str) -> bool:
        """Whether this strategy governs the given region code."""

    @abstractmethod
    def requires_opt_in(self, purpose: PurposeEntity) -> bool:
        """
        Whether a non-essential purpose defaults to opt-in-required
        (GDPR/DPDP-style) vs opt-out-available (CCPA-style).
        """


class ReceiptFactory(ABC):
    """Builds a tamper-evident ConsentReceipt from a saved record."""

    @abstractmethod
    def create(self, record: ConsentRecordEntity) -> ConsentReceipt:
        ...
