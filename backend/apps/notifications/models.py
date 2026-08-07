from django.db import models

from apps.core.models import BaseModel, Organization


class Notification(BaseModel):
    """A single email or webhook dispatch, with retry bookkeeping."""

    class Channel(models.TextChoices):
        EMAIL = "email", "Email"
        WEBHOOK = "webhook", "Webhook"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SENT = "sent", "Sent"
        FAILED = "failed", "Failed"

    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="notifications"
    )
    channel = models.CharField(max_length=16, choices=Channel.choices)
    recipient = models.CharField(
        max_length=512, help_text="Email address, or webhook URL."
    )
    event_type = models.CharField(
        max_length=128, help_text="e.g. 'consent.given', 'request.sla_breached'."
    )
    payload = models.JSONField(default=dict, blank=True)
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.PENDING
    )
    attempts = models.PositiveSmallIntegerField(default=0)
    last_error = models.TextField(blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["organization", "status"]),
            models.Index(fields=["event_type"]),
        ]

    def __str__(self):
        return f"{self.channel}:{self.event_type} -> {self.recipient} ({self.status})"
