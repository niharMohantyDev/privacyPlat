from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.authorization import require_membership

from .composition import build_dashboard_service
from .serializers import ComplianceDashboardSummarySerializer


class DashboardSummaryView(APIView):
    """Executive rollup across Consent/Rights/Cases. Read-only — any org member."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        organization_id = request.query_params.get("organization_id")
        if not organization_id:
            raise ValidationError({"organization_id": "This query parameter is required."})
        require_membership(request.user, organization_id)

        service = build_dashboard_service()
        summary = service.get_summary(organization_id)
        return Response(ComplianceDashboardSummarySerializer(summary).data)
