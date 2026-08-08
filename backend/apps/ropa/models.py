from django.db import models

from apps.consent.models import Purpose
from apps.core.models import BaseModel, Organization, Workspace


class ProcessingActivity(BaseModel):
    """
    One Article 30 Record of Processing Activities entry. `status`
    values and their legal transitions live in apps.ropa.domain.states;
    this model only stores the current status code, it does not enforce
    transition rules (that's ProcessingActivityService's job, via the
    State pattern — same convention as apps.cases.models.Case).
    """

    class LegalBasis(models.TextChoices):
        CONSENT = "consent", "Consent"
        CONTRACT = "contract", "Contract"
        LEGAL_OBLIGATION = "legal_obligation", "Legal Obligation"
        VITAL_INTERESTS = "vital_interests", "Vital Interests"
        PUBLIC_TASK = "public_task", "Public Task"
        LEGITIMATE_INTERESTS = "legitimate_interests", "Legitimate Interests"

    class RiskLevel(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        ACTIVE = "active", "Active"
        ARCHIVED = "archived", "Archived"

    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="processing_activities"
    )
    # Optional links into the existing model graph: a RoPA entry may
    # trace back to a consent Purpose (if the processing is consent-
    # driven) and/or a Workspace (which system performs it) — but stands
    # on its own otherwise, since not all processing is consent-based
    # (e.g. payroll runs on "contract"/"legal_obligation", not consent).
    purpose = models.ForeignKey(
        Purpose, on_delete=models.SET_NULL, null=True, blank=True, related_name="processing_activities"
    )
    workspace = models.ForeignKey(
        Workspace, on_delete=models.SET_NULL, null=True, blank=True, related_name="processing_activities"
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    legal_basis = models.CharField(max_length=32, choices=LegalBasis.choices)
    risk_level = models.CharField(max_length=16, choices=RiskLevel.choices, default=RiskLevel.MEDIUM)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.DRAFT)

    data_categories = models.TextField(blank=True, help_text="e.g. contact info, financial, health.")
    data_subject_categories = models.TextField(blank=True, help_text="e.g. employees, customers.")
    recipients = models.TextField(blank=True, help_text="Who this data is shared with, if anyone.")
    retention_period = models.CharField(max_length=255, blank=True)
    security_measures = models.TextField(blank=True)
    owner = models.CharField(max_length=255, blank=True, help_text="Team or role accountable for this activity.")

    third_country_transfer = models.BooleanField(default=False)
    transfer_safeguards = models.CharField(
        max_length=255, blank=True, help_text="e.g. SCCs, adequacy decision — required if transfer is true."
    )

    review_due_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["review_due_at"]
        indexes = [
            models.Index(fields=["organization", "status"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.status})"
