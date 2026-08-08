"""Django ORM implementation of ProcessingActivityRepository — the only
place in this module that imports the Django model (see
apps.cases.repositories for the same convention)."""

from __future__ import annotations

import uuid

from apps.ropa.domain.entities import ProcessingActivityEntity
from apps.ropa.domain.interfaces import ProcessingActivityRepository
from apps.ropa.models import ProcessingActivity


class DjangoProcessingActivityRepository(ProcessingActivityRepository):
    def save(self, activity: ProcessingActivityEntity) -> ProcessingActivityEntity:
        row, _ = ProcessingActivity.objects.update_or_create(
            id=activity.id,
            defaults={
                "organization_id": activity.organization_id,
                "purpose_id": activity.purpose_id,
                "workspace_id": activity.workspace_id,
                "title": activity.title,
                "description": activity.description,
                "legal_basis": activity.legal_basis,
                "risk_level": activity.risk_level,
                "status": activity.status,
                "data_categories": activity.data_categories,
                "data_subject_categories": activity.data_subject_categories,
                "recipients": activity.recipients,
                "retention_period": activity.retention_period,
                "security_measures": activity.security_measures,
                "owner": activity.owner,
                "third_country_transfer": activity.third_country_transfer,
                "transfer_safeguards": activity.transfer_safeguards,
                "review_due_at": activity.review_due_at,
                "reviewed_at": activity.reviewed_at,
            },
        )
        return self._to_entity(row)

    def get(
        self, organization_id: uuid.UUID, activity_id: uuid.UUID
    ) -> ProcessingActivityEntity | None:
        row = ProcessingActivity.objects.filter(organization_id=organization_id, id=activity_id).first()
        return self._to_entity(row) if row else None

    def list_for_organization(
        self, organization_id: uuid.UUID, status: str | None = None
    ) -> list[ProcessingActivityEntity]:
        queryset = ProcessingActivity.objects.filter(organization_id=organization_id)
        if status:
            queryset = queryset.filter(status=status)
        return [self._to_entity(row) for row in queryset]

    @staticmethod
    def _to_entity(row: ProcessingActivity) -> ProcessingActivityEntity:
        return ProcessingActivityEntity(
            id=row.id,
            organization_id=row.organization_id,
            title=row.title,
            description=row.description,
            legal_basis=row.legal_basis,
            risk_level=row.risk_level,
            status=row.status,
            data_categories=row.data_categories,
            data_subject_categories=row.data_subject_categories,
            recipients=row.recipients,
            retention_period=row.retention_period,
            security_measures=row.security_measures,
            owner=row.owner,
            third_country_transfer=row.third_country_transfer,
            transfer_safeguards=row.transfer_safeguards,
            purpose_id=row.purpose_id,
            workspace_id=row.workspace_id,
            review_due_at=row.review_due_at,
            reviewed_at=row.reviewed_at,
        )
