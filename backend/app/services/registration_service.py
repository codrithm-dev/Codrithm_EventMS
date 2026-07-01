import uuid
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update
from app.models.registration import Registration, RegistrationStatus
from app.models.event import Event, EventStatus, ApprovalMode
from app.models.waitlist import Waitlist
from app.core.exceptions import NotFoundException, ConflictException, CapacityFullException, DeadlinePassedException, ForbiddenException
import math


async def register_for_event(db: AsyncSession, user_id: str, event_id: str, data: dict) -> Registration:
    event_result = await db.execute(select(Event).where(Event.id == event_id))
    event = event_result.scalar_one_or_none()
    if not event:
        raise NotFoundException("Event")
    if event.status != EventStatus.published:
        raise ConflictException("Event is not open for registration")
    if datetime.now(timezone.utc) > event.registration_deadline:
        raise DeadlinePassedException()

    existing = await db.execute(
        select(Registration).where(
            Registration.user_id == user_id,
            Registration.event_id == event_id,
            Registration.status.not_in([RegistrationStatus.cancelled]),
        )
    )
    if existing.scalar_one_or_none():
        raise ConflictException("Already registered for this event")

    reg_count_result = await db.execute(
        select(func.count(Registration.id)).where(
            Registration.event_id == event_id,
            Registration.status.in_([RegistrationStatus.approved, RegistrationStatus.pending]),
        )
    )
    registered_count = reg_count_result.scalar()

    if event.approval_mode == ApprovalMode.auto:
        if registered_count >= event.capacity:
            # Add to waitlist
            waitlist_count = await db.execute(
                select(func.count(Waitlist.id)).where(Waitlist.event_id == event_id)
            )
            position = waitlist_count.scalar() + 1
            waitlist = Waitlist(event_id=event_id, user_id=user_id, position=position)
            db.add(waitlist)

            registration = Registration(
                event_id=event_id,
                user_id=user_id,
                status=RegistrationStatus.waitlisted,
                full_name=data["full_name"],
                email=data["email"],
                phone=data.get("phone"),
                linkedin_url=data.get("linkedin_url"),
                github_url=data.get("github_url"),
                university=data.get("university"),
                company=data.get("company"),
                job_title=data.get("job_title"),
                portfolio_url=data.get("portfolio_url"),
                dynamic_responses=data.get("dynamic_responses"),
            )
            db.add(registration)
            await db.flush()
            return registration

        registration = Registration(
            event_id=event_id,
            user_id=user_id,
            status=RegistrationStatus.approved,
            ticket_id=str(uuid.uuid4()),
            full_name=data["full_name"],
            email=data["email"],
            phone=data.get("phone"),
            linkedin_url=data.get("linkedin_url"),
            github_url=data.get("github_url"),
            university=data.get("university"),
            company=data.get("company"),
            job_title=data.get("job_title"),
            portfolio_url=data.get("portfolio_url"),
            dynamic_responses=data.get("dynamic_responses"),
        )
        db.add(registration)
        await db.flush()
        return registration
    else:
        registration = Registration(
            event_id=event_id,
            user_id=user_id,
            status=RegistrationStatus.pending,
            full_name=data["full_name"],
            email=data["email"],
            phone=data.get("phone"),
            linkedin_url=data.get("linkedin_url"),
            github_url=data.get("github_url"),
            university=data.get("university"),
            company=data.get("company"),
            job_title=data.get("job_title"),
            portfolio_url=data.get("portfolio_url"),
            dynamic_responses=data.get("dynamic_responses"),
        )
        db.add(registration)
        await db.flush()
        return registration


async def approve_registration(db: AsyncSession, registration_id: str, event_id: str) -> Registration:
    result = await db.execute(
        select(Registration).where(
            Registration.id == registration_id,
            Registration.event_id == event_id,
        )
    )
    registration = result.scalar_one_or_none()
    if not registration:
        raise NotFoundException("Registration")

    registration.status = RegistrationStatus.approved
    registration.ticket_id = str(uuid.uuid4())
    return registration


async def reject_registration(db: AsyncSession, registration_id: str, event_id: str) -> Registration:
    result = await db.execute(
        select(Registration).where(
            Registration.id == registration_id,
            Registration.event_id == event_id,
        )
    )
    registration = result.scalar_one_or_none()
    if not registration:
        raise NotFoundException("Registration")
    registration.status = RegistrationStatus.rejected
    return registration


async def cancel_registration(db: AsyncSession, user_id: str, registration_id: str) -> dict:
    result = await db.execute(
        select(Registration).where(
            Registration.id == registration_id,
            Registration.user_id == user_id,
        )
    )
    registration = result.scalar_one_or_none()
    if not registration:
        raise NotFoundException("Registration")

    registration.status = RegistrationStatus.cancelled

    # Promote from waitlist if applicable
    promoted_user_id = None
    waitlist_result = await db.execute(
        select(Waitlist).where(Waitlist.event_id == registration.event_id).order_by(Waitlist.position.asc()).limit(1)
    )
    waitlist_entry = waitlist_result.scalar_one_or_none()
    if waitlist_entry:
        promoted_user_id = waitlist_entry.user_id
        # Update the promoted user's registration
        promoted_reg = await db.execute(
            select(Registration).where(
                Registration.user_id == waitlist_entry.user_id,
                Registration.event_id == registration.event_id,
                Registration.status == RegistrationStatus.waitlisted,
            )
        )
        promoted_registration = promoted_reg.scalar_one_or_none()
        if promoted_registration:
            promoted_registration.status = RegistrationStatus.approved
            promoted_registration.ticket_id = str(uuid.uuid4())
        await db.delete(waitlist_entry)

        # Update remaining waitlist positions
        await db.execute(
            update(Waitlist)
            .where(Waitlist.event_id == registration.event_id, Waitlist.position > waitlist_entry.position)
            .values(position=Waitlist.position - 1)
        )

    return {"registration": registration, "promoted_user_id": promoted_user_id}


async def get_user_registrations(db: AsyncSession, user_id: str, page: int = 1, limit: int = 10) -> dict:
    count_query = select(func.count(Registration.id)).where(Registration.user_id == user_id)
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    query = (
        select(Registration)
        .where(Registration.user_id == user_id)
        .order_by(Registration.registered_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
    )
    result = await db.execute(query)
    registrations = result.scalars().all()

    return {
        "items": registrations,
        "total": total,
        "page": page,
        "pages": math.ceil(total / limit) if total else 0,
    }


async def get_event_registrations(db: AsyncSession, event_id: str, page: int = 1, limit: int = 10, status: str = None) -> dict:
    query = select(Registration).where(Registration.event_id == event_id)
    count_query = select(func.count(Registration.id)).where(Registration.event_id == event_id)

    if status:
        query = query.where(Registration.status == status)
        count_query = count_query.where(Registration.status == status)

    total_result = await db.execute(count_query)
    total = total_result.scalar()

    query = query.order_by(Registration.registered_at.desc()).offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    registrations = result.scalars().all()

    return {
        "items": registrations,
        "total": total,
        "page": page,
        "pages": math.ceil(total / limit) if total else 0,
    }


async def get_event_approval_queue(db: AsyncSession, event_id: str, page: int = 1, limit: int = 10) -> dict:
    return await get_event_registrations(db, event_id, page, limit, status=RegistrationStatus.pending)
