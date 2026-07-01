from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from slugify import slugify
from app.models.event import Event, EventStatus
from app.models.registration import Registration, RegistrationStatus
from app.core.exceptions import NotFoundException, ForbiddenException
import math


async def create_event(db: AsyncSession, organizer_id: str, data: dict) -> Event:
    base_slug = slugify(data["title"])
    slug = base_slug
    counter = 1
    while True:
        result = await db.execute(select(Event).where(Event.slug == slug))
        if not result.scalar_one_or_none():
            break
        slug = f"{base_slug}-{counter}"
        counter += 1

    event = Event(**data, slug=slug, organizer_id=organizer_id, status=EventStatus.draft)
    db.add(event)
    await db.flush()
    return event


async def get_event_by_slug(db: AsyncSession, slug: str) -> Event:
    result = await db.execute(select(Event).where(Event.slug == slug))
    event = result.scalar_one_or_none()
    if not event:
        raise NotFoundException("Event")
    return event


async def get_event_by_id(db: AsyncSession, event_id: str) -> Event:
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise NotFoundException("Event")
    return event


async def list_events(
    db: AsyncSession, page: int = 1, limit: int = 10,
    category: str = None, event_type: str = None,
    status: str = None, search: str = None,
) -> dict:
    query = select(Event)
    count_query = select(func.count(Event.id))

    if category:
        query = query.where(Event.category == category)
        count_query = count_query.where(Event.category == category)
    if event_type:
        query = query.where(Event.event_type == event_type)
        count_query = count_query.where(Event.event_type == event_type)
    if status:
        query = query.where(Event.status == status)
        count_query = count_query.where(Event.status == status)
    if search:
        query = query.where(Event.title.ilike(f"%{search}%"))
        count_query = count_query.where(Event.title.ilike(f"%{search}%"))

    total_result = await db.execute(count_query)
    total = total_result.scalar()

    query = query.order_by(Event.date_time.desc())
    query = query.offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    events = result.scalars().all()

    items = []
    for event in events:
        reg_count_result = await db.execute(
            select(func.count(Registration.id)).where(
                Registration.event_id == event.id,
                Registration.status.in_([RegistrationStatus.approved, RegistrationStatus.pending]),
            )
        )
        registered_count = reg_count_result.scalar()
        event_dict = {
            "id": event.id,
            "title": event.title,
            "slug": event.slug,
            "banner_url": event.banner_url,
            "category": event.category,
            "event_type": event.event_type,
            "date_time": event.date_time,
            "venue": event.venue,
            "capacity": event.capacity,
            "status": event.status,
            "registered_count": registered_count,
        }
        items.append(event_dict)

    return {
        "items": items,
        "total": total,
        "page": page,
        "pages": math.ceil(total / limit) if total else 0,
    }


async def update_event(db: AsyncSession, event_id: str, organizer_id: str, data: dict) -> Event:
    event = await get_event_by_id(db, event_id)
    if event.organizer_id != organizer_id:
        raise ForbiddenException("You can only edit your own events")
    for key, value in data.items():
        if value is not None:
            setattr(event, key, value)
    if "title" in data and data["title"]:
        event.slug = slugify(data["title"])
    return event


async def update_event_status(db: AsyncSession, event_id: str, organizer_id: str, new_status: str) -> Event:
    event = await get_event_by_id(db, event_id)
    if event.organizer_id != organizer_id:
        raise ForbiddenException("You can only manage your own events")
    event.status = EventStatus(new_status)
    return event


async def delete_event(db: AsyncSession, event_id: str, organizer_id: str) -> bool:
    event = await get_event_by_id(db, event_id)
    if event.organizer_id != organizer_id:
        raise ForbiddenException("You can only delete your own events")
    await db.delete(event)
    return True


async def get_organizer_events(db: AsyncSession, organizer_id: str, page: int = 1, limit: int = 10) -> dict:
    count_query = select(func.count(Event.id)).where(Event.organizer_id == organizer_id)
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    query = (
        select(Event)
        .where(Event.organizer_id == organizer_id)
        .order_by(Event.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
    )
    result = await db.execute(query)
    events = result.scalars().all()

    items = []
    for event in events:
        reg_count_result = await db.execute(
            select(func.count(Registration.id)).where(
                Registration.event_id == event.id,
                Registration.status.in_([RegistrationStatus.approved, RegistrationStatus.pending]),
            )
        )
        registered_count = reg_count_result.scalar()
        event_dict = {
            "id": event.id,
            "title": event.title,
            "slug": event.slug,
            "banner_url": event.banner_url,
            "category": event.category,
            "event_type": event.event_type,
            "date_time": event.date_time,
            "venue": event.venue,
            "capacity": event.capacity,
            "status": event.status,
            "registered_count": registered_count,
        }
        items.append(event_dict)

    return {
        "items": items,
        "total": total,
        "page": page,
        "pages": math.ceil(total / limit) if total else 0,
    }
