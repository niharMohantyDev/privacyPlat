"""
Unauthenticated consent endpoints for the embeddable browser SDK.

These exist because the primary Consent use case — an anonymous website
visitor's browser recording a cookie-banner decision — cannot carry a
platform JWT. Identification is by Asset.public_key (a non-secret site
key, see apps.core.models.generate_asset_public_key), and the defense
against abuse is throttling + is_active revocation, not key secrecy.

Notice this required zero changes to ConsentService, the repository,
the region strategies, or the receipt factory — only a new thin
controller. That's the payoff of the service depending on interfaces
rather than on "how the caller authenticated."
"""

from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from apps.core.models import Asset

from .composition import build_consent_service
from .models import Purpose
from .serializers import ConsentReceiptSerializer, PublicRecordConsentRequestSerializer


def _resolve_asset(public_key: str | None) -> Asset:
    if not public_key:
        raise ValidationError({"public_key": "This field is required."})
    try:
        return Asset.objects.select_related("workspace").get(
            public_key=public_key, is_active=True
        )
    except Asset.DoesNotExist as exc:
        raise NotFound("Invalid or inactive public_key.") from exc


class PublicPurposeListView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "consent_public"

    def get(self, request):
        asset = _resolve_asset(request.query_params.get("public_key"))
        purposes = Purpose.objects.filter(
            organization_id=asset.workspace.organization_id
        ).values("code", "name", "description", "is_essential")
        return Response(list(purposes))


class PublicRecordConsentView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "consent_public"

    def post(self, request):
        body = PublicRecordConsentRequestSerializer(data=request.data)
        body.is_valid(raise_exception=True)
        data = dict(body.validated_data)
        public_key = data.pop("public_key")

        asset = _resolve_asset(public_key)

        service = build_consent_service()
        receipt = service.record_consent(
            organization_id=asset.workspace.organization_id,
            asset_id=asset.id,
            actor=None,
            request=request,
            **data,
        )
        return Response(ConsentReceiptSerializer(receipt).data, status=201)
