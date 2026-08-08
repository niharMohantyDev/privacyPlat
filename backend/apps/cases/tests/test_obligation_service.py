import uuid
from datetime import datetime, timezone

import pytest

from apps.cases.domain.entities import CaseEntity
from apps.cases.domain.exceptions import InvalidTransitionError
from apps.cases.obligation_services import BreachNotificationObligationService

from .fakes import FakeBreachNotificationObligationRepository, FakeCaseRepository

ORG_ID = uuid.uuid4()
NOW = datetime(2026, 1, 1, tzinfo=timezone.utc)


def make_case(case_repository, *, case_type="breach", organization_id=ORG_ID) -> CaseEntity:
    case = CaseEntity(
        id=uuid.uuid4(),
        organization_id=organization_id,
        case_type=case_type,
        status="reported",
        title="Unencrypted backup exposed",
        description="",
        reported_by="",
        region="",
        severity="high",
        reported_at=NOW,
        due_at=None,
    )
    return case_repository.save(case)


def make_service(case_repository=None, audit_events=None):
    events = audit_events if audit_events is not None else []

    def audit_logger(**kwargs):
        events.append(kwargs)

    return BreachNotificationObligationService(
        repository=FakeBreachNotificationObligationRepository(),
        case_repository=case_repository or FakeCaseRepository(),
        audit_logger=audit_logger,
    )


def test_create_obligation_starts_pending_with_a_due_date():
    case_repository = FakeCaseRepository()
    case = make_case(case_repository)
    service = make_service(case_repository)

    saved = service.create_obligation(organization_id=ORG_ID, case_id=case.id, recipient_type="regulator")

    assert saved.status == "pending"
    assert saved.due_at is not None


def test_regulator_obligation_due_72_hours_after_detection():
    case_repository = FakeCaseRepository()
    case = make_case(case_repository)
    service = make_service(case_repository)

    saved = service.create_obligation(organization_id=ORG_ID, case_id=case.id, recipient_type="regulator")

    assert (saved.due_at - case.reported_at).total_seconds() == 72 * 3600


def test_create_obligation_rejects_a_grievance_case():
    case_repository = FakeCaseRepository()
    case = make_case(case_repository, case_type="grievance")
    service = make_service(case_repository)

    with pytest.raises(ValueError):
        service.create_obligation(organization_id=ORG_ID, case_id=case.id, recipient_type="regulator")


def test_create_obligation_on_unknown_case_raises_lookup_error():
    service = make_service()
    with pytest.raises(LookupError):
        service.create_obligation(organization_id=ORG_ID, case_id=uuid.uuid4(), recipient_type="regulator")


def test_create_obligation_emits_audit_event():
    case_repository = FakeCaseRepository()
    case = make_case(case_repository)
    events = []
    service = make_service(case_repository, audit_events=events)

    service.create_obligation(organization_id=ORG_ID, case_id=case.id, recipient_type="vendor")

    assert events[0]["action"] == "case.breach.obligation.created"


def test_mark_notified_sets_status_and_notified_at():
    case_repository = FakeCaseRepository()
    case = make_case(case_repository)
    service = make_service(case_repository)
    obligation = service.create_obligation(organization_id=ORG_ID, case_id=case.id, recipient_type="regulator")

    notified = service.mark_notified(organization_id=ORG_ID, obligation_id=obligation.id, notes="Called the DPA.")

    assert notified.status == "notified"
    assert notified.notified_at is not None
    assert "Called the DPA." in notified.notes


def test_mark_not_required_sets_status_without_notified_at():
    case_repository = FakeCaseRepository()
    case = make_case(case_repository)
    service = make_service(case_repository)
    obligation = service.create_obligation(organization_id=ORG_ID, case_id=case.id, recipient_type="vendor")

    updated = service.mark_not_required(organization_id=ORG_ID, obligation_id=obligation.id)

    assert updated.status == "not_required"
    assert updated.notified_at is None


def test_cannot_mark_an_already_notified_obligation_notified_again():
    case_repository = FakeCaseRepository()
    case = make_case(case_repository)
    service = make_service(case_repository)
    obligation = service.create_obligation(organization_id=ORG_ID, case_id=case.id, recipient_type="regulator")
    service.mark_notified(organization_id=ORG_ID, obligation_id=obligation.id)

    with pytest.raises(InvalidTransitionError):
        service.mark_notified(organization_id=ORG_ID, obligation_id=obligation.id)


def test_mark_notified_on_unknown_obligation_raises_lookup_error():
    service = make_service()
    with pytest.raises(LookupError):
        service.mark_notified(organization_id=ORG_ID, obligation_id=uuid.uuid4())


def test_list_for_case_scoped_to_case_and_organization():
    case_repository = FakeCaseRepository()
    case = make_case(case_repository)
    other_case = make_case(case_repository)
    service = make_service(case_repository)

    service.create_obligation(organization_id=ORG_ID, case_id=case.id, recipient_type="regulator")
    service.create_obligation(organization_id=ORG_ID, case_id=other_case.id, recipient_type="vendor")

    results = service.list_for_case(organization_id=ORG_ID, case_id=case.id)
    assert len(results) == 1
    assert results[0].recipient_type == "regulator"
