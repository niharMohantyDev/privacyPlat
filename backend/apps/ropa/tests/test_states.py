import pytest

from apps.ropa.domain.states import ProcessingActivityStateRegistry


def test_draft_can_move_to_active():
    state = ProcessingActivityStateRegistry.get("draft")
    assert state.can_transition_to("active")


def test_draft_cannot_jump_to_archived():
    state = ProcessingActivityStateRegistry.get("draft")
    assert not state.can_transition_to("archived")


def test_active_can_revert_to_draft_or_move_to_archived():
    state = ProcessingActivityStateRegistry.get("active")
    assert state.can_transition_to("draft")
    assert state.can_transition_to("archived")


def test_archived_is_terminal():
    state = ProcessingActivityStateRegistry.get("archived")
    assert state.is_terminal
    assert not state.can_transition_to("active")


def test_unknown_status_raises():
    with pytest.raises(ValueError):
        ProcessingActivityStateRegistry.get("not-a-real-status")
