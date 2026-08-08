from apps.auditlog.services import log_event

from .notifications import DjangoCaseNotifier
from .repositories import DjangoCaseRepository
from .services import CaseService


def build_case_service() -> CaseService:
    return CaseService(
        repository=DjangoCaseRepository(),
        notifier=DjangoCaseNotifier(),
        audit_logger=log_event,
    )
