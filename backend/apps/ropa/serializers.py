from rest_framework import serializers

from .models import ProcessingActivity


class CreateProcessingActivityRequestSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    legal_basis = serializers.ChoiceField(choices=ProcessingActivity.LegalBasis.choices)
    risk_level = serializers.ChoiceField(
        choices=ProcessingActivity.RiskLevel.choices, required=False, default=ProcessingActivity.RiskLevel.MEDIUM
    )
    description = serializers.CharField(allow_blank=True, required=False, default="")
    data_categories = serializers.CharField(allow_blank=True, required=False, default="")
    data_subject_categories = serializers.CharField(allow_blank=True, required=False, default="")
    recipients = serializers.CharField(allow_blank=True, required=False, default="")
    retention_period = serializers.CharField(max_length=255, allow_blank=True, required=False, default="")
    security_measures = serializers.CharField(allow_blank=True, required=False, default="")
    owner = serializers.CharField(max_length=255, allow_blank=True, required=False, default="")
    third_country_transfer = serializers.BooleanField(required=False, default=False)
    transfer_safeguards = serializers.CharField(max_length=255, allow_blank=True, required=False, default="")
    purpose_id = serializers.UUIDField(required=False, allow_null=True, default=None)
    workspace_id = serializers.UUIDField(required=False, allow_null=True, default=None)


class TransitionProcessingActivityRequestSerializer(serializers.Serializer):
    target_status = serializers.ChoiceField(choices=ProcessingActivity.Status.choices)


class ProcessingActivitySerializer(serializers.Serializer):
    id = serializers.UUIDField()
    title = serializers.CharField()
    description = serializers.CharField()
    legal_basis = serializers.CharField()
    risk_level = serializers.CharField()
    status = serializers.CharField()
    data_categories = serializers.CharField()
    data_subject_categories = serializers.CharField()
    recipients = serializers.CharField()
    retention_period = serializers.CharField()
    security_measures = serializers.CharField()
    owner = serializers.CharField()
    third_country_transfer = serializers.BooleanField()
    transfer_safeguards = serializers.CharField()
    purpose_id = serializers.UUIDField(allow_null=True)
    workspace_id = serializers.UUIDField(allow_null=True)
    review_due_at = serializers.DateTimeField(allow_null=True)
    reviewed_at = serializers.DateTimeField(allow_null=True)
