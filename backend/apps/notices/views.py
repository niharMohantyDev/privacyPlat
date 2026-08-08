from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.authorization import WRITE_ROLES, require_membership
from apps.notices.domain.exceptions import InvalidTransitionError

from .composition import build_notice_service
from .serializers import CreateNoticeDraftRequestSerializer, PrivacyNoticeSerializer


class NoticeListView(APIView):
    """The version history for an org's notices. Reads: any org member."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id)

        notice_type = request.query_params.get("notice_type") or None
        status_filter = request.query_params.get("status") or None
        service = build_notice_service()
        notices = service.list_notices(organization_id=organization_id, notice_type=notice_type, status=status_filter)
        return Response(PrivacyNoticeSerializer(notices, many=True).data)


class NoticeCreateDraftView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id, roles=WRITE_ROLES)

        body = CreateNoticeDraftRequestSerializer(data=request.data)
        body.is_valid(raise_exception=True)

        service = build_notice_service()
        saved = service.create_draft(
            organization_id=organization_id, actor=request.user, request=request, **body.validated_data
        )
        return Response(PrivacyNoticeSerializer(saved).data, status=201)


class NoticePublishView(APIView):
    """Publishing supersedes whatever was previously published for the
    same notice_type — see PrivacyNoticeService.publish."""

    permission_classes = [IsAuthenticated]

    def post(self, request, notice_id):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id, roles=WRITE_ROLES)

        service = build_notice_service()
        try:
            saved = service.publish(
                organization_id=organization_id, notice_id=notice_id, actor=request.user, request=request
            )
        except LookupError as exc:
            raise NotFound(str(exc)) from exc
        except InvalidTransitionError as exc:
            raise ValidationError({"status": str(exc)}) from exc

        return Response(PrivacyNoticeSerializer(saved).data)


class NoticeArchiveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, notice_id):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id, roles=WRITE_ROLES)

        service = build_notice_service()
        try:
            saved = service.archive(
                organization_id=organization_id, notice_id=notice_id, actor=request.user, request=request
            )
        except LookupError as exc:
            raise NotFound(str(exc)) from exc
        except InvalidTransitionError as exc:
            raise ValidationError({"status": str(exc)}) from exc

        return Response(PrivacyNoticeSerializer(saved).data)
