from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.authorization import WRITE_ROLES, require_membership
from apps.cases.domain.exceptions import InvalidTransitionError

from .composition import build_case_service
from .serializers import CaseSerializer, ReportCaseRequestSerializer, TransitionCaseRequestSerializer


class CaseListView(APIView):
    """Staff triage queue for both breach and grievance cases. Reads: any org member."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id)

        case_type = request.query_params.get("case_type") or None
        service = build_case_service()
        cases = service.list_cases(organization_id=organization_id, case_type=case_type)
        return Response(CaseSerializer(cases, many=True).data)


class CaseReportView(APIView):
    """
    Staff-reported case — for a breach discovered internally, or a
    grievance logged on a complainant's behalf. The public path for a
    grievance filed directly by a data subject is
    apps.cases.public_views.PublicReportGrievanceView instead.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id, roles=WRITE_ROLES)

        body = ReportCaseRequestSerializer(data=request.data)
        body.is_valid(raise_exception=True)

        service = build_case_service()
        saved = service.report_case(
            organization_id=organization_id, actor=request.user, request=request, **body.validated_data
        )
        return Response(CaseSerializer(saved).data, status=201)


class CaseTransitionView(APIView):
    """Triage action: move a case to its next status. WRITE_ROLES only."""

    permission_classes = [IsAuthenticated]

    def post(self, request, case_id):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id, roles=WRITE_ROLES)

        body = TransitionCaseRequestSerializer(data=request.data)
        body.is_valid(raise_exception=True)

        service = build_case_service()
        try:
            saved = service.transition(
                organization_id=organization_id,
                case_id=case_id,
                actor=request.user,
                request=request,
                target_status=body.validated_data["target_status"],
                note=body.validated_data["note"],
            )
        except LookupError as exc:
            raise NotFound(str(exc)) from exc
        except InvalidTransitionError as exc:
            raise ValidationError({"target_status": str(exc)}) from exc

        return Response(CaseSerializer(saved).data)
