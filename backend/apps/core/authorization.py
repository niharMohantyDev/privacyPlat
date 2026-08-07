"""
Shared authorization helper (Single Responsibility: this module answers
exactly one question — "is this user allowed to act on this org, in this
role?" — and every viewset that writes tenant-scoped data calls it instead
of re-implementing the check).

get_queryset() filtering alone is NOT sufficient authorization: it
correctly hides other tenants' data from *list/retrieve*, but does
nothing to stop a write whose target organization comes from the request
body itself (create/update). Every place that persists an
organization/workspace-scoped object must call require_membership()
before saving.
"""

from __future__ import annotations

import uuid

from rest_framework.exceptions import PermissionDenied

from .models import OrganizationMembership

#: Roles allowed to create/update/delete tenant-scoped data. VIEWER and
#: AUDITOR are read-only by design (see roadmap Phase 0 RBAC spec) — they
#: must never satisfy a write check.
WRITE_ROLES = [
    OrganizationMembership.Role.ADMIN,
    OrganizationMembership.Role.PRIVACY_OFFICER,
    OrganizationMembership.Role.ANALYST,
]


def require_membership(user, organization_id: uuid.UUID | str, roles: list[str] | None = None):
    """
    Raise PermissionDenied unless `user` has a membership in
    `organization_id` — optionally restricted to one of `roles`.
    """
    qs = OrganizationMembership.objects.filter(organization_id=organization_id, user=user)
    if roles:
        qs = qs.filter(role__in=roles)
    if not qs.exists():
        raise PermissionDenied("You do not have the required role in this organization.")
