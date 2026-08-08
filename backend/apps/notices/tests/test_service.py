import uuid

import pytest

from apps.notices.domain.exceptions import InvalidTransitionError
from apps.notices.services import PrivacyNoticeService

from .fakes import FakePrivacyNoticeRepository

ORG_ID = uuid.uuid4()


def make_service(audit_events=None):
    events = audit_events if audit_events is not None else []

    def audit_logger(**kwargs):
        events.append(kwargs)

    return PrivacyNoticeService(repository=FakePrivacyNoticeRepository(), audit_logger=audit_logger)


def test_create_draft_starts_at_version_1():
    service = make_service()
    saved = service.create_draft(organization_id=ORG_ID, notice_type="privacy_policy", title="Privacy Policy")
    assert saved.version == 1
    assert saved.status == "draft"


def test_create_draft_increments_version_per_notice_type():
    service = make_service()
    first = service.create_draft(organization_id=ORG_ID, notice_type="privacy_policy", title="Privacy Policy")
    service.publish(organization_id=ORG_ID, notice_id=first.id)
    second = service.create_draft(organization_id=ORG_ID, notice_type="privacy_policy", title="Privacy Policy v2")
    assert second.version == 2


def test_create_draft_emits_audit_event():
    events = []
    service = make_service(audit_events=events)
    service.create_draft(organization_id=ORG_ID, notice_type="privacy_policy", title="Privacy Policy")
    assert events[0]["action"] == "notice.draft.created"


def test_publish_sets_status_and_review_due_date():
    service = make_service()
    draft = service.create_draft(organization_id=ORG_ID, notice_type="privacy_policy", title="Privacy Policy")
    published = service.publish(organization_id=ORG_ID, notice_id=draft.id)
    assert published.status == "published"
    assert published.published_at is not None
    assert (published.review_due_at - published.published_at).days == 365


def test_publishing_a_new_version_archives_the_previous_published_one():
    service = make_service()
    v1 = service.create_draft(organization_id=ORG_ID, notice_type="privacy_policy", title="Privacy Policy")
    service.publish(organization_id=ORG_ID, notice_id=v1.id)

    v2 = service.create_draft(organization_id=ORG_ID, notice_type="privacy_policy", title="Privacy Policy v2")
    service.publish(organization_id=ORG_ID, notice_id=v2.id)

    published = service.get_published(organization_id=ORG_ID, notice_type="privacy_policy")
    assert published.id == v2.id

    all_versions = {n.id: n.status for n in service.list_notices(organization_id=ORG_ID, notice_type="privacy_policy")}
    assert all_versions[v1.id] == "archived"


def test_publishing_a_different_notice_type_does_not_touch_the_other():
    service = make_service()
    policy = service.create_draft(organization_id=ORG_ID, notice_type="privacy_policy", title="Privacy Policy")
    service.publish(organization_id=ORG_ID, notice_id=policy.id)

    terms = service.create_draft(organization_id=ORG_ID, notice_type="terms_of_service", title="Terms")
    service.publish(organization_id=ORG_ID, notice_id=terms.id)

    still_published = service.get_published(organization_id=ORG_ID, notice_type="privacy_policy")
    assert still_published.id == policy.id
    assert still_published.status == "published"


def test_cannot_publish_an_already_published_notice_again():
    service = make_service()
    draft = service.create_draft(organization_id=ORG_ID, notice_type="privacy_policy", title="Privacy Policy")
    service.publish(organization_id=ORG_ID, notice_id=draft.id)

    with pytest.raises(InvalidTransitionError):
        service.publish(organization_id=ORG_ID, notice_id=draft.id)


def test_publish_on_unknown_notice_raises_lookup_error():
    service = make_service()
    with pytest.raises(LookupError):
        service.publish(organization_id=ORG_ID, notice_id=uuid.uuid4())


def test_archive_a_draft_directly():
    service = make_service()
    draft = service.create_draft(organization_id=ORG_ID, notice_type="privacy_policy", title="Privacy Policy")
    archived = service.archive(organization_id=ORG_ID, notice_id=draft.id)
    assert archived.status == "archived"


def test_cannot_archive_an_already_archived_notice():
    service = make_service()
    draft = service.create_draft(organization_id=ORG_ID, notice_type="privacy_policy", title="Privacy Policy")
    service.archive(organization_id=ORG_ID, notice_id=draft.id)
    with pytest.raises(InvalidTransitionError):
        service.archive(organization_id=ORG_ID, notice_id=draft.id)


def test_get_published_raises_lookup_error_when_none_published():
    service = make_service()
    with pytest.raises(LookupError):
        service.get_published(organization_id=ORG_ID, notice_type="privacy_policy")


def test_list_notices_scoped_to_organization():
    service = make_service()
    other_org = uuid.uuid4()
    service.create_draft(organization_id=ORG_ID, notice_type="privacy_policy", title="Privacy Policy")
    service.create_draft(organization_id=other_org, notice_type="privacy_policy", title="Other org policy")
    results = service.list_notices(organization_id=ORG_ID)
    assert len(results) == 1
    assert results[0].title == "Privacy Policy"
