import csv
import io
import math
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.dependencies import get_current_organizer, get_current_admin, get_current_user
from app.models.user import User, UserRole
from app.models.registration import Registration, RegistrationStatus
from app.models.event import Event
from app.core.exceptions import NotFoundException
from app.schemas.user import UserResponse, AdminUserUpdate

router = APIRouter(prefix="/admin", tags=["Admin & Dashboard"])


@router.get("/users")
async def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    user: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    count_result = await db.execute(select(func.count(User.id)))
    total = count_result.scalar()

    query = select(User).offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()

    return {
        "items": [UserResponse.model_validate(u) for u in users],
        "total": total,
        "page": page,
        "pages": math.ceil(total / limit) if total else 0,
    }


@router.put("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    data: AdminUserUpdate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    target_user = result.scalar_one_or_none()
    if not target_user:
        raise NotFoundException("User")
    target_user.role = UserRole(data.role)
    return {"message": f"User role updated to {data.role}"}


@router.get("/dashboard/export/{event_id}")
async def export_registrations(
    event_id: str,
    user: User = Depends(get_current_organizer),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Registration).where(Registration.event_id == event_id)
    )
    registrations = result.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Name", "Email", "Phone", "Status", "Ticket ID", "Registered At", "LinkedIn", "GitHub", "University", "Company"])

    for reg in registrations:
        writer.writerow([
            reg.full_name, reg.email, reg.phone or "", reg.status,
            reg.ticket_id or "", reg.registered_at.isoformat(),
            reg.linkedin_url or "", reg.github_url or "",
            reg.university or "", reg.company or "",
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=registrations_{event_id}.csv"},
    )


@router.get("/dashboard/organizer/events")
async def organizer_dashboard_events(
    user: User = Depends(get_current_organizer),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Event).where(Event.organizer_id == user.id).order_by(Event.created_at.desc())
    )
    events = result.scalars().all()

    event_data = []
    for event in events:
        reg_count = (await db.execute(
            select(func.count(Registration.id)).where(
                Registration.event_id == event.id,
                Registration.status == RegistrationStatus.approved,
            )
        )).scalar()
        event_data.append({
            "id": event.id,
            "title": event.title,
            "slug": event.slug,
            "status": event.status,
            "date_time": event.date_time,
            "capacity": event.capacity,
            "registered": reg_count,
        })

    return event_data


@router.get("/dashboard/my-events")
async def user_dashboard_events(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Registration).where(
            Registration.user_id == user.id,
            Registration.status.in_([RegistrationStatus.approved, RegistrationStatus.pending, RegistrationStatus.waitlisted]),
        ).order_by(Registration.registered_at.desc())
    )
    registrations = result.scalars().all()

    reg_data = []
    for reg in registrations:
        event_result = await db.execute(select(Event).where(Event.id == reg.event_id))
        event = event_result.scalar_one_or_none()
        reg_data.append({
            "registration_id": reg.id,
            "event_title": event.title if event else "",
            "event_date": event.date_time if event else None,
            "event_slug": event.slug if event else "",
            "status": reg.status,
            "ticket_id": reg.ticket_id,
        })

    return reg_data
