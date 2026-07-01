import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    registration_id: Mapped[str] = mapped_column(String(36), ForeignKey("registrations.id"), unique=True)
    checkin_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    checked_by: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"))

    registration = relationship("Registration", back_populates="attendance", lazy="selectin")
    checker = relationship("User", lazy="selectin")
