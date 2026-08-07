from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.authorization import WRITE_ROLES, require_membership
from apps.rights.domain.exceptions import InvalidTransitionError

from .composition import build_dsar_service
from .serializers import (
    DSARRequestSerializer,
    SubmitDSARRequestSerializer,
    TransitionRequestSerializer,
)


class DSARRequestListView(APIView):
    """Staff triage queue. Reads: any org member."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id)

        service = build_dsar_service()
        requests = service.list_requests(organization_id=organization_id)
        return Response(DSARRequestSerializer(requests, many=True).data)


class DSARRequestSubmitView(APIView):
    """
    Platform-authenticated submission — for staff logging a request
    received through another channel (phone/email). The primary path is
    the public one: apps.rights.public_views.PublicDSARRequestSubmitView.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id, roles=WRITE_ROLES)

        body = SubmitDSARRequestSerializer(data=request.data)
        body.is_valid(raise_exception=True)

        service = build_dsar_service()
        saved = service.submit_request(
            organization_id=organization_id, actor=request.user, request=request, **body.validated_data
        )
        return Response(DSARRequestSerializer(saved).data, status=201)


class DSARRequestTransitionView(APIView):
    """Triage action: move a request to its next status. WRITE_ROLES only."""

    permission_classes = [IsAuthenticated]

    def post(self, request, request_id):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id, roles=WRITE_ROLES)

        body = TransitionRequestSerializer(data=request.data)
        body.is_valid(raise_exception=True)

        service = build_dsar_service()
        try:
            saved = service.transition(
                organization_id=organization_id,
                request_id=request_id,
                actor=request.user,
                request=request,
                target_status=body.validated_data["target_status"],
                note=body.validated_data["note"],
            )
        except LookupError as exc:
            raise NotFound(str(exc)) from exc
        except InvalidTransitionError as exc:
            raise ValidationError({"target_status": str(exc)}) from exc

        return Response(DSARRequestSerializer(saved).data)
