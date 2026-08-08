from django.urls import path

from .public_views import PublicReportGrievanceView
from .views import CaseListView, CaseReportView, CaseTransitionView

urlpatterns = [
    path("cases/", CaseListView.as_view(), name="case-list"),
    path("cases/report/", CaseReportView.as_view(), name="case-report"),
    path("cases/<uuid:case_id>/transition/", CaseTransitionView.as_view(), name="case-transition"),
    path("public/grievances/", PublicReportGrievanceView.as_view(), name="grievance-public-submit"),
]
