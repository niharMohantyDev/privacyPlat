from rest_framework import serializers


class RecordConsentRequestSerializer(serializers.Serializer):
    asset_id = serializers.UUIDField(required=False, allow_null=True, default=None)
    subject_key = serializers.CharField(max_length=255)
    region = serializers.CharField(max_length=16)
    decisions = serializers.DictField(
        child=serializers.BooleanField(), default=dict, required=False
    )


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
