from django.db import models

from apps.core.models import BaseModel, Organization, User


class AuditEvent(BaseModel):
    """
    Append-only record of who did what, to what, and when.

    Every other module (Consent, DSAR, RoPA, Breach, the Prove-pillar
    dashboards) reads from this instead of maintaining its own history.
    """

    organization = models.ForeignKey(
        Organization,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_events",
    )
    actor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_events",
        help_text="Null for system-initiated events (scheduled jobs, webhooks).",
    )
    action = models.CharField(
        max_length=128,
        help_text="Dotted event name, e.g. 'consent.given', 'organization.created'.",
    )
    entity_type = models.CharField(max_length=128)
    entity_id = models.CharField(max_length=64)
    metadata = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=512, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["organization", "-created_at"]),
            models.Index(fields=["entity_type", "entity_id"]),
            models.Index(fields=["action"]),
        ]

    def save(self, *args, **kwargs):
        # Audit events are insert-only: block any attempt to modify a
        # record after creation rather than relying on callers never trying.
        if self.pk is not None and not self._state.adding:
            raise ValueError("AuditEvent records are immutable and cannot be updated.")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValueError("AuditEvent records are immutable and cannot be deleted.")

    def __str__(self):
        return f"{self.action} on {self.entity_type}:{self.entity_id}"
