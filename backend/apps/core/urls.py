from rest_framework.routers import DefaultRouter

from .views import (
    AssetViewSet,
    OrganizationMembershipViewSet,
    OrganizationViewSet,
    WorkspaceViewSet,
)

router = DefaultRouter()
router.register("organizations", OrganizationViewSet, basename="organization")
router.register("workspaces", WorkspaceViewSet, basename="workspace")
router.register("assets", AssetViewSet, basename="asset")
router.register("memberships", OrganizationMembershipViewSet, basename="membership")

urlpatterns = router.urls
