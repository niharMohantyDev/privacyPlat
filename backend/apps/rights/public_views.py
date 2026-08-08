"""Unauthenticated DSAR submission — a data subject exercising their
rights is not a platform user (see apps.consent.public_views for the
same reasoning, applied there to consent instead of rights)."""

from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from apps.core.models import Asset

from .composition import build_dsar_service
from .serializers import DSARRequestSerializer, PublicSubmitDSARRequestSerializer


def _resolve_asset(public_key):
    if not public_key:
        raise ValidationError({"public_key": "This field is required."})
    try:
        return Asset.objects.select_related("workspace").get(public_key=public_key, is_active=True)
    except Asset.DoesNotExist as exc:
        raise NotFound("Invalid or inactive public_key.") from exc


class PublicDSARRequestSubmitView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "rights_public"

    def post(self, request):
        body = PublicSubmitDSARRequestSerializer(data=request.data)
        body.is_valid(raise_exception=True)
        data = dict(body.validated_data)
        public_key = data.pop("public_key")

        asset = _resolve_asset(public_key)

        service = build_dsar_service()
        saved = service.submit_request(
            organization_id=asset.workspace.organization_id,
            actor=None,
            request=request,
            **data,
        )
        return Response(DSARRequestSerializer(saved).data, status=201)
