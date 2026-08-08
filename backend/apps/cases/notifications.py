"""
Concrete CaseNotifier — the first real caller of apps.notifications,
which has existed since Phase 0 (Notification model + Celery dispatch
task with retry/backoff) without anything ever creating a row.

Deliberately calls .delay() (enqueue only) rather than running the
dispatch task eagerly: this module only decides *that* a notification
should go out and to whom, not how delivery actually happens — that's
dispatch_notification's job, already built and already tested on its
own. Requires a reachable Celery broker (Redis), same as the rest of
local dev already assumes per docker-compose.
"""

from apps.core.models import OrganizationMembership
from apps.notifications.models import Notification
from apps.notifications.tasks import dispatch_notification

from .domain.entities import CaseEntity
from .domain.interfaces import CaseNotifier


class DjangoCaseNotifier(CaseNotifier):
    def notify_reported(self, case: CaseEntity) -> None:
        admin_emails = OrganizationMembership.objects.filter(
            organization_id=case.organization_id, role=OrganizationMembership.Role.ADMIN
        ).values_list("user__email", flat=True)
        for email in admin_emails:
            self._send(
                case,
                email,
                event_type=f"case.{case.case_type}.reported",
                subject=f"New {case.case_type} reported: {case.title}",
            )

    def notify_resolved(self, case: CaseEntity) -> None:
        if case.case_type == "grievance" and case.reported_by:
            self._send(
                case,
                case.reported_by,
                event_type="case.grievance.resolved",
                subject=f"Your grievance has been resolved: {case.title}",
            )

    @staticmethod
    def _send(case: CaseEntity, recipient: str, *, event_type: str, subject: str) -> None:
        notification = Notification.objects.create(
            organization_id=case.organization_id,
            channel=Notification.Channel.EMAIL,
            recipient=recipient,
            event_type=event_type,
            payload={"subject": subject, "body": case.description, "case_id": str(case.id)},
        )
        dispatch_notification.delay(str(notification.id))
