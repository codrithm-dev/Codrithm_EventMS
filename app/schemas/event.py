from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class EventCreate(BaseModel):
    title: str
    description: str
    category: str
    event_type: str
    venue: Optional[str] = None
    date_time: datetime
    capacity: int
    registration_deadline: datetime
    approval_mode: str = "auto"
    banner_url: Optional[str] = None


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    event_type: Optional[str] = None
    venue: Optional[str] = None
    date_time: Optional[datetime] = None
    capacity: Optional[int] = None
    registration_deadline: Optional[datetime] = None
    approval_mode: Optional[str] = None
    banner_url: Optional[str] = None


class EventResponse(BaseModel):
    id: str
    title: str
    slug: str
    description: str
    banner_url: Optional[str] = None
    category: str
    event_type: str
    venue: Optional[str] = None
    date_time: datetime
    capacity: int
    registration_deadline: datetime
    approval_mode: str
    organizer_id: str
    status: str
    created_at: datetime
    updated_at: datetime
    registered_count: Optional[int] = None

    model_config = {"from_attributes": True}


class EventListResponse(BaseModel):
    id: str
    title: str
    slug: str
    banner_url: Optional[str] = None
    category: str
    event_type: str
    date_time: datetime
    venue: Optional[str] = None
    capacity: int
    status: str
    registered_count: Optional[int] = None

    model_config = {"from_attributes": True}


class PaginatedEvents(BaseModel):
    items: list[EventListResponse]
    total: int
    page: int
    pages: int


class EventStatusUpdate(BaseModel):
    status: str
