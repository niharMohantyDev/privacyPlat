from datetime import datetime, timezone

import pytest

from apps.notices.domain.review import (
    CookiePolicyReviewStrategy,
    NoticeReviewCycleStrategyFactory,
    PrivacyPolicyReviewStrategy,
    TermsOfServiceReviewStrategy,
)

NOW = datetime(2026, 1, 1, tzinfo=timezone.utc)


def test_factory_selects_privacy_policy_strategy():
    assert isinstance(NoticeReviewCycleStrategyFactory.get_strategy("privacy_policy"), PrivacyPolicyReviewStrategy)


def test_factory_selects_terms_of_service_strategy():
    assert isinstance(
        NoticeReviewCycleStrategyFactory.get_strategy("terms_of_service"), TermsOfServiceReviewStrategy
    )


def test_factory_selects_cookie_policy_strategy():
    assert isinstance(NoticeReviewCycleStrategyFactory.get_strategy("cookie_policy"), CookiePolicyReviewStrategy)


def test_factory_rejects_unknown_notice_type():
    with pytest.raises(ValueError):
        NoticeReviewCycleStrategyFactory.get_strategy("not-a-real-type")


def test_privacy_policy_review_is_365_days_out():
    due = PrivacyPolicyReviewStrategy().next_review_date(NOW)
    assert (due - NOW).days == 365


def test_cookie_policy_review_is_180_days_out():
    due = CookiePolicyReviewStrategy().next_review_date(NOW)
    assert (due - NOW).days == 180
