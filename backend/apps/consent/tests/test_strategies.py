from apps.consent.domain.entities import PurposeEntity
from apps.consent.domain.strategies import (
    CCPARegionStrategy,
    DefaultRegionStrategy,
    DPDPRegionStrategy,
    GDPRRegionStrategy,
    RegionStrategyFactory,
)

ESSENTIAL = PurposeEntity(id=None, code="security", name="Security", is_essential=True)
ANALYTICS = PurposeEntity(id=None, code="analytics", name="Analytics", is_essential=False)


def test_factory_selects_gdpr_for_eu_region():
    assert isinstance(RegionStrategyFactory.get_strategy("DE"), GDPRRegionStrategy)
    assert isinstance(RegionStrategyFactory.get_strategy("fr"), GDPRRegionStrategy)


def test_factory_selects_dpdp_for_india():
    assert isinstance(RegionStrategyFactory.get_strategy("IN"), DPDPRegionStrategy)


def test_factory_selects_ccpa_for_california():
    assert isinstance(RegionStrategyFactory.get_strategy("US-CA"), CCPARegionStrategy)


def test_factory_falls_back_to_default_for_unknown_region():
    assert isinstance(RegionStrategyFactory.get_strategy("XX"), DefaultRegionStrategy)


def test_gdpr_requires_opt_in_for_non_essential_only():
    strategy = GDPRRegionStrategy()
    assert strategy.requires_opt_in(ANALYTICS) is True
    assert strategy.requires_opt_in(ESSENTIAL) is False


def test_ccpa_is_opt_out_for_non_essential():
    strategy = CCPARegionStrategy()
    assert strategy.requires_opt_in(ANALYTICS) is False
