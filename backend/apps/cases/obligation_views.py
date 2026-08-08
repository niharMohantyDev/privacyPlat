from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.authorization import WRITE_ROLES, require_membership

from .composition import build_obligation_service
from .domain.exceptions import InvalidTransitionError
from .serializers import (
    BreachNotificationObligationSerializer,
    CreateObligationRequestSerializer,
    MarkObligationRequestSerializer,
)


class ObligationListView(APIView):
    """A breach case's notification checklist. Reads: any org member."""

    permission_classes = [IsAuthenticated]

    def get(self, request, case_id):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id)

        service = build_obligation_service()
        obligations = service.list_for_case(organization_id=organization_id, case_id=case_id)
        return Response(BreachNotificationObligationSerializer(obligations, many=True).data)


class ObligationCreateView(APIView):
    """Add a recipient to a breach's notification checklist — e.g. a
    vendor, or an extra regulator for a multi-jurisdiction breach. The
    two standard entries (regulator, data subjects) are already seeded
    automatically when the breach is reported; see DjangoBreachObligationSeeder."""

    permission_classes = [IsAuthenticated]

    def post(self, request, case_id):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id, roles=WRITE_ROLES)

        body = CreateObligationRequestSerializer(data=request.data)
        body.is_valid(raise_exception=True)

        service = build_obligation_service()
        try:
            saved = service.create_obligation(
                organization_id=organization_id,
                case_id=case_id,
                actor=request.user,
                request=request,
                **body.validated_data,
            )
        except LookupError as exc:
            raise NotFound(str(exc)) from exc
        except ValueError as exc:
            raise ValidationError({"case_id": str(exc)}) from exc

        return Response(BreachNotificationObligationSerializer(saved).data, status=201)


class ObligationMarkNotifiedView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, obligation_id):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id, roles=WRITE_ROLES)

        body = MarkObligationRequestSerializer(data=request.data)
        body.is_valid(raise_exception=True)

        service = build_obligation_service()
        try:
            saved = service.mark_notified(
                organization_id=organization_id,
                obligation_id=obligation_id,
                actor=request.user,
                request=request,
                **body.validated_data,
            )
        except LookupError as exc:
            raise NotFound(str(exc)) from exc
        except InvalidTransitionError as exc:
            raise ValidationError({"status": str(exc)}) from exc

        return Response(BreachNotificationObligationSerializer(saved).data)


class ObligationMarkNotRequiredView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, obligation_id):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id, roles=WRITE_ROLES)

        body = MarkObligationRequestSerializer(data=request.data)
        body.is_valid(raise_exception=True)

        service = build_obligation_service()
        try:
            saved = service.mark_not_required(
                organization_id=organization_id,
                obligation_id=obligation_id,
                actor=request.user,
                request=request,
                **body.validated_data,
            )
        except LookupError as exc:
            raise NotFound(str(exc)) from exc
        except InvalidTransitionError as exc:
            raise ValidationError({"status": str(exc)}) from exc

        return Response(BreachNotificationObligationSerializer(saved).data)
