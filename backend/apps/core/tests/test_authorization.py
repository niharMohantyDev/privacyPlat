"""
Regression tests for the privilege-escalation gap: writes to
Workspace/Asset/OrganizationMembership must check the caller's
membership (and role, for membership writes) in the *target* org, not
just that they belong to *some* org.
"""

import pytest
from rest_framework.test import APIClient

from apps.core.models import Organization, OrganizationMembership, User, Workspace


@pytest.fixture
def two_orgs_and_users(db):
    org_a = Organization.objects.create(name="Org A", slug="org-a")
    org_b = Organization.objects.create(name="Org B", slug="org-b")

    admin_a = User.objects.create_user(username="admin_a", email="admin_a@test.com", password="x")
    OrganizationMembership.objects.create(
        organization=org_a, user=admin_a, role=OrganizationMembership.Role.ADMIN
    )

    viewer_a = User.objects.create_user(username="viewer_a", email="viewer_a@test.com", password="x")
    OrganizationMembership.objects.create(
        organization=org_a, user=viewer_a, role=OrganizationMembership.Role.VIEWER
    )

    outsider = User.objects.create_user(username="outsider", email="outsider@test.com", password="x")

    return {"org_a": org_a, "org_b": org_b, "admin_a": admin_a, "viewer_a": viewer_a, "outsider": outsider}


def _client_for(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


def test_non_member_cannot_create_workspace_in_someone_elses_org(two_orgs_and_users):
    outsider = two_orgs_and_users["outsider"]
    org_a = two_orgs_and_users["org_a"]
    client = _client_for(outsider)

    response = client.post(
        "/api/workspaces/", {"organization": str(org_a.id), "name": "Hostile", "slug": "hostile"}
    )
    assert response.status_code == 403
    assert not Workspace.objects.filter(slug="hostile").exists()


def test_viewer_role_cannot_create_workspace(two_orgs_and_users):
    viewer_a = two_orgs_and_users["viewer_a"]
    org_a = two_orgs_and_users["org_a"]
    client = _client_for(viewer_a)

    response = client.post(
        "/api/workspaces/", {"organization": str(org_a.id), "name": "Nope", "slug": "nope"}
    )
    assert response.status_code == 403


def test_admin_role_can_create_workspace_in_own_org(two_orgs_and_users):
    admin_a = two_orgs_and_users["admin_a"]
    org_a = two_orgs_and_users["org_a"]
    client = _client_for(admin_a)

    response = client.post(
        "/api/workspaces/", {"organization": str(org_a.id), "name": "Marketing", "slug": "marketing"}
    )
    assert response.status_code == 201


def test_non_admin_cannot_grant_themselves_membership_in_another_org(two_orgs_and_users):
    """
    The critical case: before the fix, any authenticated user could POST
    to /api/memberships/ with an arbitrary organization id and role=admin
    to grant themselves admin access to an org they have nothing to do
    with.
    """
    outsider = two_orgs_and_users["outsider"]
    org_b = two_orgs_and_users["org_b"]
    client = _client_for(outsider)

    response = client.post(
        "/api/memberships/",
        {
            "organization": str(org_b.id),
            "user": str(outsider.id),
            "role": OrganizationMembership.Role.ADMIN,
        },
    )
    assert response.status_code == 403
    assert not OrganizationMembership.objects.filter(organization=org_b, user=outsider).exists()


def test_admin_can_grant_membership_in_their_own_org(two_orgs_and_users):
    admin_a = two_orgs_and_users["admin_a"]
    org_a = two_orgs_and_users["org_a"]
    new_user = User.objects.create_user(username="new_user", email="new_user@test.com", password="x")
    client = _client_for(admin_a)

    response = client.post(
        "/api/memberships/",
        {
            "organization": str(org_a.id),
            "user": str(new_user.id),
            "role": OrganizationMembership.Role.ANALYST,
        },
    )
    assert response.status_code == 201
