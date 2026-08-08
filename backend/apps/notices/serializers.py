from rest_framework import serializers

from .models import PrivacyNotice


class CreateNoticeDraftRequestSerializer(serializers.Serializer):
    notice_type = serializers.ChoiceField(choices=PrivacyNotice.NoticeType.choices)
    title = serializers.CharField(max_length=255)
    body = serializers.CharField(allow_blank=True, required=False, default="")
    change_summary = serializers.CharField(allow_blank=True, required=False, default="")


class PrivacyNoticeSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    notice_type = serializers.CharField()
    title = serializers.CharField()
    body = serializers.CharField()
    version = serializers.IntegerField()
    status = serializers.CharField()
    change_summary = serializers.CharField()
    published_at = serializers.DateTimeField(allow_null=True)
    review_due_at = serializers.DateTimeField(allow_null=True)


class PublicNoticeSerializer(serializers.Serializer):
    """Deliberately narrower than PrivacyNoticeSerializer — an anonymous
    visitor gets the published text, not internal fields like change_summary
    or review_due_at."""

    notice_type = serializers.CharField()
    title = serializers.CharField()
    body = serializers.CharField()
    version = serializers.IntegerField()
    published_at = serializers.DateTimeField(allow_null=True)
