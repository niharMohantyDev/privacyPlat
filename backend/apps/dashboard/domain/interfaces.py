"""
Ports the dashboard depends on (Dependency Inversion) — one per pillar
it summarizes. ComplianceDashboardService only knows these ABCs, never
the concrete Django queries in apps.dashboard.providers, so it can be
unit-tested against fakes exactly like every other app's *Service.
"""

from __future__ import annotations

import uuid
from abc import ABC, abstractmethod

from .entities import CaseMetrics, ConsentMetrics, DSARMetrics


class DSARMetricsProvider(ABC):
    @abstractmethod
    def get_metrics(self, organization_id: uuid.UUID) -> DSARMetrics: ...


class CaseMetricsProvider(ABC):
    @abstractmethod
    def get_metrics(self, organization_id: uuid.UUID) -> CaseMetrics: ...


class ConsentMetricsProvider(ABC):
    @abstractmethod
    def get_metrics(self, organization_id: uuid.UUID) -> ConsentMetrics: ...
