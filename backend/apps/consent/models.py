from django.db import models

from apps.core.models import Asset, BaseModel, Organization


class Purpose(BaseModel):
    """A processing purpose an organization asks consent for (e.g. 'analytics')."""

    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="purposes"
    )
    code = models.SlugField(max_length=64)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_essential = models.BooleanField(
        default=False,
        help_text="Essential purposes are always granted and cannot be denied.",
    )

    class Meta:
        ordering = ["code"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "code"], name="unique_purpose_code_per_org"
            )
        ]

    def __str__(self):
        return f"{self.organization.slug}:{self.code}"


class ConsentRecord(BaseModel):
    """
    One immutable consent event for a subject. A change of mind creates a
    new record with version = previous + 1; existing records are never
    edited (see apps.consent.repositories for the append-only enforcement).
    """

    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="consent_records"
    )
    asset = models.ForeignKey(
        Asset, on_delete=models.SET_NULL, null=True, blank=True, related_name="consent_records"
    )
    subject_key = models.CharField(
        max_length=255,
        help_text="Anonymous device/cookie id, or a verified subject identifier.",
    )
    region = models.CharField(max_length=16)
    framework = models.CharField(max_length=32)
    version = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["-version"]
        indexes = [
            models.Index(fields=["organization", "subject_key", "-version"]),
        ]

    def save(self, *args, **kwargs):
        if self.pk is not None and not self._state.adding:
            raise ValueError("ConsentRecord is immutable; create a new version instead.")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.subject_key}@v{self.version} ({self.framework})"


class ConsentDecision(BaseModel):
    """One purpose/granted pair belonging to a ConsentRecord."""

    record = models.ForeignKey(
        ConsentRecord, on_delete=models.CASCADE, related_name="decisions"
    )
    purpose = models.ForeignKey(Purpose, on_delete=models.PROTECT, related_name="decisions")
    granted = models.BooleanField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["record", "purpose"], name="unique_decision_per_record_purpose"
            )
        ]

    def __str__(self):
        return f"{self.purpose.code}={'granted' if self.granted else 'denied'}"
