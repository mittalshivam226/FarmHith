from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.enums import ListingStatus


class ResidueListing(Base):
    __tablename__ = "residue_listings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    farmer_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    residue_type: Mapped[str] = mapped_column(String(120), nullable=False)
    quantity_tons: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    price_per_ton: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    location_text: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[ListingStatus] = mapped_column(
        Enum(ListingStatus), default=ListingStatus.ACTIVE, nullable=False
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )


class ResidueOrder(Base):
    __tablename__ = "residue_orders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    listing_id: Mapped[str] = mapped_column(String(36), ForeignKey("residue_listings.id"), nullable=False)
    buyer_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    ordered_quantity_tons: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    total_amount_inr: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="created", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

