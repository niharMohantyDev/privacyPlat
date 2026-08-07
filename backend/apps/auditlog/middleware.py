class AuditLogMiddleware:
    """
    Attaches request-scoped audit metadata (client IP, user agent) so
    apps.auditlog.services.log_event() doesn't need every call site to
    re-derive them. Request-scoped rather than thread-local so it's safe
    under async views and threaded/gevent workers alike.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.audit_ip = self._client_ip(request)
        request.audit_user_agent = request.META.get("HTTP_USER_AGENT", "")
        return self.get_response(request)

    @staticmethod
    def _client_ip(request):
        forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")
