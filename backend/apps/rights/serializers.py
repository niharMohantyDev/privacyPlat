from rest_framework import serializers

from .models import DSARRequest


class SubmitDSARRequestSerializer(serializers.Serializer):
    subject_key = serializers.CharField(max_length=255)
    request_type = serializers.ChoiceField(choices=DSARRequest.RequestType.choices)
    region = serializers.CharField(max_length=16)


class PublicSubmitDSARRequestSerializer(serializers.Serializer):
    """
    Public submission is keyed by Asset.public_key rather than a raw
    organization_id — same reasoning as apps.consent.public_views: it
    avoids exposing organization ids for enumeration and reuses
    is_active revocation, even though this bounded context doesn't share
    code with Consent.
    """

    public_key = serializers.CharField(max_length=64)
    subject_key = serializers.CharField(max_length=255)
    request_type = serializers.ChoiceField(choices=DSARRequest.RequestType.choices)
    region = serializers.CharField(max_length=16)


class TransitionRequestSerializer(serializers.Serializer):
    target_status = serializers.ChoiceField(choices=DSARRequest.Status.choices)
    note = serializers.CharField(required=False, allow_blank=True, default="")


class DSARRequestSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    subject_key = serializers.CharField()
    request_type = serializers.CharField()
    status = serializers.CharField()
    region = serializers.CharField()
    submitted_at = serializers.DateTimeField()
    due_at = serializers.DateTimeField(allow_null=True)
    resolved_at = serializers.DateTimeField(allow_null=True)
    notes = serializers.CharField()
