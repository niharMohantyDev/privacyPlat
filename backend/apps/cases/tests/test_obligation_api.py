import pytest
from rest_framework.test import APIClient

from apps.cases.models import BreachNotificationObligation, Case
from apps.core.models import Organization, OrganizationMembership, User


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


def test_reporting_a_breach_auto_seeds_regulator_and_data_subject_obligations(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    client = _client_for(admin)

    response = client.post(
        f"/api/cases/report/?organization_id={org.id}",
        {"case_type": "breach", "title": "Unencrypted backup exposed"},
    )
    case_id = response.json()["id"]

    obligations = BreachNotificationObligation.objects.filter(case_id=case_id)
    assert set(obligations.values_list("recipient_type", flat=True)) == {"regulator", "data_subject"}
    assert all(o.status == "pending" for o in obligations)


def test_reporting_a_grievance_does_not_seed_obligations(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    client = _client_for(admin)

    response = client.post(
        f"/api/cases/report/?organization_id={org.id}",
        {"case_type": "grievance", "title": "Unwanted marketing", "reported_by": "alice@example.com"},
    )
    case_id = response.json()["id"]

    assert BreachNotificationObligation.objects.filter(case_id=case_id).count() == 0


def test_admin_can_add_and_list_an_obligation(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    case = Case.objects.create(organization=org, case_type="breach", title="Leak")
    client = _client_for(admin)

    create_response = client.post(
        f"/api/cases/{case.id}/notifications/create/?organization_id={org.id}",
        {"recipient_type": "vendor", "recipient_identifier": "Acme Cloud Storage Inc."},
    )
    assert create_response.status_code == 201
    assert create_response.json()["status"] == "pending"

    list_response = client.get(f"/api/cases/{case.id}/notifications/?organization_id={org.id}")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1


def test_cannot_add_an_obligation_to_a_grievance(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    case = Case.objects.create(organization=org, case_type="grievance", title="Complaint")
    client = _client_for(admin)

    response = client.post(
        f"/api/cases/{case.id}/notifications/create/?organization_id={org.id}",
        {"recipient_type": "regulator"},
    )
    assert response.status_code == 400


def test_viewer_cannot_add_an_obligation(org_and_users):
    org, viewer = org_and_users["org"], org_and_users["viewer"]
    case = Case.objects.create(organization=org, case_type="breach", title="Leak")
    client = _client_for(viewer)

    response = client.post(
        f"/api/cases/{case.id}/notifications/create/?organization_id={org.id}",
        {"recipient_type": "regulator"},
    )
    assert response.status_code == 403


def test_admin_can_mark_an_obligation_notified(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    case = Case.objects.create(organization=org, case_type="breach", title="Leak")
    obligation = BreachNotificationObligation.objects.create(
        case=case, organization=org, recipient_type="regulator"
    )
    client = _client_for(admin)

    response = client.post(
        f"/api/cases/notifications/{obligation.id}/mark-notified/?organization_id={org.id}",
        {"notes": "Filed via the DPA's online portal."},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "notified"
    assert body["notified_at"] is not None


def test_marking_an_already_notified_obligation_notified_again_returns_400(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    case = Case.objects.create(organization=org, case_type="breach", title="Leak")
    obligation = BreachNotificationObligation.objects.create(
        case=case, organization=org, recipient_type="regulator", status=BreachNotificationObligation.Status.NOTIFIED
    )
    client = _client_for(admin)

    response = client.post(
        f"/api/cases/notifications/{obligation.id}/mark-notified/?organization_id={org.id}"
    )
    assert response.status_code == 400


def test_admin_can_mark_an_obligation_not_required(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    case = Case.objects.create(organization=org, case_type="breach", title="Leak")
    obligation = BreachNotificationObligation.objects.create(case=case, organization=org, recipient_type="vendor")
    client = _client_for(admin)

    response = client.post(
        f"/api/cases/notifications/{obligation.id}/mark-not-required/?organization_id={org.id}"
    )

    assert response.status_code == 200
    assert response.json()["status"] == "not_required"


def test_mark_notified_404s_for_an_obligation_belonging_to_another_org(org_and_users):
    org, admin = org_and_users["org"], org_and_users["admin"]
    other_org = Organization.objects.create(name="Other", slug="other")
    other_case = Case.objects.create(organization=other_org, case_type="breach", title="Other org leak")
    other_obligation = BreachNotificationObligation.objects.create(
        case=other_case, organization=other_org, recipient_type="regulator"
    )
    client = _client_for(admin)

    response = client.post(
        f"/api/cases/notifications/{other_obligation.id}/mark-notified/?organization_id={org.id}"
    )
    assert response.status_code == 404
