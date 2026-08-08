"""In-memory CaseRepository/CaseNotifier test doubles — same rationale as
apps.rights.tests.fakes.FakeDSARRequestRepository."""

from apps.cases.domain.entities import CaseEntity
from apps.cases.domain.interfaces import CaseNotifier, CaseRepository


class FakeCaseRepository(CaseRepository):
    def __init__(self):
        self._by_id: dict = {}

    def save(self, case: CaseEntity) -> CaseEntity:
        self._by_id[case.id] = case
        return case

    def get(self, organization_id, case_id):
        case = self._by_id.get(case_id)
        if case is None or case.organization_id != organization_id:
            return None
        return case

    def list_for_organization(self, organization_id, case_type=None):
        results = [c for c in self._by_id.values() if c.organization_id == organization_id]
        if case_type:
            results = [c for c in results if c.case_type == case_type]
        return results


class FakeCaseNotifier(CaseNotifier):
    def __init__(self):
        self.reported: list = []
        self.resolved: list = []

    def notify_reported(self, case: CaseEntity) -> None:
        self.reported.append(case)

    def notify_resolved(self, case: CaseEntity) -> None:
        self.resolved.append(case)
