from rest_framework import serializers

from .models import Asset, Organization, OrganizationMembership, Workspace


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ["id", "name", "slug", "data_residency_region", "is_active", "created_at"]
        read_only_fields = ["id", "created_at"]


class WorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = ["id", "organization", "name", "slug", "created_at"]
        read_only_fields = ["id", "created_at"]


class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = [
            "id",
            "workspace",
            "asset_type",
            "name",
            "identifier",
            "public_key",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["id", "public_key", "created_at"]


class OrganizationMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationMembership
        fields = ["id", "organization", "user", "role", "created_at"]
        read_only_fields = ["id", "created_at"]
