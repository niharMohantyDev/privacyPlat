import uuid

from apps.consent.domain.entities import PurposeEntity
from apps.consent.domain.receipt_factory import Sha256ReceiptFactory
from apps.consent.services import ConsentService

from .fakes import FakeConsentRepository

ORG_ID = uuid.uuid4()

ESSENTIAL = PurposeEntity(id=uuid.uuid4(), code="security", name="Security", is_essential=True)
ANALYTICS = PurposeEntity(id=uuid.uuid4(), code="analytics", name="Analytics", is_essential=False)
MARKETING = PurposeEntity(id=uuid.uuid4(), code="marketing", name="Marketing", is_essential=False)


def make_service(repository=None, audit_events=None):
    repository = repository or FakeConsentRepository(purposes=[ESSENTIAL, ANALYTICS, MARKETING])
    events = audit_events if audit_events is not None else []

    def audit_logger(**kwargs):
        events.append(kwargs)

    return ConsentService(
        repository=repository,
        receipt_factory=Sha256ReceiptFactory(),
        audit_logger=audit_logger,
    )


def test_essential_purpose_is_always_granted_regardless_of_input():
    service = make_service()
    receipt = service.record_consent(
        organization_id=ORG_ID,
        asset_id=None,
        subject_key="device-1",
        region="DE",
        decisions={"security": False},  # attempt to deny an essential purpose
    )
    security_decision = next(d for d in receipt.decisions if d.purpose_code == "security")
    assert security_decision.granted is True


def test_gdpr_region_defaults_undeclared_non_essential_purpose_to_denied():
    service = make_service()
    receipt = service.record_consent(
        organization_id=ORG_ID,
        asset_id=None,
        subject_key="device-2",
        region="DE",
        decisions={},  # no explicit choice on analytics/marketing
    )
    assert all(not d.granted for d in receipt.decisions if d.purpose_code != "security")


def test_ccpa_region_defaults_undeclared_non_essential_purpose_to_granted():
    service = make_service()
    receipt = service.record_consent(
        organization_id=ORG_ID,
        asset_id=None,
        subject_key="device-3",
        region="US-CA",
        decisions={},
    )
    assert all(d.granted for d in receipt.decisions)


def test_explicit_decision_is_honored_over_the_region_default():
    service = make_service()
    receipt = service.record_consent(
        organization_id=ORG_ID,
        asset_id=None,
        subject_key="device-4",
        region="DE",
        decisions={"analytics": True},
    )
    analytics_decision = next(d for d in receipt.decisions if d.purpose_code == "analytics")
    assert analytics_decision.granted is True


def test_second_record_for_same_subject_increments_version():
    repository = FakeConsentRepository(purposes=[ESSENTIAL, ANALYTICS, MARKETING])
    service = make_service(repository=repository)

    first = service.record_consent(
        organization_id=ORG_ID, asset_id=None, subject_key="device-5", region="DE", decisions={}
    )
    second = service.record_consent(
        organization_id=ORG_ID,
        asset_id=None,
        subject_key="device-5",
        region="DE",
        decisions={"analytics": True},
    )
    assert first.version == 1
    assert second.version == 2


def test_recording_consent_emits_an_audit_event():
    events = []
    service = make_service(audit_events=events)
    service.record_consent(
        organization_id=ORG_ID, asset_id=None, subject_key="device-6", region="IN", decisions={}
    )
    assert len(events) == 1
    assert events[0]["action"] == "consent.given"
    assert events[0]["metadata"]["framework"] == "DPDP"


def test_get_current_consent_returns_the_latest_version():
    repository = FakeConsentRepository(purposes=[ESSENTIAL])
    service = make_service(repository=repository)
    service.record_consent(
        organization_id=ORG_ID, asset_id=None, subject_key="device-7", region="DE", decisions={}
    )
    service.record_consent(
        organization_id=ORG_ID, asset_id=None, subject_key="device-7", region="DE", decisions={}
    )
    current = service.get_current_consent(organization_id=ORG_ID, subject_key="device-7")
    assert current.version == 2


def test_list_records_returns_every_record_for_the_organization():
    repository = FakeConsentRepository(purposes=[ESSENTIAL])
    service = make_service(repository=repository)
    other_org = uuid.uuid4()

    service.record_consent(
        organization_id=ORG_ID, asset_id=None, subject_key="device-8", region="DE", decisions={}
    )
    service.record_consent(
        organization_id=ORG_ID, asset_id=None, subject_key="device-9", region="IN", decisions={}
    )
    service.record_consent(
        organization_id=other_org, asset_id=None, subject_key="device-x", region="DE", decisions={}
    )

    records = service.list_records(organization_id=ORG_ID)
    assert {r.subject_key for r in records} == {"device-8", "device-9"}
