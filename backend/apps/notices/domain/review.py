"""
Notice-type review-cadence strategies (Strategy + Factory Method —
same shape as apps.ropa.domain.review, now keyed by notice_type).
Cadence values are placeholders pending legal sign-off, same caveat as
apps.ropa.domain.review.
"""

from __future__ import annotations

from datetime import datetime, timedelta

from .interfaces import NoticeReviewCycleStrategy


class PrivacyPolicyReviewStrategy(NoticeReviewCycleStrategy):
    notice_type = "privacy_policy"

    def next_review_date(self, from_date: datetime) -> datetime:
        return from_date + timedelta(days=365)  # annually


class TermsOfServiceReviewStrategy(NoticeReviewCycleStrategy):
    notice_type = "terms_of_service"

    def next_review_date(self, from_date: datetime) -> datetime:
        return from_date + timedelta(days=365)  # annually


class CookiePolicyReviewStrategy(NoticeReviewCycleStrategy):
    notice_type = "cookie_policy"

    def next_review_date(self, from_date: datetime) -> datetime:
        return from_date + timedelta(days=180)  # trackers change more often — every 6 months


class NoticeReviewCycleStrategyFactory:
    _strategies: dict[str, NoticeReviewCycleStrategy] = {
        s.notice_type: s
        for s in (PrivacyPolicyReviewStrategy(), TermsOfServiceReviewStrategy(), CookiePolicyReviewStrategy())
    }

    @classmethod
    def get_strategy(cls, notice_type: str) -> NoticeReviewCycleStrategy:
        try:
            return cls._strategies[notice_type]
        except KeyError as exc:
            raise ValueError(f"Unknown notice_type: {notice_type!r}") from exc
