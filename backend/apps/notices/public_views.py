"""Unauthenticated notice fetch — a visitor reading a customer's
privacy policy is not a platform user (same reasoning as
apps.rights.public_views for DSAR submission)."""

from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from apps.core.models import Asset

from .composition import build_notice_service
from .serializers import PublicNoticeSerializer


def _resolve_asset(public_key):
    if not public_key:
        raise ValidationError({"public_key": "This field is required."})
    try:
        return Asset.objects.select_related("workspace").get(public_key=public_key, is_active=True)
    except Asset.DoesNotExist as exc:
        raise NotFound("Invalid or inactive public_key.") from exc


class PublicNoticeView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "notices_public"

    def get(self, request, notice_type):
        public_key = request.query_params.get("public_key")
        asset = _resolve_asset(public_key)

        service = build_notice_service()
        try:
            notice = service.get_published(
                organization_id=asset.workspace.organization_id, notice_type=notice_type
            )
        except LookupError as exc:
            raise NotFound(str(exc)) from exc

        return Response(PublicNoticeSerializer(notice).data)
