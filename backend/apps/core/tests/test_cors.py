import pytest
from rest_framework.test import APIClient

from apps.core.models import Asset, Organization, Workspace


@pytest.fixture
def asset(db):
    org = Organization.objects.create(name="Acme", slug="acme")
    workspace = Workspace.objects.create(organization=org, name="Site", slug="site")
    return Asset.objects.create(workspace=workspace, asset_type=Asset.AssetType.WEBSITE, name="acme.com")


def test_public_consent_endpoint_reflects_arbitrary_origin(asset):
    """
    The whole point of the public consent endpoint is that it's called
    from a customer's own website — an origin we can't know in advance —
    so it must not be restricted to the fixed CORS_ALLOWED_ORIGINS list
    used by the authenticated platform API.
    """
    client = APIClient()
    response = client.get(
        f"/api/consent/public/purposes/?public_key={asset.public_key}",
        HTTP_ORIGIN="https://some-random-customer-site.com",
    )
    assert response.status_code == 200
    assert response["Access-Control-Allow-Origin"] == "https://some-random-customer-site.com"


def test_public_rights_endpoint_reflects_arbitrary_origin(asset):
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
        HTTP_ORIGIN="https://another-customer-site.com",
    )
    assert response.status_code == 201
    assert response["Access-Control-Allow-Origin"] == "https://another-customer-site.com"


def test_authenticated_platform_api_is_unaffected(db):
    """
    The authenticated API keeps django-cors-headers' strict, fixed-origin
    policy — PublicEndpointCorsMiddleware must not widen it.
    """
    client = APIClient()
    response = client.get("/healthz", HTTP_ORIGIN="https://some-random-customer-site.com")
    assert response.status_code == 200
    assert "Access-Control-Allow-Origin" not in response
