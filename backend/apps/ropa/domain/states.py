"""
State pattern for a processing activity's lifecycle. Same shape as
apps.cases.domain.states: each status is a class that knows only its
own legal next transitions, looked up via ProcessingActivityStateRegistry
(Factory Method). Draft -> Active is "this entry is finished being
drafted and now reflects real processing"; Active -> Draft is "revise
before the next review"; Active -> Archived is "this processing has
stopped, but the record is kept for audit history" (never deleted).
"""

from __future__ import annotations

from abc import ABC, abstractmethod


class ProcessingActivityState(ABC):
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


class Draft(ProcessingActivityState):
    code = "draft"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset({"active"})


class Active(ProcessingActivityState):
    code = "active"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset({"draft", "archived"})


class Archived(ProcessingActivityState):
    code = "archived"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset()


class ProcessingActivityStateRegistry:
    """Looks up the ProcessingActivityState instance for a status code (Factory Method)."""

    _states: dict[str, ProcessingActivityState] = {
        s.code: s for s in (Draft(), Active(), Archived())
    }

    @classmethod
    def get(cls, code: str) -> ProcessingActivityState:
        try:
            return cls._states[code]
        except KeyError as exc:
            raise ValueError(f"Unknown processing activity status: {code!r}") from exc
