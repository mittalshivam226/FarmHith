from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.db.session import get_db
from app.models.booking import Booking
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.booking import (
    BookingResponse,
    CreateBookingRequest,
    UpdateBookingStatusRequest,
)


router = APIRouter(prefix="/bookings", tags=["bookings"])


def to_booking_response(booking: Booking) -> BookingResponse:
    return BookingResponse(
        id=booking.id,
        tracking_id=booking.tracking_id,
        package_id=booking.package_id,
        farmer_name=booking.farmer_name,
        mobile=booking.mobile,
        village=booking.village,
        district=booking.district,
        state=booking.state,
        crop_type=booking.crop_type,
        pickup_type=booking.pickup_type,
        address=booking.address,
        payment_method=booking.payment_method,
        payment_status=booking.payment_status,
        status=booking.status,
        created_at=booking.created_at.isoformat(),
        updated_at=booking.updated_at.isoformat(),
    )


@router.post("", response_model=BookingResponse)
def create_booking(payload: CreateBookingRequest, db: Session = Depends(get_db)):
    booking = Booking(**payload.model_dump())
    db.add(booking)
    db.commit()
    db.refresh(booking)

    return to_booking_response(booking)


@router.get("", response_model=list[BookingResponse])
def list_bookings(
    _: User = Depends(require_roles(UserRole.LAB, UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    bookings = db.query(Booking).order_by(Booking.created_at.desc()).all()
    return [to_booking_response(booking) for booking in bookings]


@router.get("/by-tracking", response_model=BookingResponse)
def get_booking_by_tracking(
    tracking_id: str = Query(..., min_length=1),
    mobile: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
):
    booking = (
        db.query(Booking)
        .filter(Booking.tracking_id == tracking_id, Booking.mobile == mobile)
        .first()
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found or invalid credentials.")
    return to_booking_response(booking)


@router.patch("/{booking_id}/status", response_model=BookingResponse)
def update_booking_status(
    booking_id: str,
    payload: UpdateBookingStatusRequest,
    _: User = Depends(require_roles(UserRole.LAB, UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.status = payload.status
    if payload.payment_status is not None:
        booking.payment_status = payload.payment_status

    db.add(booking)
    db.commit()
    db.refresh(booking)
    return to_booking_response(booking)
