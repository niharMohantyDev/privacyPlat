from rest_framework import serializers

from .models import Case


class ReportCaseRequestSerializer(serializers.Serializer):
    case_type = serializers.ChoiceField(choices=Case.CaseType.choices)
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True, required=False, default="")
    reported_by = serializers.CharField(max_length=255, allow_blank=True, required=False, default="")
    region = serializers.CharField(max_length=16, allow_blank=True, required=False, default="")
    severity = serializers.ChoiceField(
        choices=Case.Severity.choices, required=False, allow_blank=True, default=""
    )


class PublicReportGrievanceRequestSerializer(serializers.Serializer):
    """
    Public grievance submission is always case_type='grievance' — an
    anonymous visitor cannot file an internal breach report, that's a
    staff-only action via ReportCaseRequestSerializer.
    """

    public_key = serializers.CharField(max_length=64)
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True, required=False, default="")
    reported_by = serializers.CharField(max_length=255)
    region = serializers.CharField(max_length=16, allow_blank=True, required=False, default="")


class TransitionCaseRequestSerializer(serializers.Serializer):
    target_status = serializers.ChoiceField(choices=Case.Status.choices)
    note = serializers.CharField(required=False, allow_blank=True, default="")


class CaseSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    case_type = serializers.CharField()
    status = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField()
    reported_by = serializers.CharField()
    region = serializers.CharField()
    severity = serializers.CharField()
    reported_at = serializers.DateTimeField()
    due_at = serializers.DateTimeField(allow_null=True)
    resolved_at = serializers.DateTimeField(allow_null=True)
    notes = serializers.CharField()
