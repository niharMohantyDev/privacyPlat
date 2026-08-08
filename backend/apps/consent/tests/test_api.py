import pytest
from rest_framework.test import APIClient

from apps.consent.models import Purpose
from apps.core.models import Organization, OrganizationMembership, User


@pytest.fixture
def org_and_user(db):
    org = Organization.objects.create(name="Acme", slug="acme")
    user = User.objects.create_user(username="alice", email="alice@acme.test", password="x")
    OrganizationMembership.objects.create(
        organization=org, user=user, role=OrganizationMembership.Role.ADMIN
    )
    Purpose.objects.create(organization=org, code="security", name="Security", is_essential=True)
    Purpose.objects.create(organization=org, code="analytics", name="Analytics", is_essential=False)
    return org, user


@pytest.fixture
def api_client(org_and_user):
    _, user = org_and_user
    client = APIClient()
    client.force_authenticate(user=user)
    return client


def test_record_and_fetch_current_consent(api_client, org_and_user):
    org, _ = org_and_user

    record_response = api_client.post(
        f"/api/consent/records/?organization_id={org.id}",
        {"subject_key": "device-abc", "region": "DE", "decisions": {"analytics": True}},
        format="json",
    )
    assert record_response.status_code == 201
    body = record_response.json()
    assert body["framework"] == "GDPR"
    assert body["version"] == 1
    assert len(body["signature"]) == 64

    latest_response = api_client.get(
        f"/api/consent/records/latest/?organization_id={org.id}&subject_key=device-abc"
    )
    assert latest_response.status_code == 200
    latest = latest_response.json()
    assert latest["version"] == 1
    analytics = next(d for d in latest["decisions"] if d["purpose_code"] == "analytics")
    assert analytics["granted"] is True


def test_consent_record_log_lists_all_records_for_the_org(api_client, org_and_user):
    org, _ = org_and_user

    api_client.post(
        f"/api/consent/records/?organization_id={org.id}",
        {"subject_key": "device-a", "region": "DE", "decisions": {"analytics": True}},
        format="json",
    )
    api_client.post(
        f"/api/consent/records/?organization_id={org.id}",
        {"subject_key": "device-b", "region": "IN", "decisions": {}},
        format="json",
    )

    response = api_client.get(f"/api/consent/records/log/?organization_id={org.id}")
    assert response.status_code == 200
    subject_keys = {r["subject_key"] for r in response.json()}
    assert subject_keys == {"device-a", "device-b"}


def test_consent_record_log_rejects_non_members(db):
    org = Organization.objects.create(name="Other Co", slug="other-co-log")
    outsider = User.objects.create_user(username="mallory2", email="mallory2@evil.test", password="x")
    api_client = APIClient()
    api_client.force_authenticate(user=outsider)

    response = api_client.get(f"/api/consent/records/log/?organization_id={org.id}")
    assert response.status_code == 403


def test_record_consent_rejects_non_members(db):
    org = Organization.objects.create(name="Other Co", slug="other-co")
    outsider = User.objects.create_user(username="mallory", email="mallory@evil.test", password="x")
    api_client = APIClient()
    api_client.force_authenticate(user=outsider)

    response = api_client.post(
        f"/api/consent/records/?organization_id={org.id}",
        {"subject_key": "device-x", "region": "DE"},
        format="json",
    )
    assert response.status_code == 403
