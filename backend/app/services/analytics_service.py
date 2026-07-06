from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, cast, Date
from app.models.user import User, UserRole
from app.models.event import Event, EventStatus
from app.models.registration import Registration, RegistrationStatus
from app.models.attendance import Attendance


async def get_platform_analytics(db: AsyncSession) -> dict:
    total_users = (await db.execute(select(func.count(User.id)))).scalar()
    total_events = (await db.execute(select(func.count(Event.id)))).scalar()
    total_registrations = (await db.execute(select(func.count(Registration.id)))).scalar()
    total_approved = (await db.execute(
        select(func.count(Registration.id)).where(Registration.status == RegistrationStatus.approved)
    )).scalar()
    total_checked_in = (await db.execute(select(func.count(Attendance.id)))).scalar()

    approval_rate = (total_approved / total_registrations * 100) if total_registrations > 0 else 0
    attendance_rate = (total_checked_in / total_approved * 100) if total_approved > 0 else 0

    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    recent_registrations = (await db.execute(
        select(func.count(Registration.id)).where(Registration.registered_at >= thirty_days_ago)
    )).scalar()

    category_rows = (await db.execute(
        select(Event.category, func.count(Event.id)).group_by(Event.category)
    )).all()
    events_by_category = {row[0]: row[1] for row in category_rows}

    # Registrations over time (last 30 days)
    thirty_days_ago_date = (datetime.now(timezone.utc) - timedelta(days=30)).date()
    registrations_by_day = (await db.execute(
        select(
            cast(Registration.registered_at, Date).label("day"),
            func.count(Registration.id).label("count"),
        )
        .where(Registration.registered_at >= thirty_days_ago)
        .group_by(cast(Registration.registered_at, Date))
        .order_by(cast(Registration.registered_at, Date))
    )).all()

    registrations_over_time = [
        {"date": row.day.isoformat(), "count": row.count}
        for row in registrations_by_day
    ]

    # User growth over time (last 30 days)
    users_by_day = (await db.execute(
        select(
            cast(User.created_at, Date).label("day"),
            func.count(User.id).label("count"),
        )
        .where(User.created_at >= thirty_days_ago)
        .group_by(cast(User.created_at, Date))
        .order_by(cast(User.created_at, Date))
    )).all()

    user_growth = [
        {"date": row.day.isoformat(), "count": row.count}
        for row in users_by_day
    ]

    # Registration status distribution
    status_rows = (await db.execute(
        select(Registration.status, func.count(Registration.id)).group_by(Registration.status)
    )).all()
    registrations_by_status = {
        (row.status.value if hasattr(row.status, "value") else row.status): row.count
        for row in status_rows
    }

    return {
        "total_users": total_users,
        "total_events": total_events,
        "total_registrations": total_registrations,
        "total_approved": total_approved,
        "total_checked_in": total_checked_in,
        "approval_rate": round(approval_rate, 1),
        "attendance_rate": round(attendance_rate, 1),
        "recent_registrations": recent_registrations,
        "events_by_category": events_by_category,
        "registrations_over_time": registrations_over_time,
        "user_growth": user_growth,
        "registrations_by_status": registrations_by_status,
    }


async def get_event_analytics(db: AsyncSession, event_id: str) -> dict:
    total_registered = (await db.execute(
        select(func.count(Registration.id)).where(Registration.event_id == event_id)
    )).scalar()

    approved = (await db.execute(
        select(func.count(Registration.id)).where(
            Registration.event_id == event_id,
            Registration.status == RegistrationStatus.approved,
        )
    )).scalar()

    pending = (await db.execute(
        select(func.count(Registration.id)).where(
            Registration.event_id == event_id,
            Registration.status == RegistrationStatus.pending,
        )
    )).scalar()

    rejected = (await db.execute(
        select(func.count(Registration.id)).where(
            Registration.event_id == event_id,
            Registration.status == RegistrationStatus.rejected,
        )
    )).scalar()

    waitlisted = (await db.execute(
        select(func.count(Registration.id)).where(
            Registration.event_id == event_id,
            Registration.status == RegistrationStatus.waitlisted,
        )
    )).scalar()

    checked_in = (await db.execute(
        select(func.count(Attendance.id))
        .join(Registration, Attendance.registration_id == Registration.id)
        .where(Registration.event_id == event_id)
    )).scalar()

    event_result = await db.execute(select(Event).where(Event.id == event_id))
    event = event_result.scalar_one_or_none()

    capacity = event.capacity if event else 0
    capacity_used = (approved / capacity * 100) if capacity > 0 else 0
    attendance_rate = (checked_in / approved * 100) if approved > 0 else 0

    # Registration trend for this event (last 30 days)
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    trend_rows = (await db.execute(
        select(
            cast(Registration.registered_at, Date).label("day"),
            func.count(Registration.id).label("count"),
        )
        .where(
            Registration.event_id == event_id,
            Registration.registered_at >= thirty_days_ago,
        )
        .group_by(cast(Registration.registered_at, Date))
        .order_by(cast(Registration.registered_at, Date))
    )).all()

    registration_trend = [
        {"date": row.day.isoformat(), "count": row.count}
        for row in trend_rows
    ]

    return {
        "event_id": event_id,
        "event_title": event.title if event else "",
        "total_registered": total_registered,
        "total_registrations": total_registered,
        "approved": approved,
        "pending": pending,
        "rejected": rejected,
        "waitlisted": waitlisted,
        "checked_in": checked_in,
        "capacity": capacity,
        "capacity_used_percent": round(capacity_used, 1),
        "attendance_rate": round(attendance_rate, 1),
        "registration_trend": registration_trend,
    }
