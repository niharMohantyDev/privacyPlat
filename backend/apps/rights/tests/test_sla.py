from datetime import datetime, timezone

from apps.rights.domain.sla import (
    CCPASLAStrategy,
    DefaultSLAStrategy,
    DPDPSLAStrategy,
    GDPRSLAStrategy,
    SLAStrategyFactory,
)

NOW = datetime(2026, 1, 1, tzinfo=timezone.utc)


def test_factory_selects_gdpr_for_eu_region():
    assert isinstance(SLAStrategyFactory.get_strategy("FR"), GDPRSLAStrategy)


def test_factory_selects_dpdp_for_india():
    assert isinstance(SLAStrategyFactory.get_strategy("IN"), DPDPSLAStrategy)


def test_factory_selects_ccpa_for_california():
    assert isinstance(SLAStrategyFactory.get_strategy("US-CA"), CCPASLAStrategy)


def test_factory_falls_back_to_default():
    assert isinstance(SLAStrategyFactory.get_strategy("XX"), DefaultSLAStrategy)


def test_gdpr_due_date_is_30_days_out():
    due = GDPRSLAStrategy().due_date(NOW)
    assert (due - NOW).days == 30


def test_ccpa_due_date_is_45_days_out():
    due = CCPASLAStrategy().due_date(NOW)
    assert (due - NOW).days == 45
