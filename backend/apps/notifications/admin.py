from django.contrib import admin

from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["event_type", "channel", "recipient", "status", "attempts", "created_at"]
    list_filter = ["channel", "status"]
    search_fields = ["recipient", "event_type"]
