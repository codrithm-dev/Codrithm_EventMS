from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class RegistrationCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    university: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    portfolio_url: Optional[str] = None
    dynamic_responses: Optional[dict] = None


class RegistrationResponse(BaseModel):
    id: str
    user_id: str
    event_id: str
    status: str
    ticket_id: Optional[str] = None
    qr_code_url: Optional[str] = None
    full_name: str
    email: str
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    university: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    portfolio_url: Optional[str] = None
    dynamic_responses: Optional[dict] = None
    registered_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PaginatedRegistrations(BaseModel):
    items: list[RegistrationResponse]
    total: int
    page: int
    pages: int


class RegistrationStatusUpdate(BaseModel):
    status: str
