"""
State pattern for case status — the shared lifecycle both breach and
grievance cases go through. Same shape as apps.rights.domain.states:
each status is a class that knows only its own legal next transitions,
looked up via CaseStateRegistry (Factory Method). A new status is one
new class; nothing else changes (Open/Closed).
"""

from __future__ import annotations

from abc import ABC, abstractmethod


class CaseState(ABC):
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


class Reported(CaseState):
    code = "reported"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset({"investigating", "dismissed"})


class Investigating(CaseState):
    code = "investigating"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset({"resolved", "dismissed"})


class Resolved(CaseState):
    code = "resolved"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset({"closed", "investigating"})  # reopen is a legal move


class Closed(CaseState):
    code = "closed"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset()


class Dismissed(CaseState):
    code = "dismissed"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset()


class CaseStateRegistry:
    """Looks up the CaseState instance for a status code (Factory Method)."""

    _states: dict[str, CaseState] = {
        s.code: s for s in (Reported(), Investigating(), Resolved(), Closed(), Dismissed())
    }

    @classmethod
    def get(cls, code: str) -> CaseState:
        try:
            return cls._states[code]
        except KeyError as exc:
            raise ValueError(f"Unknown case status: {code!r}") from exc
