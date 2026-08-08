from django.db import models

from apps.core.models import BaseModel, Organization


class DSARRequest(BaseModel):
    """
    A data-subject rights request. `status` values and their legal
    transitions are defined in apps.rights.domain.states — this model
    only stores the current status code, it does not enforce transition
    rules (that's DSARService's job, via the State pattern).
    """

    class RequestType(models.TextChoices):
        ACCESS = "access", "Access"
        CORRECTION = "correction", "Correction"
        DELETION = "deletion", "Deletion"
        PORTABILITY = "portability", "Portability"
        RESTRICTION = "restriction", "Restriction / Opt-out"
        CONSENT_WITHDRAWAL = "consent_withdrawal", "Consent Withdrawal"
        PROCESSING_INFO = "processing_info", "Information About Processing"

    class Status(models.TextChoices):
        SUBMITTED = "submitted", "Submitted"
        IDENTITY_VERIFICATION = "identity_verification", "Identity Verification"
        IN_PROGRESS = "in_progress", "In Progress"
        PENDING_REVIEW = "pending_review", "Pending Review"
        COMPLETED = "completed", "Completed"
        REJECTED = "rejected", "Rejected"
        WITHDRAWN = "withdrawn", "Withdrawn"

    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="dsar_requests"
    )
    subject_key = models.CharField(
        max_length=255, help_text="Verified subject identifier (typically an email)."
    )
    request_type = models.CharField(max_length=32, choices=RequestType.choices)
    status = models.CharField(max_length=32, choices=Status.choices, default=Status.SUBMITTED)
    region = models.CharField(max_length=16)
    due_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["due_at"]
        indexes = [
            models.Index(fields=["organization", "status"]),
            models.Index(fields=["organization", "subject_key"]),
        ]

    def __str__(self):
        return f"{self.request_type}:{self.subject_key} ({self.status})"
