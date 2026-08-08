"""In-memory PrivacyNoticeRepository test double — same rationale as
apps.ropa.tests.fakes.FakeProcessingActivityRepository."""

from apps.notices.domain.entities import PrivacyNoticeEntity
from apps.notices.domain.interfaces import PrivacyNoticeRepository


class FakePrivacyNoticeRepository(PrivacyNoticeRepository):
    def __init__(self):
        self._by_id: dict = {}

    def save(self, notice: PrivacyNoticeEntity) -> PrivacyNoticeEntity:
        self._by_id[notice.id] = notice
        return notice

    def get(self, organization_id, notice_id):
        notice = self._by_id.get(notice_id)
        if notice is None or notice.organization_id != organization_id:
            return None
        return notice

    def get_published(self, organization_id, notice_type):
        candidates = [
            n
            for n in self._by_id.values()
            if n.organization_id == organization_id and n.notice_type == notice_type and n.status == "published"
        ]
        return max(candidates, key=lambda n: n.version) if candidates else None

    def next_version_number(self, organization_id, notice_type):
        candidates = [
            n
            for n in self._by_id.values()
            if n.organization_id == organization_id and n.notice_type == notice_type
        ]
        return (max(n.version for n in candidates) + 1) if candidates else 1

    def list_for_organization(self, organization_id, notice_type=None, status=None):
        results = [n for n in self._by_id.values() if n.organization_id == organization_id]
        if notice_type:
            results = [n for n in results if n.notice_type == notice_type]
        if status:
            results = [n for n in results if n.status == status]
        return results
