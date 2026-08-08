"""Django ORM implementation of PrivacyNoticeRepository — the only
place in this module that imports the Django model (see
apps.ropa.repositories for the same convention)."""

from __future__ import annotations

import uuid

from apps.notices.domain.entities import PrivacyNoticeEntity
from apps.notices.domain.interfaces import PrivacyNoticeRepository
from apps.notices.models import PrivacyNotice


class DjangoPrivacyNoticeRepository(PrivacyNoticeRepository):
    def save(self, notice: PrivacyNoticeEntity) -> PrivacyNoticeEntity:
        row, _ = PrivacyNotice.objects.update_or_create(
            id=notice.id,
            defaults={
                "organization_id": notice.organization_id,
                "notice_type": notice.notice_type,
                "title": notice.title,
                "body": notice.body,
                "version": notice.version,
                "status": notice.status,
                "change_summary": notice.change_summary,
                "published_at": notice.published_at,
                "review_due_at": notice.review_due_at,
            },
        )
        return self._to_entity(row)

    def get(self, organization_id: uuid.UUID, notice_id: uuid.UUID) -> PrivacyNoticeEntity | None:
        row = PrivacyNotice.objects.filter(organization_id=organization_id, id=notice_id).first()
        return self._to_entity(row) if row else None

    def get_published(
        self, organization_id: uuid.UUID, notice_type: str
    ) -> PrivacyNoticeEntity | None:
        row = (
            PrivacyNotice.objects.filter(
                organization_id=organization_id,
                notice_type=notice_type,
                status=PrivacyNotice.Status.PUBLISHED,
            )
            .order_by("-version")
            .first()
        )
        return self._to_entity(row) if row else None

    def next_version_number(self, organization_id: uuid.UUID, notice_type: str) -> int:
        latest = (
            PrivacyNotice.objects.filter(organization_id=organization_id, notice_type=notice_type)
            .order_by("-version")
            .first()
        )
        return (latest.version + 1) if latest else 1

    def list_for_organization(
        self,
        organization_id: uuid.UUID,
        notice_type: str | None = None,
        status: str | None = None,
    ) -> list[PrivacyNoticeEntity]:
        queryset = PrivacyNotice.objects.filter(organization_id=organization_id)
        if notice_type:
            queryset = queryset.filter(notice_type=notice_type)
        if status:
            queryset = queryset.filter(status=status)
        return [self._to_entity(row) for row in queryset]

    @staticmethod
    def _to_entity(row: PrivacyNotice) -> PrivacyNoticeEntity:
        return PrivacyNoticeEntity(
            id=row.id,
            organization_id=row.organization_id,
            notice_type=row.notice_type,
            title=row.title,
            body=row.body,
            version=row.version,
            status=row.status,
            change_summary=row.change_summary,
            published_at=row.published_at,
            review_due_at=row.review_due_at,
        )
