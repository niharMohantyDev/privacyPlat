from rest_framework import serializers


class DSARMetricsSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    open = serializers.IntegerField()
    overdue = serializers.IntegerField()
    resolved_on_time = serializers.IntegerField()
    resolved_late = serializers.IntegerField()
    on_time_rate = serializers.FloatField(allow_null=True)


class CaseMetricsSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    open = serializers.IntegerField()
    overdue = serializers.IntegerField()
    breach_open = serializers.IntegerField()
    grievance_open = serializers.IntegerField()


class ConsentMetricsSerializer(serializers.Serializer):
    total_purposes = serializers.IntegerField()
    total_consent_records = serializers.IntegerField()
    opt_in_rate = serializers.FloatField(allow_null=True)


class ComplianceDashboardSummarySerializer(serializers.Serializer):
    dsar = DSARMetricsSerializer()
    cases = CaseMetricsSerializer()
    consent = ConsentMetricsSerializer()
    generated_at = serializers.DateTimeField()
