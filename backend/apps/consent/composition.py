"""
Composition root: the single place that knows how to wire concrete
implementations (Django repository, sha256 receipt factory, audit
logger) into a ConsentService. Views ask this factory function for a
service instance rather than constructing dependencies themselves —
swap an implementation here and every caller picks it up.
"""

from apps.auditlog.services import log_event

from .domain.receipt_factory import Sha256ReceiptFactory
from .repositories import DjangoConsentRepository
from .services import ConsentService


def build_consent_service() -> ConsentService:
    return ConsentService(
        repository=DjangoConsentRepository(),
        receipt_factory=Sha256ReceiptFactory(),
        audit_logger=log_event,
    )
