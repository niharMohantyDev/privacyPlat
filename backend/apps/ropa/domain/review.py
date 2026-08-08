"""
Risk-level review-cadence strategies (Strategy + Factory Method — same
shape as apps.cases.domain.sla, now keyed by risk_level instead of
case_type). Cadence values are placeholders pending legal sign-off on
the organization's actual review policy, same caveat as apps.cases.domain.sla.
"""

from __future__ import annotations

from datetime import datetime, timedelta

from .interfaces import ReviewCycleStrategy


class HighRiskReviewStrategy(ReviewCycleStrategy):
    risk_level = "high"

    def next_review_date(self, from_date: datetime) -> datetime:
        return from_date + timedelta(days=180)  # every 6 months


class MediumRiskReviewStrategy(ReviewCycleStrategy):
    risk_level = "medium"

    def next_review_date(self, from_date: datetime) -> datetime:
        return from_date + timedelta(days=270)  # every 9 months


class LowRiskReviewStrategy(ReviewCycleStrategy):
    risk_level = "low"

    def next_review_date(self, from_date: datetime) -> datetime:
        return from_date + timedelta(days=365)  # annually


class ReviewCycleStrategyFactory:
    _strategies: dict[str, ReviewCycleStrategy] = {
        s.risk_level: s
        for s in (HighRiskReviewStrategy(), MediumRiskReviewStrategy(), LowRiskReviewStrategy())
    }

    @classmethod
    def get_strategy(cls, risk_level: str) -> ReviewCycleStrategy:
        try:
            return cls._strategies[risk_level]
        except KeyError as exc:
            raise ValueError(f"Unknown risk_level: {risk_level!r}") from exc
