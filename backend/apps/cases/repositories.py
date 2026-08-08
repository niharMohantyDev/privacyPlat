"""Django ORM implementation of CaseRepository — the only place in this
module that imports the Django model (see apps.rights.repositories for
the same convention)."""

from __future__ import annotations

import uuid

from apps.cases.domain.entities import CaseEntity
from apps.cases.domain.interfaces import CaseRepository
from apps.cases.models import Case


class DjangoCaseRepository(CaseRepository):
    def save(self, case: CaseEntity) -> CaseEntity:
        row, _ = Case.objects.update_or_create(
            id=case.id,
            defaults={
                "organization_id": case.organization_id,
                "case_type": case.case_type,
                "status": case.status,
                "title": case.title,
                "description": case.description,
                "reported_by": case.reported_by,
                "region": case.region,
                "severity": case.severity,
                "due_at": case.due_at,
                "resolved_at": case.resolved_at,
                "notes": case.notes,
            },
        )
        return self._to_entity(row)

    def get(self, organization_id: uuid.UUID, case_id: uuid.UUID) -> CaseEntity | None:
        row = Case.objects.filter(organization_id=organization_id, id=case_id).first()
        return self._to_entity(row) if row else None

    def list_for_organization(
        self, organization_id: uuid.UUID, case_type: str | None = None
    ) -> list[CaseEntity]:
        queryset = Case.objects.filter(organization_id=organization_id)
        if case_type:
            queryset = queryset.filter(case_type=case_type)
        return [self._to_entity(row) for row in queryset]

    @staticmethod
    def _to_entity(row: Case) -> CaseEntity:
        return CaseEntity(
            id=row.id,
            organization_id=row.organization_id,
            case_type=row.case_type,
            status=row.status,
            title=row.title,
            description=row.description,
            reported_by=row.reported_by,
            region=row.region,
            severity=row.severity,
            reported_at=row.created_at,
            due_at=row.due_at,
            resolved_at=row.resolved_at,
            notes=row.notes,
        )
