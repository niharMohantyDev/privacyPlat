from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.auditlog.services import log_event

from .models import Asset, Organization, OrganizationMembership, Workspace
from .serializers import (
    AssetSerializer,
    OrganizationMembershipSerializer,
    OrganizationSerializer,
    WorkspaceSerializer,
)


class OrganizationViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Organization.objects.filter(memberships__user=self.request.user)

    def perform_create(self, serializer):
        organization = serializer.save()
        OrganizationMembership.objects.create(
            organization=organization,
            user=self.request.user,
            role=OrganizationMembership.Role.ADMIN,
        )
        log_event(
            action="organization.created",
            entity_type="Organization",
            entity_id=organization.id,
            actor=self.request.user,
            organization=organization,
            request=self.request,
        )


class WorkspaceViewSet(viewsets.ModelViewSet):
    serializer_class = WorkspaceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Workspace.objects.filter(organization__memberships__user=self.request.user)

    def perform_create(self, serializer):
        workspace = serializer.save()
        log_event(
            action="workspace.created",
            entity_type="Workspace",
            entity_id=workspace.id,
            actor=self.request.user,
            organization=workspace.organization,
            request=self.request,
        )


class AssetViewSet(viewsets.ModelViewSet):
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Asset.objects.filter(
            workspace__organization__memberships__user=self.request.user
        )

    def perform_create(self, serializer):
        asset = serializer.save()
        log_event(
            action="asset.created",
            entity_type="Asset",
            entity_id=asset.id,
            actor=self.request.user,
            organization=asset.workspace.organization,
            request=self.request,
        )


class OrganizationMembershipViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationMembershipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return OrganizationMembership.objects.filter(
            organization__memberships__user=self.request.user
        )
