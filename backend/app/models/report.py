from datetime import date, datetime
from uuid import uuid4

from sqlalchemy import Date, DateTime, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    booking_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    tracking_id: Mapped[str] = mapped_column(String(30), unique=True, nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(30), default="pending", nullable=False)
    submitted_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    completed_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    ph_level: Mapped[float | None] = mapped_column(Numeric(8, 2), nullable=True)
    nitrogen: Mapped[float | None] = mapped_column(Numeric(8, 2), nullable=True)
    phosphorus: Mapped[float | None] = mapped_column(Numeric(8, 2), nullable=True)
    potassium: Mapped[float | None] = mapped_column(Numeric(8, 2), nullable=True)
    organic_carbon: Mapped[float | None] = mapped_column(Numeric(8, 2), nullable=True)
    pdf_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    recommendations: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
