import uuid

from apps.dashboard.domain.entities import CaseMetrics, ConsentMetrics, DSARMetrics
from apps.dashboard.services import ComplianceDashboardService

from .fakes import FakeCaseMetricsProvider, FakeConsentMetricsProvider, FakeDSARMetricsProvider

ORG_ID = uuid.uuid4()


def test_get_summary_composes_all_three_pillars():
    dsar_metrics = DSARMetrics(total=10, open=4, overdue=1, resolved_on_time=5, resolved_late=1)
    case_metrics = CaseMetrics(total=3, open=2, overdue=0, breach_open=1, grievance_open=1)
    consent_metrics = ConsentMetrics(total_purposes=5, total_consent_records=100, opt_in_rate=72.5)

    service = ComplianceDashboardService(
        dsar_provider=FakeDSARMetricsProvider(dsar_metrics),
        case_provider=FakeCaseMetricsProvider(case_metrics),
        consent_provider=FakeConsentMetricsProvider(consent_metrics),
    )

    summary = service.get_summary(ORG_ID)

    assert summary.dsar is dsar_metrics
    assert summary.cases is case_metrics
    assert summary.consent is consent_metrics
    assert summary.generated_at is not None


def test_dsar_on_time_rate_is_none_when_nothing_resolved():
    metrics = DSARMetrics(total=2, open=2, overdue=0, resolved_on_time=0, resolved_late=0)
    assert metrics.on_time_rate is None


def test_dsar_on_time_rate_computed_as_percentage():
    metrics = DSARMetrics(total=4, open=0, overdue=0, resolved_on_time=3, resolved_late=1)
    assert metrics.on_time_rate == 75.0
