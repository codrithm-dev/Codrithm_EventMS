from fastapi import APIRouter
from app.api.v1 import auth, users, events, registrations, tickets, notifications, analytics, admin

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(events.router)
api_router.include_router(registrations.router)
api_router.include_router(tickets.router)
api_router.include_router(notifications.router)
api_router.include_router(analytics.router)
api_router.include_router(admin.router)
