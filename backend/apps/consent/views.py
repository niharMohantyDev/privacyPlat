from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.models import OrganizationMembership

from .composition import build_consent_service
from .models import Purpose
from .serializers import (
    ConsentRecordSerializer,
    ConsentReceiptSerializer,
    RecordConsentRequestSerializer,
)


def _ensure_membership(request, organization_id):
    """
    Platform-side authorization: the caller must belong to the org they're
    acting on. NOTE: this only covers platform-authenticated calls (staff
    testing the API, an internal admin UI). The public-facing case — an
    anonymous visitor's browser recording consent on a customer's own
    website via an embeddable script — needs a separate, unauthenticated
    ingestion path keyed by an Asset API key. That's out of scope for this
    milestone and tracked as follow-up, not silently assumed done.
    """
    if not OrganizationMembership.objects.filter(
        organization_id=organization_id, user=request.user
    ).exists():
        raise PermissionDenied("Not a member of this organization.")


class PurposeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        _ensure_membership(request, organization_id)

        purposes = Purpose.objects.filter(organization_id=organization_id).values(
            "id", "code", "name", "description", "is_essential"
        )
        return Response(list(purposes))


class RecordConsentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        _ensure_membership(request, organization_id)

        body = RecordConsentRequestSerializer(data=request.data)
        body.is_valid(raise_exception=True)

        service = build_consent_service()
        receipt = service.record_consent(
            organization_id=organization_id,
            actor=request.user,
            request=request,
            **body.validated_data,
        )
        return Response(ConsentReceiptSerializer(receipt).data, status=201)


class CurrentConsentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        organization_id = request.query_params.get("organization_id")
        subject_key = request.query_params.get("subject_key")
        if not organization_id or not subject_key:
            raise ValidationError(
                {"detail": "organization_id and subject_key query params are required."}
            )
        _ensure_membership(request, organization_id)

        service = build_consent_service()
        record = service.get_current_consent(
            organization_id=organization_id, subject_key=subject_key
        )
        if record is None:
            return Response(status=404)
        return Response(ConsentRecordSerializer(record).data)
