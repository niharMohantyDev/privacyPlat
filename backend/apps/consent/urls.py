from django.urls import path
from rest_framework.routers import DefaultRouter

from .public_views import PublicPurposeListView, PublicRecordConsentView
from .views import CurrentConsentView, PurposeViewSet, RecordConsentView

router = DefaultRouter()
router.register("purposes", PurposeViewSet, basename="purpose")

urlpatterns = [
    path("records/", RecordConsentView.as_view(), name="consent-record"),
    path("records/latest/", CurrentConsentView.as_view(), name="consent-latest"),
    path("public/purposes/", PublicPurposeListView.as_view(), name="consent-public-purposes"),
    path("public/records/", PublicRecordConsentView.as_view(), name="consent-public-record"),
    *router.urls,
]
