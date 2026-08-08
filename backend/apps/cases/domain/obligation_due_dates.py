"""
Recipient-type notification-deadline strategies (Strategy + Factory
Method — same shape as apps.cases.domain.sla, now keyed by
recipient_type instead of case_type). Deadline values are placeholders
pending legal confirmation of the actual regulatory/contractual
windows (GDPR Art. 33's 72-hour *regulator* clock is the one hard
number here; Art. 34's data-subject clock is "without undue delay"
with no fixed figure, and the vendor window is whatever the DPA says)
before this goes near production — same caveat as apps.cases.domain.sla.
"""

from __future__ import annotations

from datetime import datetime, timedelta

from .obligation_interfaces import ObligationDueDateStrategy


class RegulatorDueDateStrategy(ObligationDueDateStrategy):
    recipient_type = "regulator"

    def due_date(self, detected_at: datetime) -> datetime:
        return detected_at + timedelta(hours=72)  # GDPR Art. 33


class DataSubjectDueDateStrategy(ObligationDueDateStrategy):
    recipient_type = "data_subject"

    def due_date(self, detected_at: datetime) -> datetime:
        return detected_at + timedelta(days=30)  # "without undue delay" placeholder


class VendorDueDateStrategy(ObligationDueDateStrategy):
    recipient_type = "vendor"

    def due_date(self, detected_at: datetime) -> datetime:
        return detected_at + timedelta(days=5)  # typical DPA notification clause placeholder


class ObligationDueDateStrategyFactory:
    _strategies: dict[str, ObligationDueDateStrategy] = {
        s.recipient_type: s
        for s in (RegulatorDueDateStrategy(), DataSubjectDueDateStrategy(), VendorDueDateStrategy())
    }

    @classmethod
    def get_strategy(cls, recipient_type: str) -> ObligationDueDateStrategy:
        try:
            return cls._strategies[recipient_type]
        except KeyError as exc:
            raise ValueError(f"Unknown recipient_type: {recipient_type!r}") from exc
