from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.dependencies import get_current_user, get_current_organizer
from app.models.user import User
from app.schemas.registration import RegistrationCreate, RegistrationResponse, PaginatedRegistrations, RegistrationStatusUpdate
from app.services import registration_service, notification_service, event_service

router = APIRouter(prefix="/registrations", tags=["Registrations"])


@router.post("/events/{event_id}/register", response_model=RegistrationResponse)
async def register_for_event(
    event_id: str,
    data: RegistrationCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    registration = await registration_service.register_for_event(db, user.id, event_id, data.model_dump())
    event = await event_service.get_event_by_id(db, event_id)
    await notification_service.send_registration_confirmation(db, user.id, event.title)
    return registration


@router.get("/mine", response_model=PaginatedRegistrations)
async def my_registrations(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await registration_service.get_user_registrations(db, user.id, page, limit)


@router.put("/{registration_id}/cancel")
async def cancel_registration(
    registration_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await registration_service.cancel_registration(db, user.id, registration_id)
    if result["promoted_user_id"]:
        event = await event_service.get_event_by_id(db, result["registration"].event_id)
        await notification_service.send_waitlist_promoted(db, result["promoted_user_id"], event.title)
    return {"message": "Registration cancelled"}


@router.get("/events/{event_id}", response_model=PaginatedRegistrations)
async def event_registrations(
    event_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    status: str = None,
    user: User = Depends(get_current_organizer),
    db: AsyncSession = Depends(get_db),
):
    return await registration_service.get_event_registrations(db, event_id, page, limit, status)


@router.get("/events/{event_id}/queue", response_model=PaginatedRegistrations)
async def approval_queue(
    event_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    user: User = Depends(get_current_organizer),
    db: AsyncSession = Depends(get_db),
):
    return await registration_service.get_event_approval_queue(db, event_id, page, limit)


@router.patch("/{registration_id}/approve", response_model=RegistrationResponse)
async def approve_registration(
    registration_id: str,
    event_id: str,
    user: User = Depends(get_current_organizer),
    db: AsyncSession = Depends(get_db),
):
    registration = await registration_service.approve_registration(db, registration_id, event_id)
    event = await event_service.get_event_by_id(db, event_id)
    await notification_service.send_registration_approved(db, registration.user_id, event.title)
    return registration


@router.patch("/{registration_id}/reject", response_model=RegistrationResponse)
async def reject_registration(
    registration_id: str,
    event_id: str,
    user: User = Depends(get_current_organizer),
    db: AsyncSession = Depends(get_db),
):
    registration = await registration_service.reject_registration(db, registration_id, event_id)
    event = await event_service.get_event_by_id(db, event_id)
    await notification_service.send_registration_rejected(db, registration.user_id, event.title)
    return registration
