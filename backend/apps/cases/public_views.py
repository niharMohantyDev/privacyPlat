"""Unauthenticated grievance submission — a complainant filing a
grievance is not a platform user (same reasoning as
apps.rights.public_views for DSAR submission). Breach cases have no
public submission path: a breach is always staff-reported."""

from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from apps.core.models import Asset

from .composition import build_case_service
from .models import Case
from .serializers import CaseSerializer, PublicReportGrievanceRequestSerializer


def _resolve_asset(public_key):
    if not public_key:
        raise ValidationError({"public_key": "This field is required."})
    try:
        return Asset.objects.select_related("workspace").get(public_key=public_key, is_active=True)
    except Asset.DoesNotExist as exc:
        raise NotFound("Invalid or inactive public_key.") from exc


class PublicReportGrievanceView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "cases_public"

    def post(self, request):
        body = PublicReportGrievanceRequestSerializer(data=request.data)
        body.is_valid(raise_exception=True)
        data = dict(body.validated_data)
        public_key = data.pop("public_key")

        asset = _resolve_asset(public_key)

        service = build_case_service()
        saved = service.report_case(
            organization_id=asset.workspace.organization_id,
            case_type=Case.CaseType.GRIEVANCE,
            actor=None,
            request=request,
            **data,
        )
        return Response(CaseSerializer(saved).data, status=201)
