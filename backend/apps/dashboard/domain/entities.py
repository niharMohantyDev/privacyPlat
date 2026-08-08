"""
Read-model entities for the compliance dashboard — deliberately not
persisted anywhere; each is computed fresh per request from the
Consent/Rights/Cases apps' own tables (see apps.dashboard.providers).
Framework-agnostic dataclasses, same convention as every other app's
domain.entities.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class DSARMetrics:
    total: int
    open: int
    overdue: int
    resolved_on_time: int
    resolved_late: int

    @property
    def on_time_rate(self) -> float | None:
        resolved = self.resolved_on_time + self.resolved_late
        if resolved == 0:
            return None
        return round(self.resolved_on_time / resolved * 100, 1)


@dataclass(frozen=True)
class CaseMetrics:
    total: int
    open: int
    overdue: int
    breach_open: int
    grievance_open: int


@dataclass(frozen=True)
class ConsentMetrics:
    total_purposes: int
    total_consent_records: int
    opt_in_rate: float | None


@dataclass(frozen=True)
class ComplianceDashboardSummary:
    dsar: DSARMetrics
    cases: CaseMetrics
    consent: ConsentMetrics
    generated_at: datetime
