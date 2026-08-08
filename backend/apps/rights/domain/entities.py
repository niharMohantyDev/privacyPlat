"""Framework-agnostic domain objects for the Rights/DSAR module (see
apps.consent.domain.entities for the same convention)."""

from __future__ import annotations

import uuid
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class DSARRequestEntity:
    """One data-subject rights request, from submission to resolution."""

    id: uuid.UUID
    organization_id: uuid.UUID
    subject_key: str
    request_type: str
    status: str
    region: str
    submitted_at: datetime | None
    due_at: datetime | None
    resolved_at: datetime | None = None
    notes: str = ""
