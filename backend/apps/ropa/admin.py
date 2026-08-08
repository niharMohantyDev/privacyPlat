from django.contrib import admin

from .models import ProcessingActivity


@admin.register(ProcessingActivity)
class ProcessingActivityAdmin(admin.ModelAdmin):
    list_display = ["title", "organization", "legal_basis", "risk_level", "status", "review_due_at"]
    list_filter = ["organization", "legal_basis", "risk_level", "status"]
    search_fields = ["title", "owner"]
    readonly_fields = ["id", "created_at", "updated_at"]
