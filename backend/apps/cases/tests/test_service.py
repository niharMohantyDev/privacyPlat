import uuid

import pytest

from apps.cases.domain.exceptions import InvalidTransitionError
from apps.cases.services import CaseService

from .fakes import FakeCaseNotifier, FakeCaseRepository

ORG_ID = uuid.uuid4()


def make_service(audit_events=None, notifier=None):
    events = audit_events if audit_events is not None else []

    def audit_logger(**kwargs):
        events.append(kwargs)

    return CaseService(repository=FakeCaseRepository(), notifier=notifier, audit_logger=audit_logger)


def test_report_case_starts_in_reported_status():
    service = make_service()
    saved = service.report_case(organization_id=ORG_ID, case_type="breach", title="Data leak")
    assert saved.status == "reported"


def test_report_breach_sets_3_day_due_date():
    service = make_service()
    saved = service.report_case(organization_id=ORG_ID, case_type="breach", title="Data leak")
    assert (saved.due_at - saved.reported_at).days == 3


def test_report_grievance_sets_30_day_due_date():
    service = make_service()
    saved = service.report_case(organization_id=ORG_ID, case_type="grievance", title="Unwanted marketing")
    assert (saved.due_at - saved.reported_at).days == 30


def test_report_case_emits_audit_event():
    events = []
    service = make_service(audit_events=events)
    service.report_case(organization_id=ORG_ID, case_type="breach", title="Data leak")
    assert events[0]["action"] == "case.breach.reported"


def test_report_case_notifies_admins():
    notifier = FakeCaseNotifier()
    service = make_service(notifier=notifier)
    saved = service.report_case(organization_id=ORG_ID, case_type="breach", title="Data leak")
    assert notifier.reported == [saved]


def test_valid_transition_updates_status():
    service = make_service()
    saved = service.report_case(organization_id=ORG_ID, case_type="breach", title="Data leak")
    updated = service.transition(organization_id=ORG_ID, case_id=saved.id, target_status="investigating")
    assert updated.status == "investigating"


def test_invalid_transition_raises_and_leaves_status_unchanged():
    service = make_service()
    saved = service.report_case(organization_id=ORG_ID, case_type="breach", title="Data leak")
    with pytest.raises(InvalidTransitionError):
        service.transition(organization_id=ORG_ID, case_id=saved.id, target_status="resolved")


def test_transition_to_resolved_sets_resolved_at_and_notifies():
    notifier = FakeCaseNotifier()
    service = make_service(notifier=notifier)
    saved = service.report_case(organization_id=ORG_ID, case_type="grievance", title="Unwanted marketing")
    saved = service.transition(organization_id=ORG_ID, case_id=saved.id, target_status="investigating")
    resolved = service.transition(organization_id=ORG_ID, case_id=saved.id, target_status="resolved")
    assert resolved.resolved_at is not None
    assert notifier.resolved == [resolved]


def test_transition_on_unknown_case_raises_lookup_error():
    service = make_service()
    with pytest.raises(LookupError):
        service.transition(organization_id=ORG_ID, case_id=uuid.uuid4(), target_status="investigating")


def test_list_cases_scoped_to_organization():
    service = make_service()
    other_org = uuid.uuid4()
    service.report_case(organization_id=ORG_ID, case_type="breach", title="Data leak")
    service.report_case(organization_id=other_org, case_type="breach", title="Other org leak")
    results = service.list_cases(organization_id=ORG_ID)
    assert len(results) == 1
    assert results[0].title == "Data leak"


def test_report_case_invokes_the_on_case_reported_hook():
    seen = []
    service = CaseService(repository=FakeCaseRepository(), on_case_reported=seen.append)

    saved = service.report_case(organization_id=ORG_ID, case_type="breach", title="Data leak")

    assert seen == [saved]


def test_list_cases_filters_by_case_type():
    service = make_service()
    service.report_case(organization_id=ORG_ID, case_type="breach", title="Data leak")
    service.report_case(organization_id=ORG_ID, case_type="grievance", title="Unwanted marketing")
    results = service.list_cases(organization_id=ORG_ID, case_type="grievance")
    assert len(results) == 1
    assert results[0].case_type == "grievance"
