"""
Case-type response-urgency strategies (Strategy + Factory Method — same
shape as apps.consent.domain.strategies and apps.rights.domain.sla, now
keyed by case_type instead of region).

Deadline values are placeholders pending legal confirmation of the
actual regulatory windows (GDPR Art. 33's 72-hour breach-notification
clock, DPDP grievance-redressal timelines) before this goes near
production — the point of this milestone is the pluggable-strategy
shape, same caveat as apps.rights.domain.sla.
"""

from __future__ import annotations

from datetime import datetime, timedelta

from .interfaces import CaseSLAStrategy


class BreachSLAStrategy(CaseSLAStrategy):
    case_type = "breach"

    def due_date(self, reported_at: datetime) -> datetime:
        return reported_at + timedelta(days=3)  # GDPR Art. 33: 72 hours


class GrievanceSLAStrategy(CaseSLAStrategy):
    case_type = "grievance"

    def due_date(self, reported_at: datetime) -> datetime:
        return reported_at + timedelta(days=30)  # DPDP-style grievance redressal window


class CaseSLAStrategyFactory:
    _strategies: dict[str, CaseSLAStrategy] = {
        s.case_type: s for s in (BreachSLAStrategy(), GrievanceSLAStrategy())
    }

    @classmethod
    def get_strategy(cls, case_type: str) -> CaseSLAStrategy:
        try:
            return cls._strategies[case_type]
        except KeyError as exc:
            raise ValueError(f"Unknown case_type: {case_type!r}") from exc
