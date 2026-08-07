from django.contrib import admin

from .models import ConsentDecision, ConsentRecord, Purpose


@admin.register(Purpose)
class PurposeAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "organization", "is_essential"]
    list_filter = ["organization", "is_essential"]


class ConsentDecisionInline(admin.TabularInline):
    model = ConsentDecision
    extra = 0
    readonly_fields = ["purpose", "granted"]
    can_delete = False


@admin.register(ConsentRecord)
class ConsentRecordAdmin(admin.ModelAdmin):
    list_display = ["subject_key", "organization", "framework", "version", "created_at"]
    list_filter = ["organization", "framework"]
    search_fields = ["subject_key"]
    inlines = [ConsentDecisionInline]

    def has_change_permission(self, request, obj=None):
        return False
