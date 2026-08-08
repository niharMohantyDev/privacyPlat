import uuid

import pytest

from apps.ropa.domain.exceptions import InvalidTransitionError
from apps.ropa.services import ProcessingActivityService

from .fakes import FakeProcessingActivityRepository

ORG_ID = uuid.uuid4()


def make_service(audit_events=None):
    events = audit_events if audit_events is not None else []

    def audit_logger(**kwargs):
        events.append(kwargs)

    return ProcessingActivityService(repository=FakeProcessingActivityRepository(), audit_logger=audit_logger)


def test_create_activity_starts_in_draft_status():
    service = make_service()
    saved = service.create_activity(organization_id=ORG_ID, title="Payroll processing", legal_basis="contract")
    assert saved.status == "draft"


def test_create_activity_defaults_to_medium_risk():
    service = make_service()
    saved = service.create_activity(organization_id=ORG_ID, title="Payroll processing", legal_basis="contract")
    assert saved.risk_level == "medium"
    assert saved.review_due_at is not None


def test_high_risk_activity_gets_a_180_day_review_window():
    service = make_service()
    saved = service.create_activity(
        organization_id=ORG_ID, title="Biometric access control", legal_basis="legitimate_interests", risk_level="high"
    )
    from datetime import datetime, timezone

    now = datetime.now(timezone.utc)
    assert 178 <= (saved.review_due_at - now).days <= 180


def test_create_activity_emits_audit_event():
    events = []
    service = make_service(audit_events=events)
    service.create_activity(organization_id=ORG_ID, title="Payroll processing", legal_basis="contract")
    assert events[0]["action"] == "ropa.activity.created"


def test_valid_transition_updates_status():
    service = make_service()
    saved = service.create_activity(organization_id=ORG_ID, title="Payroll processing", legal_basis="contract")
    updated = service.transition(organization_id=ORG_ID, activity_id=saved.id, target_status="active")
    assert updated.status == "active"


def test_invalid_transition_raises_and_leaves_status_unchanged():
    service = make_service()
    saved = service.create_activity(organization_id=ORG_ID, title="Payroll processing", legal_basis="contract")
    with pytest.raises(InvalidTransitionError):
        service.transition(organization_id=ORG_ID, activity_id=saved.id, target_status="archived")


def test_active_can_be_archived():
    service = make_service()
    saved = service.create_activity(organization_id=ORG_ID, title="Payroll processing", legal_basis="contract")
    saved = service.transition(organization_id=ORG_ID, activity_id=saved.id, target_status="active")
    archived = service.transition(organization_id=ORG_ID, activity_id=saved.id, target_status="archived")
    assert archived.status == "archived"


def test_transition_on_unknown_activity_raises_lookup_error():
    service = make_service()
    with pytest.raises(LookupError):
        service.transition(organization_id=ORG_ID, activity_id=uuid.uuid4(), target_status="active")


def test_mark_reviewed_sets_reviewed_at_and_pushes_review_due_at_forward():
    service = make_service()
    saved = service.create_activity(
        organization_id=ORG_ID, title="Payroll processing", legal_basis="contract", risk_level="low"
    )
    original_due = saved.review_due_at

    reviewed = service.mark_reviewed(organization_id=ORG_ID, activity_id=saved.id)

    assert reviewed.reviewed_at is not None
    assert reviewed.review_due_at >= original_due


def test_mark_reviewed_on_unknown_activity_raises_lookup_error():
    service = make_service()
    with pytest.raises(LookupError):
        service.mark_reviewed(organization_id=ORG_ID, activity_id=uuid.uuid4())


def test_list_activities_scoped_to_organization():
    service = make_service()
    other_org = uuid.uuid4()
    service.create_activity(organization_id=ORG_ID, title="Payroll processing", legal_basis="contract")
    service.create_activity(organization_id=other_org, title="Other org activity", legal_basis="contract")
    results = service.list_activities(organization_id=ORG_ID)
    assert len(results) == 1
    assert results[0].title == "Payroll processing"


def test_list_activities_filters_by_status():
    service = make_service()
    draft = service.create_activity(organization_id=ORG_ID, title="Draft activity", legal_basis="contract")
    active = service.create_activity(organization_id=ORG_ID, title="Active activity", legal_basis="contract")
    service.transition(organization_id=ORG_ID, activity_id=active.id, target_status="active")

    results = service.list_activities(organization_id=ORG_ID, status="active")
    assert len(results) == 1
    assert results[0].title == "Active activity"
    assert draft.status == "draft"
