import pytest

from apps.cases.domain.obligation_states import ObligationStateRegistry


def test_pending_can_move_to_notified_or_not_required():
    state = ObligationStateRegistry.get("pending")
    assert state.can_transition_to("notified")
    assert state.can_transition_to("not_required")


def test_notified_is_terminal():
    state = ObligationStateRegistry.get("notified")
    assert state.is_terminal
    assert not state.can_transition_to("pending")


def test_not_required_is_terminal():
    state = ObligationStateRegistry.get("not_required")
    assert state.is_terminal


def test_unknown_status_raises():
    with pytest.raises(ValueError):
        ObligationStateRegistry.get("not-a-real-status")
