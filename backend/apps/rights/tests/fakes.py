"""In-memory DSARRequestRepository test double — same rationale as
apps.consent.tests.fakes.FakeConsentRepository."""

from apps.rights.domain.entities import DSARRequestEntity
from apps.rights.domain.interfaces import DSARRequestRepository


class FakeDSARRequestRepository(DSARRequestRepository):
    def __init__(self):
        self._by_id: dict = {}

    def save(self, request: DSARRequestEntity) -> DSARRequestEntity:
        self._by_id[request.id] = request
        return request

    def get(self, organization_id, request_id):
        request = self._by_id.get(request_id)
        if request is None or request.organization_id != organization_id:
            return None
        return request

    def list_for_organization(self, organization_id):
        return [r for r in self._by_id.values() if r.organization_id == organization_id]
