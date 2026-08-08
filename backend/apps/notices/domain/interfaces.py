"""Abstractions PrivacyNoticeService depends on (Dependency Inversion)
— see apps.ropa.domain.interfaces for the same convention."""

from __future__ import annotations

import uuid
from abc import ABC, abstractmethod
from datetime import datetime

from .entities import PrivacyNoticeEntity


class PrivacyNoticeRepository(ABC):
    @abstractmethod
    def save(self, notice: PrivacyNoticeEntity) -> PrivacyNoticeEntity:
        ...

    @abstractmethod
    def get(self, organization_id: uuid.UUID, notice_id: uuid.UUID) -> PrivacyNoticeEntity | None:
        ...

    @abstractmethod
    def get_published(
        self, organization_id: uuid.UUID, notice_type: str
    ) -> PrivacyNoticeEntity | None:
        ...

    @abstractmethod
    def next_version_number(self, organization_id: uuid.UUID, notice_type: str) -> int:
        ...

    @abstractmethod
    def list_for_organization(
        self,
        organization_id: uuid.UUID,
        notice_type: str | None = None,
        status: str | None = None,
    ) -> list[PrivacyNoticeEntity]:
        ...


class NoticeReviewCycleStrategy(ABC):
    """
    Encapsulates one notice type's review-cadence rule (Strategy +
    Factory Method — same shape as apps.ropa.domain.review, now keyed
    by notice_type instead of risk_level). Cookie policies warrant a
    shorter leash than privacy policy/terms since the trackers they
    describe change far more often than the org's overall data
    practices.
    """

    notice_type: str

    @abstractmethod
    def next_review_date(self, from_date: datetime) -> datetime:
        ...
