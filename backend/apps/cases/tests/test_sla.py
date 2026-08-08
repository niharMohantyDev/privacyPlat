from datetime import datetime, timezone

import pytest

from apps.cases.domain.sla import BreachSLAStrategy, CaseSLAStrategyFactory, GrievanceSLAStrategy

NOW = datetime(2026, 1, 1, tzinfo=timezone.utc)


def test_factory_selects_breach_strategy():
    assert isinstance(CaseSLAStrategyFactory.get_strategy("breach"), BreachSLAStrategy)


def test_factory_selects_grievance_strategy():
    assert isinstance(CaseSLAStrategyFactory.get_strategy("grievance"), GrievanceSLAStrategy)


def test_factory_rejects_unknown_case_type():
    with pytest.raises(ValueError):
        CaseSLAStrategyFactory.get_strategy("not-a-real-type")


def test_breach_due_date_is_3_days_out():
    due = BreachSLAStrategy().due_date(NOW)
    assert (due - NOW).days == 3


def test_grievance_due_date_is_30_days_out():
    due = GrievanceSLAStrategy().due_date(NOW)
    assert (due - NOW).days == 30
