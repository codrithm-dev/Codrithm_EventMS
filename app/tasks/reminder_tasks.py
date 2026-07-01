from datetime import datetime, timedelta, timezone
from sqlalchemy import select
from app.tasks.celery_app import celery_app
from app.tasks.email_tasks import send_event_reminder
from app.database import async_session
from app.models.event import Event, EventStatus
from app.models.registration import Registration, RegistrationStatus
from app.models.user import User


def _run_async(coro):
    loop = asyncio.new_event_loop()
    try:
        loop.run_until_complete(coro)
    finally:
        loop.close()


import asyncio


@celery_app.task
def send_daily_reminders():
    async def _send():
        async with async_session() as db:
            tomorrow = datetime.now(timezone.utc) + timedelta(days=1)
            today_start = tomorrow.replace(hour=0, minute=0, second=0, microsecond=0)
            today_end = today_start + timedelta(days=1)

            result = await db.execute(
                select(Event).where(
                    Event.status == EventStatus.published,
                    Event.date_time >= today_start,
                    Event.date_time < today_end,
                )
            )
            events = result.scalars().all()

            for event in events:
                reg_result = await db.execute(
                    select(Registration)
                    .join(User, Registration.user_id == User.id)
                    .where(
                        Registration.event_id == event.id,
                        Registration.status == RegistrationStatus.approved,
                    )
                )
                registrations = reg_result.scalars().all()

                for reg in registrations:
                    user_result = await db.execute(select(User).where(User.id == reg.user_id))
                    user = user_result.scalar_one_or_none()
                    if user:
                        send_event_reminder.delay(
                            user.email,
                            user.full_name,
                            event.title,
                            event.date_time.strftime("%B %d, %Y at %I:%M %p"),
                        )

    _run_async(_send())


@celery_app.task
def schedule_reminders():
    from celery.schedules import crontab

    celery_app.conf.beat_schedule = {
        "send-daily-reminders": {
            "task": "app.tasks.reminder_tasks.send_daily_reminders",
            "schedule": crontab(hour=8, minute=0),
        },
    }
