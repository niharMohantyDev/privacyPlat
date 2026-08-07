"""
Framework-agnostic domain objects for the Consent module.

Deliberately plain Python (dataclasses, no Django imports) so business
rules can be unit-tested and reasoned about without a database or an
HTTP request in the loop. Django models live in apps/consent/models.py
and are translated to/from these entities at the repository boundary.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import datetime


@dataclass(frozen=True)
class PurposeEntity:
    """A single processing purpose a subject can grant/deny (e.g. 'analytics')."""

    id: uuid.UUID
    code: str
    name: str
    is_essential: bool


@dataclass(frozen=True)
class ConsentDecisionEntity:
    """One purpose/granted pair within a consent record."""

    purpose_code: str
    granted: bool


@dataclass(frozen=True)
class ConsentRecordEntity:
    """
    A single consent event: what a subject decided, under which regional
    framework, at what version. Consent records are immutable — a change
    of mind creates a new record (version + 1), it never edits history.
    """

    id: uuid.UUID
    organization_id: uuid.UUID
    asset_id: uuid.UUID | None
    subject_key: str
    region: str
    framework: str
    version: int
    decisions: tuple[ConsentDecisionEntity, ...] = field(default_factory=tuple)
    created_at: datetime | None = None

    def decision_for(self, purpose_code: str) -> ConsentDecisionEntity | None:
        return next((d for d in self.decisions if d.purpose_code == purpose_code), None)


@dataclass(frozen=True)
class ConsentReceipt:
    """
    Tamper-evident, exportable proof of what a subject consented to.
    Immutable value object — the `signature` is a hash over the record's
    canonical content, so any later mutation is detectable.
    """

    record_id: uuid.UUID
    subject_key: str
    region: str
    framework: str
    version: int
    decisions: tuple[ConsentDecisionEntity, ...]
    issued_at: datetime
    signature: str
