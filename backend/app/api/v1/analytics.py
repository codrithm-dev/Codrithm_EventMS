from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.dependencies import get_current_organizer, get_current_admin
from app.models.user import User
from app.services import analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/platform")
async def platform_analytics(
    user: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    return await analytics_service.get_platform_analytics(db)


@router.get("/events/{event_id}")
async def event_analytics(
    event_id: str,
    user: User = Depends(get_current_organizer),
    db: AsyncSession = Depends(get_db),
):
    return await analytics_service.get_event_analytics(db, event_id)
