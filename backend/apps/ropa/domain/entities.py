"""
Framework-agnostic ProcessingActivityEntity — a single Article 30
Record of Processing Activities entry. Same convention as every other
app's domain.entities: a frozen dataclass the repository translates
to/from the Django model, so the service layer never touches the ORM.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class ProcessingActivityEntity:
    id: uuid.UUID
    organization_id: uuid.UUID
    title: str
    description: str
    legal_basis: str
    risk_level: str
    status: str
    data_categories: str
    data_subject_categories: str
    recipients: str
    retention_period: str
    security_measures: str
    owner: str
    third_country_transfer: bool
    transfer_safeguards: str
    purpose_id: uuid.UUID | None
    workspace_id: uuid.UUID | None
    review_due_at: datetime | None
    reviewed_at: datetime | None = None
