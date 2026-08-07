import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class BaseModel(models.Model):
    """Common id/timestamp fields shared by every domain model on the platform."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Organization(BaseModel):
    """A tenant. Every Workspace, Asset, and membership hangs off this."""

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    data_residency_region = models.CharField(
        max_length=64,
        blank=True,
        help_text="Region tenant data must be pinned to, e.g. 'in', 'eu', 'us'.",
    )
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
    """Custom user model, UUID-keyed, scoped to organizations via OrganizationMembership."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email


class OrganizationMembership(BaseModel):
    """RBAC: which role a user holds within a given organization."""

    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        PRIVACY_OFFICER = "privacy_officer", "Privacy Officer"
        ANALYST = "analyst", "Analyst"
        VIEWER = "viewer", "Viewer"
        AUDITOR = "auditor", "Auditor"

    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="memberships"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="memberships")
    role = models.CharField(max_length=32, choices=Role.choices, default=Role.VIEWER)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "user"], name="unique_org_membership"
            )
        ]

    def __str__(self):
        return f"{self.user.email} @ {self.organization.slug} ({self.role})"


class Workspace(BaseModel):
    """A grouping of Assets within an Organization (e.g. 'Marketing Site', 'Mobile Apps')."""

    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="workspaces"
    )
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "slug"], name="unique_workspace_slug_per_org"
            )
        ]

    def __str__(self):
        return f"{self.organization.slug}/{self.slug}"


class Asset(BaseModel):
    """A website, mobile app, or system that consent banners, scans, etc. attach to."""

    class AssetType(models.TextChoices):
        WEBSITE = "website", "Website"
        MOBILE_APP = "mobile_app", "Mobile App"
        SYSTEM = "system", "System"
        OTHER = "other", "Other"

    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name="assets")
    asset_type = models.CharField(max_length=32, choices=AssetType.choices)
    name = models.CharField(max_length=255)
    identifier = models.CharField(
        max_length=255,
        blank=True,
        help_text="Domain, bundle ID, or connection identifier depending on asset_type.",
    )

    def __str__(self):
        return f"{self.name} ({self.asset_type})"
