from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.dependencies import get_current_user, get_current_organizer
from app.models.user import User
from app.schemas.ticket import TicketResponse, CheckinRequest, CheckinResponse, CheckinStats
from app.services import ticket_service

router = APIRouter(prefix="/tickets", tags=["Tickets"])


@router.get("/{registration_id}", response_model=TicketResponse)
async def get_ticket(
    registration_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await ticket_service.get_ticket(db, registration_id, user.id)


@router.post("/{registration_id}/generate-qr")
async def generate_qr(
    registration_id: str,
    user: User = Depends(get_current_organizer),
    db: AsyncSession = Depends(get_db),
):
    url = await ticket_service.generate_ticket_qr(db, registration_id)
    return {"qr_code_url": url}


@router.post("/checkin", response_model=CheckinResponse)
async def checkin(
    data: CheckinRequest,
    user: User = Depends(get_current_organizer),
    db: AsyncSession = Depends(get_db),
):
    return await ticket_service.checkin_attendee(db, data.ticket_id, user.id)


@router.get("/checkin/{event_id}/stats", response_model=CheckinStats)
async def checkin_stats(
    event_id: str,
    user: User = Depends(get_current_organizer),
    db: AsyncSession = Depends(get_db),
):
    return await ticket_service.get_checkin_stats(db, event_id)
