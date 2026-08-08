from datetime import timedelta

import pytest
from django.utils import timezone

from apps.cases.models import Case
from apps.consent.models import ConsentDecision, ConsentRecord, Purpose
from apps.core.models import Organization
from apps.dashboard.providers import (
    DjangoCaseMetricsProvider,
    DjangoConsentMetricsProvider,
    DjangoDSARMetricsProvider,
)
from apps.rights.models import DSARRequest

NOW = timezone.now()


@pytest.fixture
def org(db):
    return Organization.objects.create(name="Acme", slug="acme")


class TestDjangoDSARMetricsProvider:
    def test_counts_total_open_and_overdue(self, org):
        DSARRequest.objects.create(
            organization=org, subject_key="a@x.com", request_type="access", region="DE",
            status=DSARRequest.Status.SUBMITTED, due_at=NOW - timedelta(days=1),
        )
        DSARRequest.objects.create(
            organization=org, subject_key="b@x.com", request_type="access", region="DE",
            status=DSARRequest.Status.IN_PROGRESS, due_at=NOW + timedelta(days=5),
        )
        DSARRequest.objects.create(
            organization=org, subject_key="c@x.com", request_type="access", region="DE",
            status=DSARRequest.Status.COMPLETED, due_at=NOW - timedelta(days=1),
            resolved_at=NOW - timedelta(days=2),
        )

        metrics = DjangoDSARMetricsProvider().get_metrics(org.id)

        assert metrics.total == 3
        assert metrics.open == 2
        assert metrics.overdue == 1

    def test_resolved_on_time_vs_late(self, org):
        DSARRequest.objects.create(
            organization=org, subject_key="a@x.com", request_type="access", region="DE",
            status=DSARRequest.Status.COMPLETED,
            due_at=NOW, resolved_at=NOW - timedelta(days=1),
        )
        DSARRequest.objects.create(
            organization=org, subject_key="b@x.com", request_type="access", region="DE",
            status=DSARRequest.Status.REJECTED,
            due_at=NOW - timedelta(days=2), resolved_at=NOW,
        )

        metrics = DjangoDSARMetricsProvider().get_metrics(org.id)

        assert metrics.resolved_on_time == 1
        assert metrics.resolved_late == 1
        assert metrics.on_time_rate == 50.0

    def test_scoped_to_organization(self, org):
        other_org = Organization.objects.create(name="Other", slug="other")
        DSARRequest.objects.create(
            organization=other_org, subject_key="a@x.com", request_type="access", region="DE"
        )
        metrics = DjangoDSARMetricsProvider().get_metrics(org.id)
        assert metrics.total == 0


class TestDjangoCaseMetricsProvider:
    def test_counts_total_open_overdue_and_by_type(self, org):
        Case.objects.create(
            organization=org, case_type=Case.CaseType.BREACH, title="Leak",
            status=Case.Status.REPORTED, due_at=NOW - timedelta(days=1),
        )
        Case.objects.create(
            organization=org, case_type=Case.CaseType.GRIEVANCE, title="Complaint",
            status=Case.Status.INVESTIGATING, due_at=NOW + timedelta(days=10),
        )
        Case.objects.create(
            organization=org, case_type=Case.CaseType.BREACH, title="Old leak",
            status=Case.Status.CLOSED, due_at=NOW - timedelta(days=30),
        )

        metrics = DjangoCaseMetricsProvider().get_metrics(org.id)

        assert metrics.total == 3
        assert metrics.open == 2
        assert metrics.overdue == 1
        assert metrics.breach_open == 1
        assert metrics.grievance_open == 1


class TestDjangoConsentMetricsProvider:
    def test_counts_purposes_records_and_opt_in_rate_excluding_essential(self, org):
        essential = Purpose.objects.create(
            organization=org, code="essential", name="Essential", is_essential=True
        )
        analytics = Purpose.objects.create(organization=org, code="analytics", name="Analytics")
        marketing = Purpose.objects.create(organization=org, code="marketing", name="Marketing")

        record = ConsentRecord.objects.create(
            organization=org, subject_key="visitor-1", region="DE", framework="GDPR"
        )
        ConsentDecision.objects.create(record=record, purpose=essential, granted=True)
        ConsentDecision.objects.create(record=record, purpose=analytics, granted=True)
        ConsentDecision.objects.create(record=record, purpose=marketing, granted=False)

        metrics = DjangoConsentMetricsProvider().get_metrics(org.id)

        assert metrics.total_purposes == 3
        assert metrics.total_consent_records == 1
        assert metrics.opt_in_rate == 50.0  # 1 of 2 non-essential decisions granted

    def test_opt_in_rate_is_none_with_no_non_essential_decisions(self, org):
        metrics = DjangoConsentMetricsProvider().get_metrics(org.id)
        assert metrics.opt_in_rate is None
