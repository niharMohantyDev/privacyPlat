import pytest
from rest_framework.test import APIClient

from apps.core.models import Organization, OrganizationMembership, User
from apps.rights.models import DSARRequest


@pytest.fixture
def org_and_users(db):
    org = Organization.objects.create(name="Acme", slug="acme")

    admin = User.objects.create_user(username="admin", email="admin@acme.test", password="x")
    OrganizationMembership.objects.create(organization=org, user=admin, role=OrganizationMembership.Role.ADMIN)

    viewer = User.objects.create_user(username="viewer", email="viewer@acme.test", password="x")
    OrganizationMembership.objects.create(organization=org, user=viewer, role=OrganizationMembership.Role.VIEWER)

    return {"org": org, "admin": admin, "viewer": viewer}


def _client_for(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


def test_admin_can_submit_and_transition_a_request(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    client = _client_for(admin)

    submit_response = client.post(
        f"/api/rights/requests/submit/?organization_id={org.id}",
        {"subject_key": "alice@example.com", "request_type": "access", "region": "DE"},
    )
    assert submit_response.status_code == 201
    request_id = submit_response.json()["id"]
    assert submit_response.json()["status"] == "submitted"

    transition_response = client.post(
        f"/api/rights/requests/{request_id}/transition/?organization_id={org.id}",
        {"target_status": "identity_verification"},
    )
    assert transition_response.status_code == 200
    assert transition_response.json()["status"] == "identity_verification"


def test_viewer_cannot_submit_a_request(org_and_users):
    org, viewer = org_and_users["org"], org_and_users["viewer"]
    client = _client_for(viewer)

    response = client.post(
        f"/api/rights/requests/submit/?organization_id={org.id}",
        {"subject_key": "alice@example.com", "request_type": "access", "region": "DE"},
    )
    assert response.status_code == 403


def test_viewer_can_list_requests(org_and_users):
    org, admin, viewer = org_and_users["org"], org_and_users["admin"], org_and_users["viewer"]
    DSARRequest.objects.create(
        organization=org, subject_key="alice@example.com", request_type="access", region="DE"
    )
    client = _client_for(viewer)

    response = client.get(f"/api/rights/requests/?organization_id={org.id}")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_invalid_transition_returns_400(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    request = DSARRequest.objects.create(
        organization=org, subject_key="alice@example.com", request_type="access", region="DE"
    )
    client = _client_for(admin)

    response = client.post(
        f"/api/rights/requests/{request.id}/transition/?organization_id={org.id}",
        {"target_status": "completed"},
    )
    assert response.status_code == 400
