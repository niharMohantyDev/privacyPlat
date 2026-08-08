class PublicEndpointCorsMiddleware:
    """
    CORS for the embeddable consent/DSAR SDKs.

    CORS_ALLOWED_ORIGINS (django-cors-headers) is a fixed allowlist and
    is right for the authenticated platform API (frontend.privacyplat.
    example, known in advance). It's wrong for /api/*/public/ — those
    are called from an anonymous visitor's browser on an arbitrary
    customer domain we can't know ahead of time, so a fixed allowlist
    means every such call gets silently blocked by the browser's CORS
    preflight, even though the server-side logic is entirely correct.
    This is exactly why automated API tests didn't catch it: DRF's test
    client bypasses browser CORS enforcement.

    Scoped to the known public path prefixes only — the authenticated
    API keeps django-cors-headers' strict, fixed-origin policy.
    """

    PUBLIC_PATH_PREFIXES = ("/api/consent/public/", "/api/rights/public/")

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if request.path.startswith(self.PUBLIC_PATH_PREFIXES):
            origin = request.META.get("HTTP_ORIGIN")
            if origin:
                response["Access-Control-Allow-Origin"] = origin
                existing_vary = response.get("Vary", "")
                if "Origin" not in existing_vary:
                    response["Vary"] = f"{existing_vary}, Origin".lstrip(", ")
            response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
            response["Access-Control-Allow-Headers"] = "content-type"

        return response
