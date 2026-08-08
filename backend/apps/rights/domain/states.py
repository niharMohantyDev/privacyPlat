"""
State pattern for DSAR request status. Each status is a class that knows
only which statuses it may legally move to next — DSARService asks the
current state whether a transition is allowed instead of checking a
scattered if/elif chain, and a new status is added as one new class
without touching the others (Open/Closed).
"""

from __future__ import annotations

from abc import ABC, abstractmethod


class RequestState(ABC):
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


class Submitted(RequestState):
    code = "submitted"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset({"identity_verification", "rejected", "withdrawn"})


class IdentityVerification(RequestState):
    code = "identity_verification"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset({"in_progress", "rejected", "withdrawn"})


class InProgress(RequestState):
    code = "in_progress"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset({"pending_review", "withdrawn"})


class PendingReview(RequestState):
    code = "pending_review"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset({"completed", "in_progress", "rejected"})


class Completed(RequestState):
    code = "completed"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset()


class Rejected(RequestState):
    code = "rejected"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset()


class Withdrawn(RequestState):
    code = "withdrawn"

    @property
    def allowed_transitions(self) -> frozenset[str]:
        return frozenset()


class RequestStateRegistry:
    """Looks up the RequestState instance for a status code (Factory Method)."""

    _states: dict[str, RequestState] = {
        s.code: s
        for s in (
            Submitted(),
            IdentityVerification(),
            InProgress(),
            PendingReview(),
            Completed(),
            Rejected(),
            Withdrawn(),
        )
    }

    @classmethod
    def get(cls, code: str) -> RequestState:
        try:
            return cls._states[code]
        except KeyError as exc:
            raise ValueError(f"Unknown request status: {code!r}") from exc
