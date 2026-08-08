from django.contrib import admin

from .models import PrivacyNotice


@admin.register(PrivacyNotice)
class PrivacyNoticeAdmin(admin.ModelAdmin):
    list_display = ["title", "organization", "notice_type", "version", "status", "published_at"]
    list_filter = ["organization", "notice_type", "status"]
    search_fields = ["title"]
    readonly_fields = ["id", "created_at", "updated_at"]
