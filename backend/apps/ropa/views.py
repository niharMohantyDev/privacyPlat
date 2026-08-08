from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.authorization import WRITE_ROLES, require_membership
from apps.ropa.domain.exceptions import InvalidTransitionError

from .composition import build_ropa_service
from .serializers import (
    CreateProcessingActivityRequestSerializer,
    ProcessingActivitySerializer,
    TransitionProcessingActivityRequestSerializer,
)


class ProcessingActivityListView(APIView):
    """RoPA register — entirely internal; there's no public submission
    path, unlike Rights/Cases. Reads: any org member."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id)

        status_filter = request.query_params.get("status") or None
        service = build_ropa_service()
        activities = service.list_activities(organization_id=organization_id, status=status_filter)
        return Response(ProcessingActivitySerializer(activities, many=True).data)


class ProcessingActivityCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id, roles=WRITE_ROLES)

        body = CreateProcessingActivityRequestSerializer(data=request.data)
        body.is_valid(raise_exception=True)

        service = build_ropa_service()
        saved = service.create_activity(
            organization_id=organization_id, actor=request.user, request=request, **body.validated_data
        )
        return Response(ProcessingActivitySerializer(saved).data, status=201)


class ProcessingActivityTransitionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, activity_id):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id, roles=WRITE_ROLES)

        body = TransitionProcessingActivityRequestSerializer(data=request.data)
        body.is_valid(raise_exception=True)

        service = build_ropa_service()
        try:
            saved = service.transition(
                organization_id=organization_id,
                activity_id=activity_id,
                actor=request.user,
                request=request,
                target_status=body.validated_data["target_status"],
            )
        except LookupError as exc:
            raise NotFound(str(exc)) from exc
        except InvalidTransitionError as exc:
            raise ValidationError({"target_status": str(exc)}) from exc

        return Response(ProcessingActivitySerializer(saved).data)


class ProcessingActivityMarkReviewedView(APIView):
    """Resets the review clock — a distinct action from transition()
    (mirrors apps.cases's report/transition split): reviewing an entry
    doesn't change its lifecycle status, just its next-due-date."""

    permission_classes = [IsAuthenticated]

    def post(self, request, activity_id):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id, roles=WRITE_ROLES)

        service = build_ropa_service()
        try:
            saved = service.mark_reviewed(
                organization_id=organization_id, activity_id=activity_id, actor=request.user, request=request
            )
        except LookupError as exc:
            raise NotFound(str(exc)) from exc

        return Response(ProcessingActivitySerializer(saved).data)
