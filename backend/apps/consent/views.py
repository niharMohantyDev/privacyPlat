from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.authorization import WRITE_ROLES, require_membership

from .composition import build_consent_service
from .models import Purpose
from .serializers import (
    ConsentRecordSerializer,
    ConsentReceiptSerializer,
    PurposeModelSerializer,
    RecordConsentRequestSerializer,
)


class PurposeViewSet(viewsets.ModelViewSet):
    """Org-scoped purpose taxonomy. Reads: any member. Writes: WRITE_ROLES only."""

    serializer_class = PurposeModelSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Purpose.objects.filter(organization__memberships__user=self.request.user)

    def perform_create(self, serializer):
        organization = serializer.validated_data["organization"]
        require_membership(self.request.user, organization.id, roles=WRITE_ROLES)
        serializer.save()

    def perform_update(self, serializer):
        require_membership(
            self.request.user, serializer.instance.organization_id, roles=WRITE_ROLES
        )
        serializer.save()

    def perform_destroy(self, instance):
        require_membership(self.request.user, instance.organization_id, roles=WRITE_ROLES)
        instance.delete()


class RecordConsentView(APIView):
    """
    Platform-authenticated consent recording — for internal tooling/admin
    use and testing. The public-facing path (an anonymous website
    visitor's browser, via the embeddable script) is
    apps.consent.public_views.PublicRecordConsentView instead, since it
    can't carry a platform JWT.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id)

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
        require_membership(request.user, organization_id)

        service = build_consent_service()
        record = service.get_current_consent(
            organization_id=organization_id, subject_key=subject_key
        )
        if record is None:
            return Response(status=404)
        return Response(ConsentRecordSerializer(record).data)


class ConsentRecordListView(APIView):
    """
    The consent log — every recorded decision for the org, newest first.
    Unpaginated, same as DSARRequestListView; acceptable now, a known
    scale limitation to revisit once a real org accumulates volume.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id)

        service = build_consent_service()
        records = service.list_records(organization_id=organization_id)
        return Response(ConsentRecordSerializer(records, many=True).data)
