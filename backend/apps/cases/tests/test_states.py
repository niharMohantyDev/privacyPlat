import pytest

from apps.cases.domain.states import CaseStateRegistry


def test_reported_can_move_to_investigating():
    state = CaseStateRegistry.get("reported")
    assert state.can_transition_to("investigating")


def test_reported_cannot_jump_to_resolved():
    state = CaseStateRegistry.get("reported")
    assert not state.can_transition_to("resolved")


def test_closed_is_terminal():
    state = CaseStateRegistry.get("closed")
    assert state.is_terminal
    assert not state.can_transition_to("investigating")


def test_dismissed_is_terminal():
    state = CaseStateRegistry.get("dismissed")
    assert state.is_terminal


def test_resolved_can_be_reopened_to_investigating():
    state = CaseStateRegistry.get("resolved")
    assert state.can_transition_to("investigating")


def test_unknown_status_raises():
    with pytest.raises(ValueError):
        CaseStateRegistry.get("not-a-real-status")
