import pytest
from rest_framework.test import APIClient

from apps.core.models import Organization, OrganizationMembership, User
from apps.notifications.models import Notification


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


def test_admin_can_report_and_transition_a_case(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    client = _client_for(admin)

    report_response = client.post(
        f"/api/cases/report/?organization_id={org.id}",
        {"case_type": "breach", "title": "Unencrypted backup exposed", "severity": "high"},
    )
    assert report_response.status_code == 201
    case_id = report_response.json()["id"]
    assert report_response.json()["status"] == "reported"

    transition_response = client.post(
        f"/api/cases/{case_id}/transition/?organization_id={org.id}",
        {"target_status": "investigating"},
    )
    assert transition_response.status_code == 200
    assert transition_response.json()["status"] == "investigating"


def test_reporting_a_case_notifies_the_org_admin(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    client = _client_for(admin)

    response = client.post(
        f"/api/cases/report/?organization_id={org.id}",
        {"case_type": "breach", "title": "Unencrypted backup exposed"},
    )
    assert response.status_code == 201

    notification = Notification.objects.get(organization_id=org.id)
    assert notification.recipient == admin.email
    assert notification.event_type == "case.breach.reported"


def test_viewer_cannot_report_a_case(org_and_users):
    org, viewer = org_and_users["org"], org_and_users["viewer"]
    client = _client_for(viewer)

    response = client.post(
        f"/api/cases/report/?organization_id={org.id}",
        {"case_type": "breach", "title": "Unencrypted backup exposed"},
    )
    assert response.status_code == 403


def test_viewer_can_list_cases(org_and_users):
    org, admin, viewer = org_and_users["org"], org_and_users["admin"], org_and_users["viewer"]
    _client_for(admin).post(
        f"/api/cases/report/?organization_id={org.id}",
        {"case_type": "grievance", "title": "Unwanted marketing", "reported_by": "alice@example.com"},
    )

    response = _client_for(viewer).get(f"/api/cases/?organization_id={org.id}")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_list_cases_can_filter_by_case_type(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    client = _client_for(admin)
    client.post(
        f"/api/cases/report/?organization_id={org.id}",
        {"case_type": "breach", "title": "Unencrypted backup exposed"},
    )
    client.post(
        f"/api/cases/report/?organization_id={org.id}",
        {"case_type": "grievance", "title": "Unwanted marketing", "reported_by": "alice@example.com"},
    )

    response = client.get(f"/api/cases/?organization_id={org.id}&case_type=grievance")
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["case_type"] == "grievance"


def test_invalid_transition_returns_400(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    client = _client_for(admin)
    report_response = client.post(
        f"/api/cases/report/?organization_id={org.id}",
        {"case_type": "breach", "title": "Unencrypted backup exposed"},
    )
    case_id = report_response.json()["id"]

    response = client.post(
        f"/api/cases/{case_id}/transition/?organization_id={org.id}",
        {"target_status": "resolved"},
    )
    assert response.status_code == 400
