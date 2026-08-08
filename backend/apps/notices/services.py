"""
PrivacyNoticeService — orchestrates the notice-versioning use cases:
drafting a new version, publishing it, and archiving. Same shape as
apps.ropa.services.ProcessingActivityService: Single Responsibility,
constructor-injected dependencies (Dependency Inversion), depends only
on interfaces.
"""

from __future__ import annotations

import uuid
from dataclasses import replace
from datetime import datetime, timezone
from typing import Callable

from apps.notices.domain.entities import PrivacyNoticeEntity
from apps.notices.domain.exceptions import InvalidTransitionError
from apps.notices.domain.interfaces import PrivacyNoticeRepository
from apps.notices.domain.review import NoticeReviewCycleStrategyFactory
from apps.notices.domain.states import NoticeStateRegistry


class PrivacyNoticeService:
    def __init__(
        self,
        repository: PrivacyNoticeRepository,
        audit_logger: Callable[..., None] | None = None,
        review_strategy_factory: type[NoticeReviewCycleStrategyFactory] = NoticeReviewCycleStrategyFactory,
        state_registry: type[NoticeStateRegistry] = NoticeStateRegistry,
    ):
        self._repository = repository
        self._audit_logger = audit_logger
        self._review_strategy_factory = review_strategy_factory
        self._state_registry = state_registry

    def create_draft(
        self,
        *,
        organization_id: uuid.UUID,
        notice_type: str,
        title: str,
        body: str = "",
        change_summary: str = "",
        actor=None,
        request=None,
    ) -> PrivacyNoticeEntity:
        version = self._repository.next_version_number(organization_id, notice_type)
        entity = PrivacyNoticeEntity(
            id=uuid.uuid4(),
            organization_id=organization_id,
            notice_type=notice_type,
            title=title,
            body=body,
            version=version,
            status=self._state_registry.get("draft").code,
            change_summary=change_summary,
            published_at=None,
        )
        saved = self._repository.save(entity)

        if self._audit_logger:
            self._audit_logger(
                action="notice.draft.created",
                entity_type="PrivacyNotice",
                entity_id=saved.id,
                actor=actor,
                organization=organization_id,
                metadata={"notice_type": notice_type, "version": version},
                request=request,
            )
        return saved

    def publish(
        self, *, organization_id: uuid.UUID, notice_id: uuid.UUID, actor=None, request=None
    ) -> PrivacyNoticeEntity:
        existing = self._repository.get(organization_id, notice_id)
        if existing is None:
            raise LookupError("Notice not found.")

        current_state = self._state_registry.get(existing.status)
        if not current_state.can_transition_to("published"):
            raise InvalidTransitionError(existing.status, "published")

        # Only one published version per notice_type at a time — whatever
        # was live before this gets superseded, not left dangling as a
        # second "published" row.
        previously_published = self._repository.get_published(organization_id, existing.notice_type)
        if previously_published and previously_published.id != existing.id:
            self._repository.save(replace(previously_published, status="archived"))

        now = datetime.now(timezone.utc)
        review_strategy = self._review_strategy_factory.get_strategy(existing.notice_type)
        updated = replace(
            existing, status="published", published_at=now, review_due_at=review_strategy.next_review_date(now)
        )
        saved = self._repository.save(updated)

        if self._audit_logger:
            self._audit_logger(
                action="notice.published",
                entity_type="PrivacyNotice",
                entity_id=saved.id,
                actor=actor,
                organization=organization_id,
                metadata={"notice_type": saved.notice_type, "version": saved.version},
                request=request,
            )
        return saved

    def archive(
        self, *, organization_id: uuid.UUID, notice_id: uuid.UUID, actor=None, request=None
    ) -> PrivacyNoticeEntity:
        existing = self._repository.get(organization_id, notice_id)
        if existing is None:
            raise LookupError("Notice not found.")

        current_state = self._state_registry.get(existing.status)
        if not current_state.can_transition_to("archived"):
            raise InvalidTransitionError(existing.status, "archived")

        saved = self._repository.save(replace(existing, status="archived"))

        if self._audit_logger:
            self._audit_logger(
                action="notice.archived",
                entity_type="PrivacyNotice",
                entity_id=saved.id,
                actor=actor,
                organization=organization_id,
                metadata={"notice_type": saved.notice_type, "version": saved.version},
                request=request,
            )
        return saved

    def get_published(self, *, organization_id: uuid.UUID, notice_type: str) -> PrivacyNoticeEntity:
        notice = self._repository.get_published(organization_id, notice_type)
        if notice is None:
            raise LookupError("No published notice of this type.")
        return notice

    def list_notices(
        self, *, organization_id: uuid.UUID, notice_type: str | None = None, status: str | None = None
    ) -> list[PrivacyNoticeEntity]:
        return self._repository.list_for_organization(organization_id, notice_type, status)
