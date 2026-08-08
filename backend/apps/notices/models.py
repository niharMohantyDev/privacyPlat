from django.db import models

from apps.core.models import BaseModel, Organization


class PrivacyNotice(BaseModel):
    """
    One version of a privacy notice (privacy policy, terms of service,
    or cookie policy). `status` values and their legal transitions
    live in apps.notices.domain.states; this model only stores the
    current status code, it does not enforce transition rules (that's
    PrivacyNoticeService's job, via the State pattern — same
    convention as apps.cases.models.Case).

    Publishing a new version doesn't edit an old one in place — it
    creates a new row with version = previous + 1, and the service
    archives whatever was previously published for that notice_type.
    The full version history is always queryable.
    """

    class NoticeType(models.TextChoices):
        PRIVACY_POLICY = "privacy_policy", "Privacy Policy"
        TERMS_OF_SERVICE = "terms_of_service", "Terms of Service"
        COOKIE_POLICY = "cookie_policy", "Cookie Policy"

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="privacy_notices")
    notice_type = models.CharField(max_length=32, choices=NoticeType.choices)
    title = models.CharField(max_length=255)
    body = models.TextField(blank=True)
    version = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.DRAFT)
    change_summary = models.TextField(blank=True, help_text="What changed from the previous version.")
    published_at = models.DateTimeField(null=True, blank=True)
    review_due_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-version"]
        indexes = [
            models.Index(fields=["organization", "notice_type", "status"]),
        ]

    def __str__(self):
        return f"{self.notice_type} v{self.version} ({self.status})"
