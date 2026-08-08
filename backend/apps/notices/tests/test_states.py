import pytest

from apps.notices.domain.states import NoticeStateRegistry


def test_draft_can_move_to_published_or_archived():
    state = NoticeStateRegistry.get("draft")
    assert state.can_transition_to("published")
    assert state.can_transition_to("archived")


def test_published_can_move_to_archived_only():
    state = NoticeStateRegistry.get("published")
    assert state.can_transition_to("archived")
    assert not state.can_transition_to("draft")


def test_archived_is_terminal():
    state = NoticeStateRegistry.get("archived")
    assert state.is_terminal


def test_unknown_status_raises():
    with pytest.raises(ValueError):
        NoticeStateRegistry.get("not-a-real-status")
