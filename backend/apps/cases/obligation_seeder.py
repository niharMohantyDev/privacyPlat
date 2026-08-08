"""
DjangoBreachObligationSeeder — the concrete hook CaseService.report_case
invokes after saving a new case. Auto-seeds the two near-universal
GDPR notification obligations (regulator, data subjects) whenever a
breach is reported, so staff land on a checklist that's already
started rather than a blank one; a vendor notification (or an extra
regulator entry, for a multi-jurisdiction breach) is still something
staff add manually via the create endpoint, since not every breach
involves a vendor.
"""

from __future__ import annotations

from apps.cases.domain.entities import CaseEntity

from .obligation_services import BreachNotificationObligationService


class DjangoBreachObligationSeeder:
    _STANDARD_RECIPIENT_TYPES = ("regulator", "data_subject")

    def __init__(self, obligation_service: BreachNotificationObligationService):
        self._obligation_service = obligation_service

    def __call__(self, case: CaseEntity) -> None:
        if case.case_type != "breach":
            return
        for recipient_type in self._STANDARD_RECIPIENT_TYPES:
            self._obligation_service.create_obligation(
                organization_id=case.organization_id,
                case_id=case.id,
                recipient_type=recipient_type,
            )
