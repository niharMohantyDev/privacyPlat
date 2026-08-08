import pytest
from rest_framework.test import APIClient

from apps.core.models import Asset, Organization, Workspace
from apps.cases.models import Case


@pytest.fixture
def asset(db):
    org = Organization.objects.create(name="Acme", slug="acme")
    workspace = Workspace.objects.create(organization=org, name="Site", slug="site")
    return Asset.objects.create(workspace=workspace, asset_type=Asset.AssetType.WEBSITE, name="acme.com")


def test_public_submit_creates_a_grievance_attributed_to_the_right_org(asset):
    client = APIClient()
    response = client.post(
        "/api/public/grievances/",
        {
            "public_key": asset.public_key,
            "title": "Unwanted marketing emails",
            "reported_by": "alice@example.com",
            "region": "IN",
        },
        format="json",
    )
    assert response.status_code == 201
    body = response.json()
    assert body["status"] == "reported"
    assert body["case_type"] == "grievance"

    record = Case.objects.get(id=body["id"])
    assert record.organization_id == asset.workspace.organization_id


def test_public_submit_rejects_unknown_key(db):
    client = APIClient()
    response = client.post(
        "/api/public/grievances/",
        {"public_key": "does-not-exist", "title": "Unwanted marketing emails", "reported_by": "alice@example.com"},
        format="json",
    )
    assert response.status_code == 404


def test_public_submit_rejects_inactive_asset(asset):
    asset.is_active = False
    asset.save(update_fields=["is_active"])

    client = APIClient()
    response = client.post(
        "/api/public/grievances/",
        {
            "public_key": asset.public_key,
            "title": "Unwanted marketing emails",
            "reported_by": "alice@example.com",
        },
        format="json",
    )
    assert response.status_code == 404


def test_public_submit_cannot_be_used_to_file_a_breach(asset):
    """The public serializer has no case_type field at all — this
    documents that a breach can never be reported through this path,
    even if a client tries to smuggle the field in."""
    client = APIClient()
    response = client.post(
        "/api/public/grievances/",
        {
            "public_key": asset.public_key,
            "title": "Trying to file a breach",
            "reported_by": "alice@example.com",
            "case_type": "breach",
        },
        format="json",
    )
    assert response.status_code == 201
    assert response.json()["case_type"] == "grievance"
