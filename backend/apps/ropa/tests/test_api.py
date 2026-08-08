import pytest
from rest_framework.test import APIClient

from apps.core.models import Organization, OrganizationMembership, User
from apps.ropa.models import ProcessingActivity


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


def test_admin_can_create_and_transition_an_activity(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    client = _client_for(admin)

    create_response = client.post(
        f"/api/ropa/activities/create/?organization_id={org.id}",
        {"title": "Payroll processing", "legal_basis": "contract", "risk_level": "high"},
    )
    assert create_response.status_code == 201
    activity_id = create_response.json()["id"]
    assert create_response.json()["status"] == "draft"

    transition_response = client.post(
        f"/api/ropa/activities/{activity_id}/transition/?organization_id={org.id}",
        {"target_status": "active"},
    )
    assert transition_response.status_code == 200
    assert transition_response.json()["status"] == "active"


def test_viewer_cannot_create_an_activity(org_and_users):
    org, viewer = org_and_users["org"], org_and_users["viewer"]
    client = _client_for(viewer)

    response = client.post(
        f"/api/ropa/activities/create/?organization_id={org.id}",
        {"title": "Payroll processing", "legal_basis": "contract"},
    )
    assert response.status_code == 403


def test_viewer_can_list_activities(org_and_users):
    org, admin, viewer = org_and_users["org"], org_and_users["admin"], org_and_users["viewer"]
    _client_for(admin).post(
        f"/api/ropa/activities/create/?organization_id={org.id}",
        {"title": "Payroll processing", "legal_basis": "contract"},
    )

    response = _client_for(viewer).get(f"/api/ropa/activities/?organization_id={org.id}")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_invalid_transition_returns_400(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    activity = ProcessingActivity.objects.create(organization=org, title="Payroll processing", legal_basis="contract")
    client = _client_for(admin)

    response = client.post(
        f"/api/ropa/activities/{activity.id}/transition/?organization_id={org.id}",
        {"target_status": "archived"},
    )
    assert response.status_code == 400


def test_mark_reviewed_resets_the_review_clock(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    activity = ProcessingActivity.objects.create(
        organization=org, title="Payroll processing", legal_basis="contract", risk_level="low"
    )
    original_due = activity.review_due_at
    client = _client_for(admin)

    response = client.post(f"/api/ropa/activities/{activity.id}/mark-reviewed/?organization_id={org.id}")

    assert response.status_code == 200
    body = response.json()
    assert body["reviewed_at"] is not None
    assert body["review_due_at"] != original_due


def test_mark_reviewed_404s_for_an_activity_belonging_to_another_org(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    other_org = Organization.objects.create(name="Other", slug="other")
    other_activity = ProcessingActivity.objects.create(
        organization=other_org, title="Other org activity", legal_basis="contract"
    )
    client = _client_for(admin)

    response = client.post(f"/api/ropa/activities/{other_activity.id}/mark-reviewed/?organization_id={org.id}")
    assert response.status_code == 404
