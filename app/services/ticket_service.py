import io
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.registration import Registration, RegistrationStatus
from app.models.event import Event
from app.models.attendance import Attendance
from app.core.exceptions import NotFoundException, ConflictException
from app.core.qr import generate_qr_code
from app.services.storage_service import upload_image


async def get_ticket(db: AsyncSession, registration_id: str, user_id: str = None) -> dict:
    query = select(Registration).where(Registration.id == registration_id)
    if user_id:
        query = query.where(Registration.user_id == user_id)
    result = await db.execute(query)
    registration = result.scalar_one_or_none()
    if not registration:
        raise NotFoundException("Registration")
    if registration.status != RegistrationStatus.approved:
        raise NotFoundException("Ticket not available - registration not approved")

    event_result = await db.execute(select(Event).where(Event.id == registration.event_id))
    event = event_result.scalar_one_or_none()

    return {
        "registration_id": registration.id,
        "ticket_id": registration.ticket_id,
        "event_title": event.title if event else "",
        "event_date": event.date_time if event else None,
        "event_venue": event.venue if event else None,
        "attendee_name": registration.full_name,
        "qr_code_url": registration.qr_code_url or "",
        "status": registration.status,
    }


async def generate_ticket_qr(db: AsyncSession, registration_id: str) -> str:
    result = await db.execute(select(Registration).where(Registration.id == registration_id))
    registration = result.scalar_one_or_none()
    if not registration or not registration.ticket_id:
        raise NotFoundException("Registration or ticket")

    qr_buffer = generate_qr_code(registration.ticket_id)
    qr_url = await upload_image(qr_buffer, f"tickets/{registration.ticket_id}")
    registration.qr_code_url = qr_url
    return qr_url


async def checkin_attendee(db: AsyncSession, ticket_id: str, checked_by: str) -> dict:
    result = await db.execute(
        select(Registration).where(Registration.ticket_id == ticket_id)
    )
    registration = result.scalar_one_or_none()
    if not registration:
        raise NotFoundException("Ticket")
    if registration.status != RegistrationStatus.approved:
        raise NotFoundException("Ticket not valid")

    # Check if already checked in
    existing_checkin = await db.execute(
        select(Attendance).where(Attendance.registration_id == registration.id)
    )
    if existing_checkin.scalar_one_or_none():
        raise ConflictException("Already checked in")

    attendance = Attendance(
        registration_id=registration.id,
        checked_by=checked_by,
    )
    db.add(attendance)

    event_result = await db.execute(select(Event).where(Event.id == registration.event_id))
    event = event_result.scalar_one_or_none()

    return {
        "success": True,
        "message": "Check-in successful",
        "attendee_name": registration.full_name,
        "event_title": event.title if event else "",
    }


async def get_checkin_stats(db: AsyncSession, event_id: str) -> dict:
    total_result = await db.execute(
        select(func.count(Registration.id)).where(
            Registration.event_id == event_id,
            Registration.status == RegistrationStatus.approved,
        )
    )
    total_registered = total_result.scalar()

    checked_in_result = await db.execute(
        select(func.count(Attendance.id))
        .join(Registration, Attendance.registration_id == Registration.id)
        .where(Registration.event_id == event_id)
    )
    checked_in = checked_in_result.scalar()

    not_checked_in = total_registered - checked_in
    percentage = (checked_in / total_registered * 100) if total_registered > 0 else 0

    return {
        "total_registered": total_registered,
        "checked_in": checked_in,
        "not_checked_in": not_checked_in,
        "percentage": round(percentage, 1),
    }
