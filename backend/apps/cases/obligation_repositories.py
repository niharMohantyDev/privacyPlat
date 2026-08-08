"""Django ORM implementation of BreachNotificationObligationRepository
— the only place in this module that imports the Django model (see
apps.cases.repositories for the same convention)."""

from __future__ import annotations

import uuid

from apps.cases.domain.obligation_entities import BreachNotificationObligationEntity
from apps.cases.domain.obligation_interfaces import BreachNotificationObligationRepository
from apps.cases.models import BreachNotificationObligation


class DjangoBreachNotificationObligationRepository(BreachNotificationObligationRepository):
    def save(
        self, obligation: BreachNotificationObligationEntity
    ) -> BreachNotificationObligationEntity:
        row, _ = BreachNotificationObligation.objects.update_or_create(
            id=obligation.id,
            defaults={
                "case_id": obligation.case_id,
                "organization_id": obligation.organization_id,
                "recipient_type": obligation.recipient_type,
                "recipient_identifier": obligation.recipient_identifier,
                "status": obligation.status,
                "due_at": obligation.due_at,
                "notified_at": obligation.notified_at,
                "notes": obligation.notes,
            },
        )
        return self._to_entity(row)

    def get(
        self, organization_id: uuid.UUID, obligation_id: uuid.UUID
    ) -> BreachNotificationObligationEntity | None:
        row = BreachNotificationObligation.objects.filter(
            organization_id=organization_id, id=obligation_id
        ).first()
        return self._to_entity(row) if row else None

    def list_for_case(
        self, organization_id: uuid.UUID, case_id: uuid.UUID
    ) -> list[BreachNotificationObligationEntity]:
        queryset = BreachNotificationObligation.objects.filter(
            organization_id=organization_id, case_id=case_id
        )
        return [self._to_entity(row) for row in queryset]

    @staticmethod
    def _to_entity(row: BreachNotificationObligation) -> BreachNotificationObligationEntity:
        return BreachNotificationObligationEntity(
            id=row.id,
            case_id=row.case_id,
            organization_id=row.organization_id,
            recipient_type=row.recipient_type,
            recipient_identifier=row.recipient_identifier,
            status=row.status,
            due_at=row.due_at,
            notified_at=row.notified_at,
            notes=row.notes,
        )
