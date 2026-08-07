from django.core.mail import send_mail
from django.utils import timezone

import requests
from celery import shared_task

from .models import Notification


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_backoff_max=600,
    max_retries=5,
)
def dispatch_notification(self, notification_id):
    notification = Notification.objects.get(pk=notification_id)
    notification.attempts += 1

    try:
        if notification.channel == Notification.Channel.EMAIL:
            _send_email(notification)
        else:
            _send_webhook(notification)
    except Exception as exc:
        notification.status = Notification.Status.FAILED
        notification.last_error = str(exc)
        notification.save(update_fields=["attempts", "status", "last_error"])
        raise

    notification.status = Notification.Status.SENT
    notification.sent_at = timezone.now()
    notification.save(update_fields=["attempts", "status", "sent_at"])


def _send_email(notification: Notification):
    send_mail(
        subject=notification.payload.get("subject", notification.event_type),
        message=notification.payload.get("body", ""),
        from_email=None,
        recipient_list=[notification.recipient],
    )


def _send_webhook(notification: Notification):
    response = requests.post(
        notification.recipient,
        json={"event": notification.event_type, "data": notification.payload},
        timeout=10,
    )
    response.raise_for_status()
