from apps.auditlog.services import log_event

from .repositories import DjangoPrivacyNoticeRepository
from .services import PrivacyNoticeService


def build_notice_service() -> PrivacyNoticeService:
    return PrivacyNoticeService(
        repository=DjangoPrivacyNoticeRepository(),
        audit_logger=log_event,
    )
