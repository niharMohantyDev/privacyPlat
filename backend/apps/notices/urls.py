from django.urls import path

from .public_views import PublicNoticeView
from .views import NoticeArchiveView, NoticeCreateDraftView, NoticeListView, NoticePublishView

urlpatterns = [
    path("notices/", NoticeListView.as_view(), name="notice-list"),
    path("notices/create/", NoticeCreateDraftView.as_view(), name="notice-create-draft"),
    path("notices/<uuid:notice_id>/publish/", NoticePublishView.as_view(), name="notice-publish"),
    path("notices/<uuid:notice_id>/archive/", NoticeArchiveView.as_view(), name="notice-archive"),
    path("public/notices/<str:notice_type>/", PublicNoticeView.as_view(), name="notice-public"),
]
