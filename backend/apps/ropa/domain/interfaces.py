"""Abstractions ProcessingActivityService depends on (Dependency
Inversion) — see apps.cases.domain.interfaces for the same convention."""

from __future__ import annotations

import uuid
from abc import ABC, abstractmethod
from datetime import datetime

from .entities import ProcessingActivityEntity


class ProcessingActivityRepository(ABC):
    @abstractmethod
    def save(self, activity: ProcessingActivityEntity) -> ProcessingActivityEntity:
        ...

    @abstractmethod
    def get(
        self, organization_id: uuid.UUID, activity_id: uuid.UUID
    ) -> ProcessingActivityEntity | None:
        ...

    @abstractmethod
    def list_for_organization(
        self, organization_id: uuid.UUID, status: str | None = None
    ) -> list[ProcessingActivityEntity]:
        ...


class ReviewCycleStrategy(ABC):
    """
    Encapsulates one risk level's review-cadence rule (Strategy pattern
    keyed by risk_level — same shape as apps.cases.domain.sla, which is
    keyed by case_type instead). GDPR Art. 30 requires a RoPA be kept
    up to date but doesn't mandate a fixed interval; higher-risk
    processing warrants a shorter leash between reviews.
    """

    risk_level: str

    @abstractmethod
    def next_review_date(self, from_date: datetime) -> datetime:
        ...
