from datetime import datetime, timezone

import pytest

from apps.ropa.domain.review import (
    HighRiskReviewStrategy,
    LowRiskReviewStrategy,
    MediumRiskReviewStrategy,
    ReviewCycleStrategyFactory,
)

NOW = datetime(2026, 1, 1, tzinfo=timezone.utc)


def test_factory_selects_high_risk_strategy():
    assert isinstance(ReviewCycleStrategyFactory.get_strategy("high"), HighRiskReviewStrategy)


def test_factory_selects_medium_risk_strategy():
    assert isinstance(ReviewCycleStrategyFactory.get_strategy("medium"), MediumRiskReviewStrategy)


def test_factory_selects_low_risk_strategy():
    assert isinstance(ReviewCycleStrategyFactory.get_strategy("low"), LowRiskReviewStrategy)


def test_factory_rejects_unknown_risk_level():
    with pytest.raises(ValueError):
        ReviewCycleStrategyFactory.get_strategy("not-a-real-level")


def test_high_risk_review_is_180_days_out():
    due = HighRiskReviewStrategy().next_review_date(NOW)
    assert (due - NOW).days == 180


def test_low_risk_review_is_365_days_out():
    due = LowRiskReviewStrategy().next_review_date(NOW)
    assert (due - NOW).days == 365
