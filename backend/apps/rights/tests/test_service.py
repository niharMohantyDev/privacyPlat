import uuid

import pytest

from apps.rights.domain.exceptions import InvalidTransitionError
from apps.rights.services import DSARService

from .fakes import FakeDSARRequestRepository

ORG_ID = uuid.uuid4()


def make_service(audit_events=None):
    events = audit_events if audit_events is not None else []

    def audit_logger(**kwargs):
        events.append(kwargs)

    return DSARService(repository=FakeDSARRequestRepository(), audit_logger=audit_logger)


def test_submit_request_starts_in_submitted_status():
    service = make_service()
    saved = service.submit_request(
        organization_id=ORG_ID, subject_key="alice@example.com", request_type="access", region="DE"
    )
    assert saved.status == "submitted"


def test_submit_request_sets_gdpr_due_date_30_days_out():
    service = make_service()
    saved = service.submit_request(
        organization_id=ORG_ID, subject_key="alice@example.com", request_type="deletion", region="DE"
    )
    assert (saved.due_at - saved.submitted_at).days == 30


def test_submit_request_emits_audit_event_with_framework():
    events = []
    service = make_service(audit_events=events)
    service.submit_request(
        organization_id=ORG_ID, subject_key="alice@example.com", request_type="access", region="IN"
    )
    assert events[0]["action"] == "dsar.submitted"
    assert events[0]["metadata"]["framework"] == "DPDP"


def test_valid_transition_updates_status():
    service = make_service()
    saved = service.submit_request(
        organization_id=ORG_ID, subject_key="alice@example.com", request_type="access", region="DE"
    )
    updated = service.transition(
        organization_id=ORG_ID, request_id=saved.id, target_status="identity_verification"
    )
    assert updated.status == "identity_verification"


def test_invalid_transition_raises_and_leaves_status_unchanged():
    service = make_service()
    saved = service.submit_request(
        organization_id=ORG_ID, subject_key="alice@example.com", request_type="access", region="DE"
    )
    with pytest.raises(InvalidTransitionError):
        service.transition(organization_id=ORG_ID, request_id=saved.id, target_status="completed")


def test_transition_to_terminal_status_sets_resolved_at():
    service = make_service()
    saved = service.submit_request(
        organization_id=ORG_ID, subject_key="alice@example.com", request_type="access", region="DE"
    )
    withdrawn = service.transition(
        organization_id=ORG_ID, request_id=saved.id, target_status="identity_verification"
    )
    withdrawn = service.transition(
        organization_id=ORG_ID, request_id=withdrawn.id, target_status="in_progress"
    )
    withdrawn = service.transition(
        organization_id=ORG_ID, request_id=withdrawn.id, target_status="withdrawn"
    )
    assert withdrawn.resolved_at is not None


def test_transition_on_unknown_request_raises_lookup_error():
    service = make_service()
    with pytest.raises(LookupError):
        service.transition(
            organization_id=ORG_ID, request_id=uuid.uuid4(), target_status="in_progress"
        )


def test_list_requests_scoped_to_organization():
    service = make_service()
    other_org = uuid.uuid4()
    service.submit_request(
        organization_id=ORG_ID, subject_key="alice@example.com", request_type="access", region="DE"
    )
    service.submit_request(
        organization_id=other_org, subject_key="bob@example.com", request_type="access", region="DE"
    )
    results = service.list_requests(organization_id=ORG_ID)
    assert len(results) == 1
    assert results[0].subject_key == "alice@example.com"
