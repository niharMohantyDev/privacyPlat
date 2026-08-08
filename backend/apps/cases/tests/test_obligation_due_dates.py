from datetime import datetime, timezone

import pytest

from apps.cases.domain.obligation_due_dates import (
    DataSubjectDueDateStrategy,
    ObligationDueDateStrategyFactory,
    RegulatorDueDateStrategy,
    VendorDueDateStrategy,
)

NOW = datetime(2026, 1, 1, tzinfo=timezone.utc)


def test_factory_selects_regulator_strategy():
    assert isinstance(ObligationDueDateStrategyFactory.get_strategy("regulator"), RegulatorDueDateStrategy)


def test_factory_selects_data_subject_strategy():
    assert isinstance(
        ObligationDueDateStrategyFactory.get_strategy("data_subject"), DataSubjectDueDateStrategy
    )


def test_factory_selects_vendor_strategy():
    assert isinstance(ObligationDueDateStrategyFactory.get_strategy("vendor"), VendorDueDateStrategy)


def test_factory_rejects_unknown_recipient_type():
    with pytest.raises(ValueError):
        ObligationDueDateStrategyFactory.get_strategy("not-a-real-recipient")


def test_regulator_due_date_is_72_hours_out():
    due = RegulatorDueDateStrategy().due_date(NOW)
    assert (due - NOW).total_seconds() == 72 * 3600


def test_vendor_due_date_is_5_days_out():
    due = VendorDueDateStrategy().due_date(NOW)
    assert (due - NOW).days == 5
