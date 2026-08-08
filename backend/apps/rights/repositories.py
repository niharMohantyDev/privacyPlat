"""Django ORM implementation of DSARRequestRepository — the only place
in this module that imports the Django model (see apps.consent.repositories
for the same convention)."""

from __future__ import annotations

import uuid

from apps.rights.domain.entities import DSARRequestEntity
from apps.rights.domain.interfaces import DSARRequestRepository
from apps.rights.models import DSARRequest


class DjangoDSARRequestRepository(DSARRequestRepository):
    def save(self, request: DSARRequestEntity) -> DSARRequestEntity:
        row, _ = DSARRequest.objects.update_or_create(
            id=request.id,
            defaults={
                "organization_id": request.organization_id,
                "subject_key": request.subject_key,
                "request_type": request.request_type,
                "status": request.status,
                "region": request.region,
                "due_at": request.due_at,
                "resolved_at": request.resolved_at,
                "notes": request.notes,
            },
        )
        return self._to_entity(row)

    def get(self, organization_id: uuid.UUID, request_id: uuid.UUID) -> DSARRequestEntity | None:
        row = DSARRequest.objects.filter(organization_id=organization_id, id=request_id).first()
        return self._to_entity(row) if row else None

    def list_for_organization(self, organization_id: uuid.UUID) -> list[DSARRequestEntity]:
        return [
            self._to_entity(row)
            for row in DSARRequest.objects.filter(organization_id=organization_id)
        ]

    @staticmethod
    def _to_entity(row: DSARRequest) -> DSARRequestEntity:
        return DSARRequestEntity(
            id=row.id,
            organization_id=row.organization_id,
            subject_key=row.subject_key,
            request_type=row.request_type,
            status=row.status,
            region=row.region,
            submitted_at=row.created_at,
            due_at=row.due_at,
            resolved_at=row.resolved_at,
            notes=row.notes,
        )
