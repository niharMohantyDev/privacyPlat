from django.urls import path

from .views import (
    ProcessingActivityCreateView,
    ProcessingActivityListView,
    ProcessingActivityMarkReviewedView,
    ProcessingActivityTransitionView,
)

urlpatterns = [
    path("ropa/activities/", ProcessingActivityListView.as_view(), name="ropa-list"),
    path("ropa/activities/create/", ProcessingActivityCreateView.as_view(), name="ropa-create"),
    path(
        "ropa/activities/<uuid:activity_id>/transition/",
        ProcessingActivityTransitionView.as_view(),
        name="ropa-transition",
    ),
    path(
        "ropa/activities/<uuid:activity_id>/mark-reviewed/",
        ProcessingActivityMarkReviewedView.as_view(),
        name="ropa-mark-reviewed",
    ),
]
