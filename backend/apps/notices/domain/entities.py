"""
Framework-agnostic PrivacyNoticeEntity — one version of a privacy
notice (privacy policy, terms of service, or cookie policy). Same
convention as every other app's domain.entities: a frozen dataclass
the repository translates to/from the Django model.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class PrivacyNoticeEntity:
    id: uuid.UUID
    organization_id: uuid.UUID
    notice_type: str
    title: str
    body: str
    version: int
    status: str
    change_summary: str
    published_at: datetime | None
    review_due_at: datetime | None = None
