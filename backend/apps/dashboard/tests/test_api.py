import pytest
from rest_framework.test import APIClient

from apps.core.models import Organization, OrganizationMembership, User
from apps.rights.models import DSARRequest


@pytest.fixture
def org_and_users(db):
    org = Organization.objects.create(name="Acme", slug="acme")

    admin = User.objects.create_user(username="admin", email="admin@acme.test", password="x")
    OrganizationMembership.objects.create(organization=org, user=admin, role=OrganizationMembership.Role.ADMIN)

    return {"org": org, "admin": admin}


def _client_for(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


def test_admin_can_fetch_the_dashboard_summary(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    DSARRequest.objects.create(
        organization=org, subject_key="a@x.com", request_type="access", region="DE"
    )
    client = _client_for(admin)

    response = client.get(f"/api/dashboard/summary/?organization_id={org.id}")

    assert response.status_code == 200
    body = response.json()
    assert body["dsar"]["total"] == 1
    assert "cases" in body
    assert "consent" in body
    assert "generated_at" in body


def test_requires_organization_id(org_and_users):
    client = _client_for(org_and_users["admin"])
    response = client.get("/api/dashboard/summary/")
    assert response.status_code == 400


def test_requires_membership_in_the_organization(org_and_users):
    org = org_and_users["org"]
    outsider = User.objects.create_user(username="outsider", email="outsider@other.test", password="x")
    client = _client_for(outsider)

    response = client.get(f"/api/dashboard/summary/?organization_id={org.id}")
    assert response.status_code == 403
