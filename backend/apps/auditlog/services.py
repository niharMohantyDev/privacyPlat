from .models import AuditEvent


def _pk_of(value):
    """Accepts either a model instance or a raw pk; returns the pk either way."""
    return getattr(value, "pk", value) if value is not None else None


def log_event(*, action, entity_type, entity_id, actor=None, organization=None, metadata=None, request=None):
    """
    Record an audit event. Call this from views/serializers/services at
    the point an action actually happens — it is not automatic.

    `actor` and `organization` accept either a model instance or a raw id,
    so service-layer code that only carries ids (to stay decoupled from
    Django models — see apps.consent.services) doesn't need to fetch full
    instances just to log an event.

    Pass `actor` explicitly as `request.user` when calling from a DRF view:
    JWT authentication happens inside DRF's view dispatch, after Django's
    middleware chain has already run, so request.user is not reliably
    populated by the time AuditLogMiddleware sees the request.
    """
    ip_address = getattr(request, "audit_ip", None) if request else None
    user_agent = getattr(request, "audit_user_agent", "") if request else ""

    return AuditEvent.objects.create(
        organization_id=_pk_of(organization),
        actor_id=_pk_of(actor),
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id),
        metadata=metadata or {},
        ip_address=ip_address,
        user_agent=user_agent,
    )
