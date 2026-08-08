"""Framework-agnostic domain objects for the Cases module (Breach +
Grievance). Same convention as apps.consent/apps.rights domain layers."""

from __future__ import annotations

import uuid
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class CaseEntity:
    """
    One breach or grievance case, from report to resolution. Breach and
    grievance share this single shape rather than two near-identical
    engines — see apps.cases.domain.states for the shared lifecycle and
    apps.cases.domain.sla for how the one axis that genuinely differs
    (response urgency) is handled via Strategy, not a second model.
    """

    id: uuid.UUID
    organization_id: uuid.UUID
    case_type: str
    status: str
    title: str
    description: str
    reported_by: str
    region: str
    severity: str
    reported_at: datetime | None
    due_at: datetime | None
    resolved_at: datetime | None = None
    notes: str = ""
