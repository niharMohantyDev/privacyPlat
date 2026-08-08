"""
ComplianceDashboardService — composes the three per-pillar providers
into one summary. Single Responsibility, constructor-injected
dependencies (Dependency Inversion), depends only on interfaces, same
shape as every other app's *Service.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from .domain.entities import ComplianceDashboardSummary
from .domain.interfaces import CaseMetricsProvider, ConsentMetricsProvider, DSARMetricsProvider


class ComplianceDashboardService:
    def __init__(
        self,
        dsar_provider: DSARMetricsProvider,
        case_provider: CaseMetricsProvider,
        consent_provider: ConsentMetricsProvider,
    ):
        self._dsar_provider = dsar_provider
        self._case_provider = case_provider
        self._consent_provider = consent_provider

    def get_summary(self, organization_id: uuid.UUID) -> ComplianceDashboardSummary:
        return ComplianceDashboardSummary(
            dsar=self._dsar_provider.get_metrics(organization_id),
            cases=self._case_provider.get_metrics(organization_id),
            consent=self._consent_provider.get_metrics(organization_id),
            generated_at=datetime.now(timezone.utc),
        )
