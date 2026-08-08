"""
Framework-agnostic BreachNotificationObligationEntity — one recipient
this org must (or decided it needn't) notify about a specific breach
case. Named "obligation" rather than "notification" deliberately: this
module already has a CaseNotifier (apps.cases.notifications) that
sends *internal* emails about case events — an obligation is a
different concept, a statutory/contractual duty to tell someone
*outside* the org (a regulator, the affected data subjects, a vendor)
that the breach happened.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class BreachNotificationObligationEntity:
    id: uuid.UUID
    case_id: uuid.UUID
    organization_id: uuid.UUID
    recipient_type: str
    recipient_identifier: str
    status: str
    due_at: datetime | None
    notified_at: datetime | None = None
    notes: str = ""
