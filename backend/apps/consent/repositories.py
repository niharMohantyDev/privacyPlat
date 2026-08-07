"""
Django ORM implementation of ConsentRepository (Repository pattern).

This is the only place in the module that imports the Django models —
ConsentService and everything in domain/ stay ORM-agnostic. Translating
between rows and entities happens at this single boundary.
"""

from __future__ import annotations

import uuid

from django.db import transaction

from apps.consent.domain.entities import (
    ConsentDecisionEntity,
    ConsentRecordEntity,
    PurposeEntity,
)
from apps.consent.domain.interfaces import ConsentRepository
from apps.consent.models import ConsentDecision, ConsentRecord, Purpose


class DjangoConsentRepository(ConsentRepository):
    def get_purposes(self, organization_id: uuid.UUID) -> list[PurposeEntity]:
        return [
            self._purpose_to_entity(p)
            for p in Purpose.objects.filter(organization_id=organization_id)
        ]

    @transaction.atomic
    def save(self, record: ConsentRecordEntity) -> ConsentRecordEntity:
        purposes_by_code = {
            p.code: p
            for p in Purpose.objects.filter(
                organization_id=record.organization_id,
                code__in=[d.purpose_code for d in record.decisions],
            )
        }

        row = ConsentRecord.objects.create(
            id=record.id,
            organization_id=record.organization_id,
            asset_id=record.asset_id,
            subject_key=record.subject_key,
            region=record.region,
            framework=record.framework,
            version=record.version,
        )
        ConsentDecision.objects.bulk_create(
            ConsentDecision(
                record=row,
                purpose=purposes_by_code[decision.purpose_code],
                granted=decision.granted,
            )
            for decision in record.decisions
        )
        return self._record_to_entity(row, record.decisions)

    def get_latest(
        self, organization_id: uuid.UUID, subject_key: str
    ) -> ConsentRecordEntity | None:
        row = (
            ConsentRecord.objects.filter(
                organization_id=organization_id, subject_key=subject_key
            )
            .prefetch_related("decisions__purpose")
            .order_by("-version")
            .first()
        )
        if row is None:
            return None
        decisions = tuple(
            ConsentDecisionEntity(purpose_code=d.purpose.code, granted=d.granted)
            for d in row.decisions.all()
        )
        return self._record_to_entity(row, decisions)

    @staticmethod
    def _purpose_to_entity(purpose: Purpose) -> PurposeEntity:
        return PurposeEntity(
            id=purpose.id,
            code=purpose.code,
            name=purpose.name,
            is_essential=purpose.is_essential,
        )

    @staticmethod
    def _record_to_entity(
        row: ConsentRecord, decisions: tuple[ConsentDecisionEntity, ...]
    ) -> ConsentRecordEntity:
        return ConsentRecordEntity(
            id=row.id,
            organization_id=row.organization_id,
            asset_id=row.asset_id,
            subject_key=row.subject_key,
            region=row.region,
            framework=row.framework,
            version=row.version,
            decisions=decisions,
            created_at=row.created_at,
        )
