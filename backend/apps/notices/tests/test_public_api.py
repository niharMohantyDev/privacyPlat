import pytest
from rest_framework.test import APIClient

from apps.core.models import Asset, Organization, Workspace
from apps.notices.models import PrivacyNotice


@pytest.fixture
def asset(db):
    org = Organization.objects.create(name="Acme", slug="acme")
    workspace = Workspace.objects.create(organization=org, name="Site", slug="site")
    return Asset.objects.create(workspace=workspace, asset_type=Asset.AssetType.WEBSITE, name="acme.com")


def test_public_fetch_returns_the_published_notice(asset):
    PrivacyNotice.objects.create(
        organization=asset.workspace.organization,
        notice_type="privacy_policy",
        title="Privacy Policy",
        body="We respect your privacy.",
        version=1,
        status=PrivacyNotice.Status.PUBLISHED,
    )

    client = APIClient()
    response = client.get(f"/api/public/notices/privacy_policy/?public_key={asset.public_key}")

    assert response.status_code == 200
    body = response.json()
    assert body["title"] == "Privacy Policy"
    assert body["body"] == "We respect your privacy."
    # internal-only fields shouldn't leak to an anonymous visitor
    assert "review_due_at" not in body
    assert "change_summary" not in body


def test_public_fetch_returns_the_latest_published_version_not_an_older_one(asset):
    org = asset.workspace.organization
    PrivacyNotice.objects.create(
        organization=org, notice_type="privacy_policy", title="Old", version=1,
        status=PrivacyNotice.Status.ARCHIVED,
    )
    PrivacyNotice.objects.create(
        organization=org, notice_type="privacy_policy", title="New", version=2,
        status=PrivacyNotice.Status.PUBLISHED,
    )

    client = APIClient()
    response = client.get(f"/api/public/notices/privacy_policy/?public_key={asset.public_key}")

    assert response.json()["title"] == "New"
    assert response.json()["version"] == 2


def test_public_fetch_404s_when_nothing_published(asset):
    client = APIClient()
    response = client.get(f"/api/public/notices/privacy_policy/?public_key={asset.public_key}")
    assert response.status_code == 404


def test_public_fetch_rejects_unknown_key(db):
    client = APIClient()
    response = client.get("/api/public/notices/privacy_policy/?public_key=does-not-exist")
    assert response.status_code == 404


def test_public_fetch_rejects_inactive_asset(asset):
    asset.is_active = False
    asset.save(update_fields=["is_active"])

    client = APIClient()
    response = client.get(f"/api/public/notices/privacy_policy/?public_key={asset.public_key}")
    assert response.status_code == 404
