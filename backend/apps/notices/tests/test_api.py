import pytest
from rest_framework.test import APIClient

from apps.core.models import Organization, OrganizationMembership, User
from apps.notices.models import PrivacyNotice


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


def test_admin_can_draft_and_publish_a_notice(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    client = _client_for(admin)

    draft_response = client.post(
        f"/api/notices/create/?organization_id={org.id}",
        {"notice_type": "privacy_policy", "title": "Privacy Policy", "body": "We respect your privacy."},
    )
    assert draft_response.status_code == 201
    notice_id = draft_response.json()["id"]
    assert draft_response.json()["status"] == "draft"
    assert draft_response.json()["version"] == 1

    publish_response = client.post(f"/api/notices/{notice_id}/publish/?organization_id={org.id}")
    assert publish_response.status_code == 200
    assert publish_response.json()["status"] == "published"


def test_viewer_cannot_create_a_draft(org_and_users):
    org, viewer = org_and_users["org"], org_and_users["viewer"]
    client = _client_for(viewer)

    response = client.post(
        f"/api/notices/create/?organization_id={org.id}",
        {"notice_type": "privacy_policy", "title": "Privacy Policy"},
    )
    assert response.status_code == 403


def test_viewer_can_list_notices(org_and_users):
    org, admin, viewer = org_and_users["org"], org_and_users["admin"], org_and_users["viewer"]
    _client_for(admin).post(
        f"/api/notices/create/?organization_id={org.id}",
        {"notice_type": "privacy_policy", "title": "Privacy Policy"},
    )

    response = _client_for(viewer).get(f"/api/notices/?organization_id={org.id}")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_publishing_a_new_version_archives_the_old_one_via_the_api(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    client = _client_for(admin)
    v1 = PrivacyNotice.objects.create(
        organization=org, notice_type="privacy_policy", title="Privacy Policy", version=1
    )
    client.post(f"/api/notices/{v1.id}/publish/?organization_id={org.id}")

    v2_response = client.post(
        f"/api/notices/create/?organization_id={org.id}",
        {"notice_type": "privacy_policy", "title": "Privacy Policy v2"},
    )
    v2_id = v2_response.json()["id"]
    client.post(f"/api/notices/{v2_id}/publish/?organization_id={org.id}")

    v1.refresh_from_db()
    assert v1.status == "archived"


def test_invalid_publish_transition_returns_400(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    notice = PrivacyNotice.objects.create(
        organization=org,
        notice_type="privacy_policy",
        title="Privacy Policy",
        status=PrivacyNotice.Status.ARCHIVED,
    )
    client = _client_for(admin)

    response = client.post(f"/api/notices/{notice.id}/publish/?organization_id={org.id}")
    assert response.status_code == 400


def test_archive_404s_for_a_notice_belonging_to_another_org(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    other_org = Organization.objects.create(name="Other", slug="other")
    other_notice = PrivacyNotice.objects.create(
        organization=other_org, notice_type="privacy_policy", title="Other org policy"
    )
    client = _client_for(admin)

    response = client.post(f"/api/notices/{other_notice.id}/archive/?organization_id={org.id}")
    assert response.status_code == 404
