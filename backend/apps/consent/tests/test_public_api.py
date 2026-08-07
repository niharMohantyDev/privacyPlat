import pytest
from rest_framework.test import APIClient

from apps.consent.models import ConsentRecord, Purpose
from apps.core.models import Asset, Organization, Workspace


@pytest.fixture
def asset_with_purposes(db):
    org = Organization.objects.create(name="Acme", slug="acme")
    workspace = Workspace.objects.create(organization=org, name="Marketing Site", slug="site")
    asset = Asset.objects.create(workspace=workspace, asset_type=Asset.AssetType.WEBSITE, name="acme.com")
    Purpose.objects.create(organization=org, code="security", name="Security", is_essential=True)
    Purpose.objects.create(organization=org, code="analytics", name="Analytics", is_essential=False)
    return asset


def test_public_purposes_lists_the_assets_org_purposes(asset_with_purposes):
    client = APIClient()
    response = client.get(f"/api/consent/public/purposes/?public_key={asset_with_purposes.public_key}")
    assert response.status_code == 200
    codes = {p["code"] for p in response.json()}
    assert codes == {"security", "analytics"}


def test_public_purposes_rejects_unknown_key(db):
    client = APIClient()
    response = client.get("/api/consent/public/purposes/?public_key=does-not-exist")
    assert response.status_code == 404


def test_public_purposes_rejects_missing_key():
    client = APIClient()
    response = client.get("/api/consent/public/purposes/")
    assert response.status_code == 400


def test_public_record_consent_succeeds_and_is_attributed_to_the_correct_asset(asset_with_purposes):
    client = APIClient()
    response = client.post(
        "/api/consent/public/records/",
        {
            "public_key": asset_with_purposes.public_key,
            "subject_key": "visitor-1",
            "region": "DE",
            "decisions": {"analytics": True},
        },
        format="json",
    )
    assert response.status_code == 201
    body = response.json()
    assert body["framework"] == "GDPR"

    record = ConsentRecord.objects.get(id=body["record_id"])
    assert record.asset_id == asset_with_purposes.id
    assert record.organization_id == asset_with_purposes.workspace.organization_id


def test_public_record_consent_rejects_inactive_asset(asset_with_purposes):
    asset_with_purposes.is_active = False
    asset_with_purposes.save(update_fields=["is_active"])

    client = APIClient()
    response = client.post(
        "/api/consent/public/records/",
        {
            "public_key": asset_with_purposes.public_key,
            "subject_key": "visitor-2",
            "region": "DE",
        },
        format="json",
    )
    assert response.status_code == 404


def test_public_record_consent_ignores_client_supplied_asset_id(asset_with_purposes):
    """
    PublicRecordConsentRequestSerializer has no asset_id field at all, so
    even if a caller stuffs one into the body it's simply not read — the
    asset always comes from public_key resolution.
    """
    other_workspace = Workspace.objects.create(
        organization=asset_with_purposes.workspace.organization, name="Other", slug="other"
    )
    other_asset = Asset.objects.create(
        workspace=other_workspace, asset_type=Asset.AssetType.WEBSITE, name="other.com"
    )

    client = APIClient()
    response = client.post(
        "/api/consent/public/records/",
        {
            "public_key": asset_with_purposes.public_key,
            "asset_id": str(other_asset.id),
            "subject_key": "visitor-3",
            "region": "DE",
        },
        format="json",
    )
    assert response.status_code == 201
    record = ConsentRecord.objects.get(id=response.json()["record_id"])
    assert record.asset_id == asset_with_purposes.id
