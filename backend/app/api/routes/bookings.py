from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.booking import Booking
from app.schemas.booking import CreateBookingRequest, CreateBookingResponse


router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("", response_model=CreateBookingResponse)
def create_booking(payload: CreateBookingRequest, db: Session = Depends(get_db)):
    booking = Booking(**payload.model_dump())
    db.add(booking)
    db.commit()
    db.refresh(booking)

    return CreateBookingResponse(
        id=booking.id,
        tracking_id=booking.tracking_id,
        status=booking.status,
        payment_status=booking.payment_status,
    )

