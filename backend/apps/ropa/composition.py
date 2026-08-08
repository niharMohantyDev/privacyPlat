from apps.auditlog.services import log_event

from .repositories import DjangoProcessingActivityRepository
from .services import ProcessingActivityService


def build_ropa_service() -> ProcessingActivityService:
    return ProcessingActivityService(
        repository=DjangoProcessingActivityRepository(),
        audit_logger=log_event,
    )
