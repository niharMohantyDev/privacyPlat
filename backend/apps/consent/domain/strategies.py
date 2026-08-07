"""
Region-specific consent rule strategies (Strategy pattern) plus a factory
that selects the right one for a given region code (Factory Method).

To support a new jurisdiction: add a class implementing RegionRuleStrategy
and register it in RegionStrategyFactory._strategies. Nothing else in the
codebase changes — existing strategies, the service layer, and the API
are untouched (Open/Closed Principle).
"""

from __future__ import annotations

from .entities import PurposeEntity
from .interfaces import RegionRuleStrategy

_EU_REGIONS = {
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
    "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
    "SI", "ES", "SE", "EU",
}


class GDPRRegionStrategy(RegionRuleStrategy):
    """EU/EEA — opt-in required for every non-essential purpose."""

    framework_code = "GDPR"

    def applies_to(self, region: str) -> bool:
        return region.upper() in _EU_REGIONS

    def requires_opt_in(self, purpose: PurposeEntity) -> bool:
        return not purpose.is_essential


class DPDPRegionStrategy(RegionRuleStrategy):
    """India — Digital Personal Data Protection Act, opt-in model."""

    framework_code = "DPDP"

    def applies_to(self, region: str) -> bool:
        return region.upper() == "IN"

    def requires_opt_in(self, purpose: PurposeEntity) -> bool:
        return not purpose.is_essential


class CCPARegionStrategy(RegionRuleStrategy):
    """California — opt-out model: non-essential purposes default to granted."""

    framework_code = "CCPA"

    def applies_to(self, region: str) -> bool:
        return region.upper() in {"US-CA", "US"}

    def requires_opt_in(self, purpose: PurposeEntity) -> bool:
        return False


class DefaultRegionStrategy(RegionRuleStrategy):
    """Fallback for unrecognized regions — conservative opt-in-required."""

    framework_code = "DEFAULT"

    def applies_to(self, region: str) -> bool:
        return True

    def requires_opt_in(self, purpose: PurposeEntity) -> bool:
        return not purpose.is_essential


class RegionStrategyFactory:
    """Selects the applicable RegionRuleStrategy for a region code."""

    _strategies: tuple[RegionRuleStrategy, ...] = (
        GDPRRegionStrategy(),
        DPDPRegionStrategy(),
        CCPARegionStrategy(),
    )
    _default = DefaultRegionStrategy()

    @classmethod
    def get_strategy(cls, region: str) -> RegionRuleStrategy:
        for strategy in cls._strategies:
            if strategy.applies_to(region):
                return strategy
        return cls._default
