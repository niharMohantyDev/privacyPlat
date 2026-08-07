from rest_framework import serializers

from .models import Purpose


class RecordConsentRequestSerializer(serializers.Serializer):
    asset_id = serializers.UUIDField(required=False, allow_null=True, default=None)
    subject_key = serializers.CharField(max_length=255)
    region = serializers.CharField(max_length=16)
    decisions = serializers.DictField(
        child=serializers.BooleanField(), default=dict, required=False
    )


class PublicRecordConsentRequestSerializer(serializers.Serializer):
    """
    Same shape as RecordConsentRequestSerializer minus asset_id: on the
    public endpoint the asset is derived from public_key, never taken
    from the request body — otherwise a caller could attribute a consent
    record to a different asset than the one their key actually belongs
    to.
    """

    public_key = serializers.CharField(max_length=64)
    subject_key = serializers.CharField(max_length=255)
    region = serializers.CharField(max_length=16)
    decisions = serializers.DictField(
        child=serializers.BooleanField(), default=dict, required=False
    )


class PurposeModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purpose
        fields = ["id", "organization", "code", "name", "description", "is_essential", "created_at"]
        read_only_fields = ["id", "created_at"]


class ConsentDecisionSerializer(serializers.Serializer):
    purpose_code = serializers.CharField()
    granted = serializers.BooleanField()


class ConsentReceiptSerializer(serializers.Serializer):
    record_id = serializers.UUIDField()
    subject_key = serializers.CharField()
    region = serializers.CharField()
    framework = serializers.CharField()
    version = serializers.IntegerField()
    decisions = ConsentDecisionSerializer(many=True)
    issued_at = serializers.DateTimeField()
    signature = serializers.CharField()


class ConsentRecordSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    subject_key = serializers.CharField()
    region = serializers.CharField()
    framework = serializers.CharField()
    version = serializers.IntegerField()
    decisions = ConsentDecisionSerializer(many=True)
    created_at = serializers.DateTimeField()
