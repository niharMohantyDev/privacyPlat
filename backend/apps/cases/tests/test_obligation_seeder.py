import uuid
from datetime import datetime, timezone

from apps.cases.domain.entities import CaseEntity
from apps.cases.obligation_seeder import DjangoBreachObligationSeeder

ORG_ID = uuid.uuid4()
NOW = datetime(2026, 1, 1, tzinfo=timezone.utc)


class RecordingObligationService:
    def __init__(self):
        self.calls: list = []

    def create_obligation(self, *, organization_id, case_id, recipient_type, **kwargs):
        self.calls.append((organization_id, case_id, recipient_type))


def make_case(case_type: str) -> CaseEntity:
    return CaseEntity(
        id=uuid.uuid4(),
        organization_id=ORG_ID,
        case_type=case_type,
        status="reported",
        title="Test case",
        description="",
        reported_by="",
        region="",
        severity="",
        reported_at=NOW,
        due_at=None,
    )


def test_seeds_regulator_and_data_subject_obligations_for_a_breach():
    obligation_service = RecordingObligationService()
    seeder = DjangoBreachObligationSeeder(obligation_service)
    case = make_case("breach")

    seeder(case)

    recipient_types = {call[2] for call in obligation_service.calls}
    assert recipient_types == {"regulator", "data_subject"}
    assert all(call[0] == ORG_ID and call[1] == case.id for call in obligation_service.calls)


def test_does_not_seed_anything_for_a_grievance():
    obligation_service = RecordingObligationService()
    seeder = DjangoBreachObligationSeeder(obligation_service)
    case = make_case("grievance")

    seeder(case)

    assert obligation_service.calls == []
