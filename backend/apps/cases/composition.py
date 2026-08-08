from apps.auditlog.services import log_event

from .notifications import DjangoCaseNotifier
from .obligation_repositories import DjangoBreachNotificationObligationRepository
from .obligation_seeder import DjangoBreachObligationSeeder
from .obligation_services import BreachNotificationObligationService
from .repositories import DjangoCaseRepository
from .services import CaseService


def build_obligation_service() -> BreachNotificationObligationService:
    return BreachNotificationObligationService(
        repository=DjangoBreachNotificationObligationRepository(),
        case_repository=DjangoCaseRepository(),
        audit_logger=log_event,
    )


def build_case_service() -> CaseService:
    return CaseService(
        repository=DjangoCaseRepository(),
        notifier=DjangoCaseNotifier(),
        audit_logger=log_event,
        on_case_reported=DjangoBreachObligationSeeder(build_obligation_service()),
    )
