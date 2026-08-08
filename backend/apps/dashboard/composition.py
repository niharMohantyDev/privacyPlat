from .providers import DjangoCaseMetricsProvider, DjangoConsentMetricsProvider, DjangoDSARMetricsProvider
from .services import ComplianceDashboardService


def build_dashboard_service() -> ComplianceDashboardService:
    return ComplianceDashboardService(
        dsar_provider=DjangoDSARMetricsProvider(),
        case_provider=DjangoCaseMetricsProvider(),
        consent_provider=DjangoConsentMetricsProvider(),
    )
