import uuid
import enum
from datetime import datetime, timezone
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class EventStatus(str, enum.Enum):
    draft = "draft"
    published = "published"
    cancelled = "cancelled"
    completed = "completed"


class EventType(str, enum.Enum):
    online = "online"
    in_person = "in-person"
    hybrid = "hybrid"


class ApprovalMode(str, enum.Enum):
    auto = "auto"
    manual = "manual"


class Event(Base):
    __tablename__ = "events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text)
    banner_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    category: Mapped[str] = mapped_column(String(100), index=True)
    event_type: Mapped[EventType] = mapped_column(Enum(EventType))
    venue: Mapped[str | None] = mapped_column(String(500), nullable=True)
    date_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    capacity: Mapped[int] = mapped_column(Integer)
    registration_deadline: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    approval_mode: Mapped[ApprovalMode] = mapped_column(Enum(ApprovalMode), default=ApprovalMode.auto)
    organizer_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"))
    status: Mapped[EventStatus] = mapped_column(Enum(EventStatus), default=EventStatus.draft)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    organizer = relationship("User", back_populates="events", lazy="selectin")
    registrations = relationship("Registration", back_populates="event", lazy="selectin")
    waitlists = relationship("Waitlist", back_populates="event", lazy="selectin")
