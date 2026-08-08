"""
In-memory ConsentRepository test double. Exists precisely because the
service layer depends on the ConsentRepository *interface*, not the
Django implementation — so tests can swap in this fake and exercise
ConsentService without a database at all.
"""

from apps.consent.domain.entities import ConsentRecordEntity, PurposeEntity
from apps.consent.domain.interfaces import ConsentRepository


class FakeConsentRepository(ConsentRepository):
    def __init__(self, purposes: list[PurposeEntity] | None = None):
        self._purposes = list(purposes or [])
        self._records: list[ConsentRecordEntity] = []

    def get_purposes(self, organization_id):
        return list(self._purposes)

    def save(self, record):
        self._records.append(record)
        return record

    def get_latest(self, organization_id, subject_key):
        matches = [
            r
            for r in self._records
            if r.organization_id == organization_id and r.subject_key == subject_key
        ]
        return max(matches, key=lambda r: r.version) if matches else None

    def list_records(self, organization_id):
        return [r for r in self._records if r.organization_id == organization_id]
