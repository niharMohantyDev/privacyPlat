"""
Seeds one demo Organization/Workspace/Asset + a purpose taxonomy, a
demo staff user who can log into the admin dashboard, and a few sample
DSAR requests so the triage queue has something to show. Idempotent —
safe to run repeatedly.
"""

from django.core.management.base import BaseCommand

from apps.consent.models import Purpose
from apps.core.models import Asset, Organization, OrganizationMembership, User, Workspace
from apps.rights.composition import build_dsar_service
from apps.rights.models import DSARRequest

DEMO_STAFF_EMAIL = "staff@demo-org.test"
DEMO_STAFF_PASSWORD = "demo-password-123"  # local dev only — reset on every run, see below


class Command(BaseCommand):
    help = "Seed a demo organization/asset/purposes/staff-user/DSAR-requests for local UI development."

    def handle(self, *args, **options):
        org, _ = Organization.objects.get_or_create(
            slug="demo-org", defaults={"name": "Demo Org", "data_residency_region": "eu"}
        )
        workspace, _ = Workspace.objects.get_or_create(
            organization=org, slug="marketing-site", defaults={"name": "Marketing Site"}
        )
        asset, _ = Asset.objects.get_or_create(
            workspace=workspace,
            name="demo.example.com",
            defaults={"asset_type": Asset.AssetType.WEBSITE, "identifier": "demo.example.com"},
        )

        purposes = [
            ("security", "Essential / Security", "Required to keep the site secure and working.", True),
            ("analytics", "Analytics", "Helps us understand how visitors use the site.", False),
            ("marketing", "Marketing", "Used to personalize ads and measure campaigns.", False),
            ("personalization", "Personalization", "Remembers your preferences across visits.", False),
        ]
        for code, name, description, is_essential in purposes:
            Purpose.objects.get_or_create(
                organization=org,
                code=code,
                defaults={"name": name, "description": description, "is_essential": is_essential},
            )

        staff_user, _ = User.objects.get_or_create(
            email=DEMO_STAFF_EMAIL, defaults={"username": "demo-staff"}
        )
        # Local dev convenience only: reset to the known demo password on
        # every run so it's always reproducible. Never do this outside a
        # seed script meant purely for local development.
        staff_user.set_password(DEMO_STAFF_PASSWORD)
        staff_user.save()
        OrganizationMembership.objects.get_or_create(
            organization=org, user=staff_user, defaults={"role": OrganizationMembership.Role.ADMIN}
        )

        if not DSARRequest.objects.filter(organization=org).exists():
            service = build_dsar_service()
            for subject_key, request_type, region in [
                ("alice@example.com", "access", "DE"),
                ("bob@example.com", "deletion", "IN"),
                ("carol@example.com", "portability", "US-CA"),
            ]:
                service.submit_request(
                    organization_id=org.id,
                    subject_key=subject_key,
                    request_type=request_type,
                    region=region,
                )

        self.stdout.write(self.style.SUCCESS("Seeded demo organization."))
        self.stdout.write(f"Organization:     {org.name} ({org.id})")
        self.stdout.write(f"Asset:            {asset.name} ({asset.id})")
        self.stdout.write(self.style.SUCCESS(f"Asset public_key: {asset.public_key}"))
        self.stdout.write(
            "Put the org id in frontend/.env as VITE_DEMO_ORGANIZATION_ID and the "
            "public_key as VITE_DEMO_ASSET_PUBLIC_KEY."
        )
        self.stdout.write(
            self.style.SUCCESS(f"Demo staff login: {DEMO_STAFF_EMAIL} / {DEMO_STAFF_PASSWORD}")
        )
