import pytest
from rest_framework.test import APIClient

from apps.core.models import Asset, Organization, Workspace
from apps.rights.models import DSARRequest


@pytest.fixture
def asset(db):
    org = Organization.objects.create(name="Acme", slug="acme")
    workspace = Workspace.objects.create(organization=org, name="Site", slug="site")
    return Asset.objects.create(workspace=workspace, asset_type=Asset.AssetType.WEBSITE, name="acme.com")


def test_public_submit_creates_a_request_attributed_to_the_right_org(asset):
    client = APIClient()
    response = client.post(
        "/api/rights/public/requests/",
        {
            "public_key": asset.public_key,
            "subject_key": "alice@example.com",
            "request_type": "deletion",
            "region": "DE",
        },
        format="json",
    )
    assert response.status_code == 201
    body = response.json()
    assert body["status"] == "submitted"

    record = DSARRequest.objects.get(id=body["id"])
    assert record.organization_id == asset.workspace.organization_id


def test_public_submit_rejects_unknown_key(db):
    client = APIClient()
    response = client.post(
        "/api/rights/public/requests/",
        {
            "public_key": "does-not-exist",
            "subject_key": "alice@example.com",
            "request_type": "deletion",
            "region": "DE",
        },
        format="json",
    )
    assert response.status_code == 404


def test_public_submit_rejects_inactive_asset(asset):
    asset.is_active = False
    asset.save(update_fields=["is_active"])

    client = APIClient()
    response = client.post(
        "/api/rights/public/requests/",
        {
            "public_key": asset.public_key,
            "subject_key": "alice@example.com",
            "request_type": "access",
            "region": "DE",
        },
        format="json",
    )
    assert response.status_code == 404
