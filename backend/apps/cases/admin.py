from django.contrib import admin

from .models import BreachNotificationObligation, Case


@admin.register(Case)
class CaseAdmin(admin.ModelAdmin):
    list_display = ["title", "organization", "case_type", "status", "severity", "due_at", "created_at"]
    list_filter = ["organization", "case_type", "status", "severity"]
    search_fields = ["title", "reported_by"]
    readonly_fields = ["id", "created_at", "updated_at"]


@admin.register(BreachNotificationObligation)
class BreachNotificationObligationAdmin(admin.ModelAdmin):
    list_display = ["case", "recipient_type", "status", "due_at", "notified_at"]
    list_filter = ["organization", "recipient_type", "status"]
    readonly_fields = ["id", "created_at", "updated_at"]
