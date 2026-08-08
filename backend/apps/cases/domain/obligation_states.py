"""
State pattern for a notification obligation's status. Same shape as
apps.cases.domain.states: each status is a class that knows only its
own legal next transitions, looked up via
ObligationStateRegistry (Factory Method). Both Notified and NotRequired
are terminal — once you've told someone (or formally decided you don't
have to), that's the record; it doesn't get walked back.
"""

from __future__ import annotations

from abc import ABC, abstractmethod


class ObligationState(ABC):
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


class Pending(ObligationState):
    code = "pending"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset({"notified", "not_required"})


class Notified(ObligationState):
    code = "notified"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset()


class NotRequired(ObligationState):
    code = "not_required"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset()


class ObligationStateRegistry:
    """Looks up the ObligationState instance for a status code (Factory Method)."""

    _states: dict[str, ObligationState] = {s.code: s for s in (Pending(), Notified(), NotRequired())}

    @classmethod
    def get(cls, code: str) -> ObligationState:
        try:
            return cls._states[code]
        except KeyError as exc:
            raise ValueError(f"Unknown obligation status: {code!r}") from exc
