from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.notification import Notification, NotificationType, NotificationStatus
from app.models.user import User
from app.core.email import send_email, registration_confirmation_html, registration_approved_html, registration_rejected_html, event_reminder_html, waitlist_promoted_html
import math


async def create_notification(
    db: AsyncSession, user_id: str, type: NotificationType,
    title: str, message: str, send_immediately: bool = False
) -> Notification:
    notification = Notification(
        user_id=user_id,
        type=type,
        title=title,
        message=message,
    )

    if send_immediately:
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if user:
            sent = await send_email(user.email, title, message)
            if sent:
                notification.status = NotificationStatus.sent
                notification.sent_at = datetime.now(timezone.utc)

    db.add(notification)
    await db.flush()
    return notification


async def send_registration_confirmation(db: AsyncSession, user_id: str, event_title: str) -> None:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        return

    html = registration_confirmation_html(user.full_name, event_title)
    await create_notification(
        db, user_id, NotificationType.registration_submitted,
        f"Registration Confirmed - {event_title}", html, send_immediately=True
    )


async def send_registration_approved(db: AsyncSession, user_id: str, event_title: str) -> None:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        return

    html = registration_approved_html(user.full_name, event_title)
    await create_notification(
        db, user_id, NotificationType.registration_approved,
        f"Registration Approved - {event_title}", html, send_immediately=True
    )


async def send_registration_rejected(db: AsyncSession, user_id: str, event_title: str) -> None:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        return

    html = registration_rejected_html(user.full_name, event_title)
    await create_notification(
        db, user_id, NotificationType.registration_rejected,
        f"Registration Update - {event_title}", html, send_immediately=True
    )


async def send_waitlist_promoted(db: AsyncSession, user_id: str, event_title: str) -> None:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        return

    html = waitlist_promoted_html(user.full_name, event_title)
    await create_notification(
        db, user_id, NotificationType.registration_approved,
        f"You're In! - {event_title}", html, send_immediately=True
    )


async def get_user_notifications(db: AsyncSession, user_id: str, page: int = 1, limit: int = 10) -> dict:
    count_query = select(func.count(Notification.id)).where(Notification.user_id == user_id)
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    unread_result = await db.execute(
        select(func.count(Notification.id)).where(
            Notification.user_id == user_id,
            Notification.is_read == False,
        )
    )
    unread_count = unread_result.scalar()

    query = (
        select(Notification)
        .where(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
    )
    result = await db.execute(query)
    notifications = result.scalars().all()

    return {
        "items": notifications,
        "total": total,
        "page": page,
        "pages": math.ceil(total / limit) if total else 0,
        "unread_count": unread_count,
    }
