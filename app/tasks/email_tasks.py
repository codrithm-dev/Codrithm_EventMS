from app.tasks.celery_app import celery_app
from app.core.email import send_email, event_reminder_html
import asyncio


def _run_async(coro):
    loop = asyncio.new_event_loop()
    try:
        loop.run_until_complete(coro)
    finally:
        loop.close()


@celery_app.task(bind=True, max_retries=3)
def send_email_task(self, to: str, subject: str, html: str):
    try:
        _run_async(send_email(to, subject, html))
    except Exception as exc:
        self.retry(exc=exc, countdown=60)


@celery_app.task
def send_event_reminder(user_email: str, user_name: str, event_title: str, event_date: str):
    html = event_reminder_html(user_name, event_title, event_date)
    _run_async(send_email(user_email, f"Reminder: {event_title}", html))


@celery_app.task
def bulk_send_reminders(reminders: list[dict]):
    for reminder in reminders:
        send_event_reminder.delay(
            reminder["email"],
            reminder["name"],
            reminder["event_title"],
            reminder["event_date"],
        )
