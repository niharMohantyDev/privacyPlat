from apps.auditlog.services import log_event

from .repositories import DjangoDSARRequestRepository
from .services import DSARService


def build_dsar_service() -> DSARService:
    return DSARService(
        repository=DjangoDSARRequestRepository(),
        audit_logger=log_event,
    )
