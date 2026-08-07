"""
Jurisdiction-specific statutory response deadlines (Strategy + Factory
Method — same shape as apps.consent.domain.strategies, intentionally not
shared code since Rights and Consent are separate bounded contexts).

Deadlines here are placeholders for the actual statutory windows (to be
confirmed against current DPDP Rules / GDPR Art. 12(3) / CCPA §1798.130
text before this goes near production) — the point of this milestone is
the pluggable-strategy shape, not legal certainty of the numbers.
"""

from __future__ import annotations

from datetime import datetime, timedelta

from .interfaces import SLAStrategy

_EU_REGIONS = {
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
    "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
    "SI", "ES", "SE", "EU",
}


class GDPRSLAStrategy(SLAStrategy):
    framework_code = "GDPR"

    def applies_to(self, region: str) -> bool:
        return region.upper() in _EU_REGIONS

    def due_date(self, submitted_at: datetime) -> datetime:
        return submitted_at + timedelta(days=30)  # GDPR Art. 12(3): one month


class DPDPSLAStrategy(SLAStrategy):
    framework_code = "DPDP"

    def applies_to(self, region: str) -> bool:
        return region.upper() == "IN"

    def due_date(self, submitted_at: datetime) -> datetime:
        return submitted_at + timedelta(days=30)  # placeholder pending DPDP Rules confirmation


class CCPASLAStrategy(SLAStrategy):
    framework_code = "CCPA"

    def applies_to(self, region: str) -> bool:
        return region.upper() in {"US-CA", "US"}

    def due_date(self, submitted_at: datetime) -> datetime:
        return submitted_at + timedelta(days=45)  # CCPA §1798.130: 45 days


class DefaultSLAStrategy(SLAStrategy):
    framework_code = "DEFAULT"

    def applies_to(self, region: str) -> bool:
        return True

    def due_date(self, submitted_at: datetime) -> datetime:
        return submitted_at + timedelta(days=30)


class SLAStrategyFactory:
    _strategies: tuple[SLAStrategy, ...] = (
        GDPRSLAStrategy(),
        DPDPSLAStrategy(),
        CCPASLAStrategy(),
    )
    _default = DefaultSLAStrategy()

    @classmethod
    def get_strategy(cls, region: str) -> SLAStrategy:
        for strategy in cls._strategies:
            if strategy.applies_to(region):
                return strategy
        return cls._default
