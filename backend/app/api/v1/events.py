from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.dependencies import get_current_user, get_current_organizer
from app.models.user import User
from app.schemas.event import EventCreate, EventUpdate, EventResponse, EventListResponse, PaginatedEvents, EventStatusUpdate
from app.services import event_service

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("", response_model=PaginatedEvents)
async def list_events(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    category: str = None,
    event_type: str = None,
    status: str = None,
    search: str = None,
    db: AsyncSession = Depends(get_db),
):
    return await event_service.list_events(db, page, limit, category, event_type, status, search)


@router.get("/my", response_model=PaginatedEvents)
async def my_events(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    user: User = Depends(get_current_organizer),
    db: AsyncSession = Depends(get_db),
):
    return await event_service.get_organizer_events(db, user.id, page, limit)


@router.get("/{slug}", response_model=EventResponse)
async def get_event(slug: str, db: AsyncSession = Depends(get_db)):
    event = await event_service.get_event_by_slug(db, slug)
    return event


@router.post("", response_model=EventResponse)
async def create_event(
    data: EventCreate,
    user: User = Depends(get_current_organizer),
    db: AsyncSession = Depends(get_db),
):
    event = await event_service.create_event(db, user.id, data.model_dump())
    return event


@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: str,
    data: EventUpdate,
    user: User = Depends(get_current_organizer),
    db: AsyncSession = Depends(get_db),
):
    event = await event_service.update_event(db, event_id, user.id, data.model_dump(exclude_unset=True))
    return event


@router.patch("/{event_id}/status", response_model=EventResponse)
async def update_event_status(
    event_id: str,
    data: EventStatusUpdate,
    user: User = Depends(get_current_organizer),
    db: AsyncSession = Depends(get_db),
):
    event = await event_service.update_event_status(db, event_id, user.id, data.status)
    return event


@router.delete("/{event_id}")
async def delete_event(
    event_id: str,
    user: User = Depends(get_current_organizer),
    db: AsyncSession = Depends(get_db),
):
    await event_service.delete_event(db, event_id, user.id)
    return {"message": "Event deleted"}
