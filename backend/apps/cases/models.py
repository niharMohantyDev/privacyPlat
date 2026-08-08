from django.db import models

from apps.core.models import BaseModel, Organization


class Case(BaseModel):
    """
    A breach or grievance case. One model for both — see
    apps.cases.domain for why this is deliberately a single engine
    rather than two near-identical ones. `status` values and their
    legal transitions live in apps.cases.domain.states; this model only
    stores the current status code, it does not enforce transition
    rules (that's CaseService's job, via the State pattern).
    """

    class CaseType(models.TextChoices):
        BREACH = "breach", "Breach / Incident"
        GRIEVANCE = "grievance", "Grievance"

    class Status(models.TextChoices):
        REPORTED = "reported", "Reported"
        INVESTIGATING = "investigating", "Investigating"
        RESOLVED = "resolved", "Resolved"
        CLOSED = "closed", "Closed"
        DISMISSED = "dismissed", "Dismissed"

    class Severity(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"
        CRITICAL = "critical", "Critical"

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="cases")
    case_type = models.CharField(max_length=16, choices=CaseType.choices)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.REPORTED)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    reported_by = models.CharField(
        max_length=255,
        blank=True,
        help_text="Complainant email for a grievance, or reporting staff/system for a breach.",
    )
    region = models.CharField(max_length=16, blank=True)
    severity = models.CharField(max_length=16, choices=Severity.choices, blank=True)
    due_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["due_at"]
        indexes = [
            models.Index(fields=["organization", "case_type", "status"]),
        ]

    def __str__(self):
        return f"{self.case_type}:{self.title} ({self.status})"
