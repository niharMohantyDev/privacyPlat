from .models import AuditEvent


def log_event(*, action, entity_type, entity_id, actor=None, organization=None, metadata=None, request=None):
    """
    Record an audit event. Call this from views/serializers/signal handlers
    at the point an action actually happens — it is not automatic.

    Pass `actor` explicitly as `request.user` when calling from a DRF view:
    JWT authentication happens inside DRF's view dispatch, after Django's
    middleware chain has already run, so request.user is not reliably
    populated by the time AuditLogMiddleware sees the request.
    """
    ip_address = getattr(request, "audit_ip", None) if request else None
    user_agent = getattr(request, "audit_user_agent", "") if request else ""

    return AuditEvent.objects.create(
        organization=organization,
        actor=actor,
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id),
        metadata=metadata or {},
        ip_address=ip_address,
        user_agent=user_agent,
    )
