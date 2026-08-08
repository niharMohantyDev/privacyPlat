from django.contrib import admin

from .models import DSARRequest


@admin.register(DSARRequest)
class DSARRequestAdmin(admin.ModelAdmin):
    list_display = ["subject_key", "organization", "request_type", "status", "due_at", "created_at"]
    list_filter = ["organization", "request_type", "status"]
    search_fields = ["subject_key"]
    readonly_fields = ["id", "created_at", "updated_at"]
