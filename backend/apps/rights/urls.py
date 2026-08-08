from django.urls import path

from .public_views import PublicDSARRequestSubmitView
from .views import (
    DSARRequestDetailView,
    DSARRequestListView,
    DSARRequestSubmitView,
    DSARRequestTransitionView,
)

urlpatterns = [
    path("requests/", DSARRequestListView.as_view(), name="dsar-list"),
    path("requests/submit/", DSARRequestSubmitView.as_view(), name="dsar-submit"),
    path("requests/<uuid:request_id>/", DSARRequestDetailView.as_view(), name="dsar-detail"),
    path(
        "requests/<uuid:request_id>/transition/",
        DSARRequestTransitionView.as_view(),
        name="dsar-transition",
    ),
    path(
        "public/requests/",
        PublicDSARRequestSubmitView.as_view(),
        name="dsar-public-submit",
    ),
]
