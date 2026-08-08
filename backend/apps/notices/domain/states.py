"""
State pattern for a notice version's lifecycle. Same shape as
apps.ropa.domain.states: each status is a class that knows only its
own legal next transitions, looked up via NoticeStateRegistry (Factory
Method). Draft -> Published is "this version is now the live one";
Published -> Archived is "superseded by a newer version, or manually
retracted" — both terminal, since a notice version is a point-in-time
record, not something you un-publish back to draft.
"""

from __future__ import annotations

from abc import ABC, abstractmethod


class NoticeState(ABC):
    code: str

    @property
    @abstractmethod
    def allowed_transitions(self) -> frozenset[str]:
        ...

    def can_transition_to(self, target_code: str) -> bool:
        return target_code in self.allowed_transitions

    @property
    def is_terminal(self) -> bool:
        return not self.allowed_transitions


class Draft(NoticeState):
    code = "draft"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset({"published", "archived"})


class Published(NoticeState):
    code = "published"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset({"archived"})


class Archived(NoticeState):
    code = "archived"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset()


class NoticeStateRegistry:
    """Looks up the NoticeState instance for a status code (Factory Method)."""

    _states: dict[str, NoticeState] = {s.code: s for s in (Draft(), Published(), Archived())}

    @classmethod
    def get(cls, code: str) -> NoticeState:
        try:
            return cls._states[code]
        except KeyError as exc:
            raise ValueError(f"Unknown notice status: {code!r}") from exc
