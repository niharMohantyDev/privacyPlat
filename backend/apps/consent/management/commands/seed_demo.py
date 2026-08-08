"""
Seeds one demo Organization/Workspace/Asset + a purpose taxonomy, so the
embeddable Consent Banner has something real to call during local
development. Idempotent — safe to run repeatedly (get_or_create
throughout), and prints the Asset.public_key the frontend needs.
"""

from django.core.management.base import BaseCommand

from apps.consent.models import Purpose
from apps.core.models import Asset, Organization, Workspace


class Command(BaseCommand):
    help = "Seed a demo organization/asset/purposes for local UI development."

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

        self.stdout.write(self.style.SUCCESS("Seeded demo organization."))
        self.stdout.write(f"Organization: {org.name} ({org.id})")
        self.stdout.write(f"Asset:        {asset.name} ({asset.id})")
        self.stdout.write(self.style.SUCCESS(f"Asset public_key: {asset.public_key}"))
        self.stdout.write(
            "Put this in frontend/.env as VITE_DEMO_ASSET_PUBLIC_KEY to power the demo page."
        )
