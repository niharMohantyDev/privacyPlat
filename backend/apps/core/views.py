from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.auditlog.services import log_event

from .authorization import WRITE_ROLES, require_membership
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
        require_membership(
            self.request.user, serializer.validated_data["organization"].id, roles=WRITE_ROLES
        )
        workspace = serializer.save()
        log_event(
            action="workspace.created",
            entity_type="Workspace",
            entity_id=workspace.id,
            actor=self.request.user,
            organization=workspace.organization,
            request=self.request,
        )

    def perform_update(self, serializer):
        require_membership(self.request.user, serializer.instance.organization_id, roles=WRITE_ROLES)
        serializer.save()

    def perform_destroy(self, instance):
        require_membership(self.request.user, instance.organization_id, roles=WRITE_ROLES)
        instance.delete()


class AssetViewSet(viewsets.ModelViewSet):
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Asset.objects.filter(
            workspace__organization__memberships__user=self.request.user
        )

    def perform_create(self, serializer):
        workspace = serializer.validated_data["workspace"]
        require_membership(self.request.user, workspace.organization_id, roles=WRITE_ROLES)
        asset = serializer.save()
        log_event(
            action="asset.created",
            entity_type="Asset",
            entity_id=asset.id,
            actor=self.request.user,
            organization=asset.workspace.organization,
            request=self.request,
        )

    def perform_update(self, serializer):
        require_membership(
            self.request.user, serializer.instance.workspace.organization_id, roles=WRITE_ROLES
        )
        serializer.save()

    def perform_destroy(self, instance):
        require_membership(self.request.user, instance.workspace.organization_id, roles=WRITE_ROLES)
        instance.delete()


class OrganizationMembershipViewSet(viewsets.ModelViewSet):
    """
    Membership rows carry a role — including ADMIN — so writes here are
    the platform's actual privilege-escalation surface. Every write
    requires the requester to already be an ADMIN of the target org;
    get_queryset() filtering alone does not enforce that (see
    apps.core.authorization for why).
    """

    serializer_class = OrganizationMembershipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return OrganizationMembership.objects.filter(
            organization__memberships__user=self.request.user
        )

    def perform_create(self, serializer):
        organization = serializer.validated_data["organization"]
        require_membership(
            self.request.user, organization.id, roles=[OrganizationMembership.Role.ADMIN]
        )
        membership = serializer.save()
        log_event(
            action="membership.created",
            entity_type="OrganizationMembership",
            entity_id=membership.id,
            actor=self.request.user,
            organization=organization,
            metadata={"member_user_id": str(membership.user_id), "role": membership.role},
            request=self.request,
        )

    def perform_update(self, serializer):
        require_membership(
            self.request.user,
            serializer.instance.organization_id,
            roles=[OrganizationMembership.Role.ADMIN],
        )
        serializer.save()

    def perform_destroy(self, instance):
        require_membership(
            self.request.user, instance.organization_id, roles=[OrganizationMembership.Role.ADMIN]
        )
        instance.delete()
