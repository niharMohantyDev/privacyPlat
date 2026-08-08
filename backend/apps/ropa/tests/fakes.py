"""In-memory ProcessingActivityRepository test double — same rationale
as apps.cases.tests.fakes.FakeCaseRepository."""

from apps.ropa.domain.entities import ProcessingActivityEntity
from apps.ropa.domain.interfaces import ProcessingActivityRepository


class FakeProcessingActivityRepository(ProcessingActivityRepository):
    def __init__(self):
        self._by_id: dict = {}

    def save(self, activity: ProcessingActivityEntity) -> ProcessingActivityEntity:
        self._by_id[activity.id] = activity
        return activity

    def get(self, organization_id, activity_id):
        activity = self._by_id.get(activity_id)
        if activity is None or activity.organization_id != organization_id:
            return None
        return activity

    def list_for_organization(self, organization_id, status=None):
        results = [a for a in self._by_id.values() if a.organization_id == organization_id]
        if status:
            results = [a for a in results if a.status == status]
        return results
