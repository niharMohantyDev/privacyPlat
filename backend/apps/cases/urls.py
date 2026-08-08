from django.urls import path

from .obligation_views import (
    ObligationCreateView,
    ObligationListView,
    ObligationMarkNotifiedView,
    ObligationMarkNotRequiredView,
)
from .public_views import PublicReportGrievanceView
from .views import CaseListView, CaseReportView, CaseTransitionView

urlpatterns = [
    path("cases/", CaseListView.as_view(), name="case-list"),
    path("cases/report/", CaseReportView.as_view(), name="case-report"),
    path("cases/<uuid:case_id>/transition/", CaseTransitionView.as_view(), name="case-transition"),
    path(
        "cases/<uuid:case_id>/notifications/",
        ObligationListView.as_view(),
        name="case-obligation-list",
    ),
    path(
        "cases/<uuid:case_id>/notifications/create/",
        ObligationCreateView.as_view(),
        name="case-obligation-create",
    ),
    path(
        "cases/notifications/<uuid:obligation_id>/mark-notified/",
        ObligationMarkNotifiedView.as_view(),
        name="case-obligation-mark-notified",
    ),
    path(
        "cases/notifications/<uuid:obligation_id>/mark-not-required/",
        ObligationMarkNotRequiredView.as_view(),
        name="case-obligation-mark-not-required",
    ),
    path("public/grievances/", PublicReportGrievanceView.as_view(), name="grievance-public-submit"),
]
