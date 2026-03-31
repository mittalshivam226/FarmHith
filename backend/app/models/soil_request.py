from datetime import datetime, date
from uuid import uuid4

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.enums import SoilRequestStatus


class SoilRequest(Base):
    __tablename__ = "soil_requests"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    tracking_id: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    farmer_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    assigned_lab_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    crop_type: Mapped[str] = mapped_column(String(120), nullable=False)
    pickup_type: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[SoilRequestStatus] = mapped_column(
        Enum(SoilRequestStatus), default=SoilRequestStatus.PENDING, nullable=False
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )


class SoilReport(Base):
    __tablename__ = "soil_reports"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    soil_request_id: Mapped[str] = mapped_column(String(36), ForeignKey("soil_requests.id"), nullable=False)
    submitted_date: Mapped[date] = mapped_column(Date, nullable=False)
    completed_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    ph_level: Mapped[float | None] = mapped_column(Numeric(4, 2), nullable=True)
    nitrogen: Mapped[float | None] = mapped_column(Numeric(8, 2), nullable=True)
    phosphorus: Mapped[float | None] = mapped_column(Numeric(8, 2), nullable=True)
    potassium: Mapped[float | None] = mapped_column(Numeric(8, 2), nullable=True)
    moisture: Mapped[float | None] = mapped_column(Numeric(6, 2), nullable=True)
    recommendations: Mapped[str | None] = mapped_column(Text, nullable=True)
    report_pdf_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

