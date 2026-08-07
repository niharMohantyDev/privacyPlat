import pytest

from apps.rights.domain.states import RequestStateRegistry


def test_submitted_can_move_to_identity_verification():
    state = RequestStateRegistry.get("submitted")
    assert state.can_transition_to("identity_verification")


def test_submitted_cannot_jump_to_completed():
    state = RequestStateRegistry.get("submitted")
    assert not state.can_transition_to("completed")


def test_completed_is_terminal():
    state = RequestStateRegistry.get("completed")
    assert state.is_terminal
    assert not state.can_transition_to("in_progress")


def test_pending_review_can_bounce_back_to_in_progress():
    state = RequestStateRegistry.get("pending_review")
    assert state.can_transition_to("in_progress")


def test_unknown_status_raises():
    with pytest.raises(ValueError):
        RequestStateRegistry.get("not-a-real-status")
