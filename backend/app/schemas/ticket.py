from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TicketResponse(BaseModel):
    registration_id: str
    ticket_id: str
    event_title: str
    event_date: datetime
    event_venue: Optional[str] = None
    attendee_name: str
    qr_code_url: str
    status: str

    model_config = {"from_attributes": True}


class CheckinRequest(BaseModel):
    ticket_id: str


class CheckinResponse(BaseModel):
    success: bool
    message: str
    attendee_name: Optional[str] = None
    event_title: Optional[str] = None


class CheckinStats(BaseModel):
    total_registered: int
    checked_in: int
    not_checked_in: int
    percentage: float
