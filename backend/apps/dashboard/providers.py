"""
Concrete metrics providers — each one queries a single other app's
models directly (a deliberate, narrow exception to "only the owning
app's repository touches its models": this is a cross-cutting
read-model/reporting concern, not a write path, so it doesn't go
through DSARService/CaseService/ConsentService). If any of those three
apps' schemas change, only this file needs to change.
"""

from __future__ import annotations

import uuid

from django.db.models import F
from django.utils import timezone

from apps.cases.models import Case
from apps.consent.models import ConsentDecision, ConsentRecord, Purpose
from apps.rights.models import DSARRequest

from .domain.entities import CaseMetrics, ConsentMetrics, DSARMetrics
from .domain.interfaces import CaseMetricsProvider, ConsentMetricsProvider, DSARMetricsProvider

DSAR_TERMINAL_STATUSES = [
    DSARRequest.Status.COMPLETED,
    DSARRequest.Status.REJECTED,
    DSARRequest.Status.WITHDRAWN,
]
CASE_TERMINAL_STATUSES = [Case.Status.CLOSED, Case.Status.DISMISSED]


class DjangoDSARMetricsProvider(DSARMetricsProvider):
    def get_metrics(self, organization_id: uuid.UUID) -> DSARMetrics:
        now = timezone.now()
        qs = DSARRequest.objects.filter(organization_id=organization_id)
        open_qs = qs.exclude(status__in=DSAR_TERMINAL_STATUSES)
        resolved_qs = qs.filter(status__in=DSAR_TERMINAL_STATUSES, resolved_at__isnull=False)
        resolved_on_time = resolved_qs.filter(due_at__gte=F("resolved_at")).count()

        return DSARMetrics(
            total=qs.count(),
            open=open_qs.count(),
            overdue=open_qs.filter(due_at__lt=now).count(),
            resolved_on_time=resolved_on_time,
            resolved_late=resolved_qs.count() - resolved_on_time,
        )


class DjangoCaseMetricsProvider(CaseMetricsProvider):
    def get_metrics(self, organization_id: uuid.UUID) -> CaseMetrics:
        now = timezone.now()
        qs = Case.objects.filter(organization_id=organization_id)
        open_qs = qs.exclude(status__in=CASE_TERMINAL_STATUSES)

        return CaseMetrics(
            total=qs.count(),
            open=open_qs.count(),
            overdue=open_qs.filter(due_at__lt=now).count(),
            breach_open=open_qs.filter(case_type=Case.CaseType.BREACH).count(),
            grievance_open=open_qs.filter(case_type=Case.CaseType.GRIEVANCE).count(),
        )


class DjangoConsentMetricsProvider(ConsentMetricsProvider):
    def get_metrics(self, organization_id: uuid.UUID) -> ConsentMetrics:
        # Essential purposes are always granted and can't be denied (see
        # apps.consent.models.Purpose), so they're excluded here — folding
        # them in would trivially inflate the opt-in rate toward 100%.
        decisions = ConsentDecision.objects.filter(
            record__organization_id=organization_id, purpose__is_essential=False
        )
        total_decisions = decisions.count()
        granted = decisions.filter(granted=True).count()

        return ConsentMetrics(
            total_purposes=Purpose.objects.filter(organization_id=organization_id).count(),
            total_consent_records=ConsentRecord.objects.filter(
                organization_id=organization_id
            ).count(),
            opt_in_rate=round(granted / total_decisions * 100, 1) if total_decisions else None,
        )
