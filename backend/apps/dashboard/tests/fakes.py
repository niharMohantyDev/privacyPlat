"""In-memory metrics-provider test doubles — same rationale as every
other app's tests.fakes."""

from apps.dashboard.domain.entities import CaseMetrics, ConsentMetrics, DSARMetrics
from apps.dashboard.domain.interfaces import CaseMetricsProvider, ConsentMetricsProvider, DSARMetricsProvider


class FakeDSARMetricsProvider(DSARMetricsProvider):
    def __init__(self, metrics: DSARMetrics):
        self._metrics = metrics

    def get_metrics(self, organization_id) -> DSARMetrics:
        return self._metrics


class FakeCaseMetricsProvider(CaseMetricsProvider):
    def __init__(self, metrics: CaseMetrics):
        self._metrics = metrics

    def get_metrics(self, organization_id) -> CaseMetrics:
        return self._metrics


class FakeConsentMetricsProvider(ConsentMetricsProvider):
    def __init__(self, metrics: ConsentMetrics):
        self._metrics = metrics

    def get_metrics(self, organization_id) -> ConsentMetrics:
        return self._metrics
