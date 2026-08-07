from django.urls import path

from .views import CurrentConsentView, PurposeListView, RecordConsentView

urlpatterns = [
    path("purposes/", PurposeListView.as_view(), name="consent-purposes"),
    path("records/", RecordConsentView.as_view(), name="consent-record"),
    path("records/latest/", CurrentConsentView.as_view(), name="consent-latest"),
]
