import pytest
from rest_framework.test import APIClient

from apps.consent.models import Purpose
from apps.core.models import Organization, OrganizationMembership, User


@pytest.fixture
def org_with_members(db):
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


def test_admin_can_create_purpose(org_with_members):
    org, admin = org_with_members["org"], org_with_members["admin"]
    client = _client_for(admin)

    response = client.post(
        "/api/consent/purposes/",
        {"organization": str(org.id), "code": "marketing", "name": "Marketing", "is_essential": False},
    )
    assert response.status_code == 201
    assert Purpose.objects.filter(organization=org, code="marketing").exists()


def test_viewer_cannot_create_purpose(org_with_members):
    org, viewer = org_with_members["org"], org_with_members["viewer"]
    client = _client_for(viewer)

    response = client.post(
        "/api/consent/purposes/",
        {"organization": str(org.id), "code": "marketing", "name": "Marketing", "is_essential": False},
    )
    assert response.status_code == 403


def test_viewer_can_list_purposes(org_with_members):
    org, viewer = org_with_members["org"], org_with_members["viewer"]
    Purpose.objects.create(organization=org, code="security", name="Security", is_essential=True)
    client = _client_for(viewer)

    response = client.get("/api/consent/purposes/")
    assert response.status_code == 200
    assert response.json()["count"] == 1


def test_viewer_cannot_delete_purpose(org_with_members):
    org, viewer = org_with_members["org"], org_with_members["viewer"]
    purpose = Purpose.objects.create(organization=org, code="security", name="Security", is_essential=True)
    client = _client_for(viewer)

    response = client.delete(f"/api/consent/purposes/{purpose.id}/")
    assert response.status_code == 403
    assert Purpose.objects.filter(id=purpose.id).exists()
