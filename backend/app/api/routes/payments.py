from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

from app.core.config import settings
from app.db.session import get_db
from app.models.enums import PaymentStatus
from app.models.payment import Payment
from app.schemas.payment import (
    CreatePaymentOrderRequest,
    CreatePaymentOrderResponse,
    VerifyPaymentSignatureRequest,
    VerifyPaymentSignatureResponse,
)
from app.services.razorpay_service import RazorpayService


router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/create-order", response_model=CreatePaymentOrderResponse)
def create_payment_order(payload: CreatePaymentOrderRequest, db: Session = Depends(get_db)):
    if payload.currency.upper() != "INR":
        raise HTTPException(status_code=400, detail="Only INR is supported for now")

    payment = Payment(
        user_id=payload.user_id,
        purpose=payload.purpose,
        purpose_ref_id=payload.purpose_ref_id,
        amount_inr=payload.amount_inr,
        currency=payload.currency.upper(),
        status=PaymentStatus.CREATED,
    )
    db.add(payment)
    db.flush()

    amount_paise = int(round(payload.amount_inr * 100))
    receipt = f"fh_{payload.purpose}_{payment.id}"
    razorpay_client = RazorpayService()
    order = razorpay_client.create_order(amount_paise=amount_paise, currency="INR", receipt=receipt)

    payment.razorpay_order_id = order["id"]
    db.commit()
    db.refresh(payment)

    return CreatePaymentOrderResponse(
        payment_id=payment.id,
        razorpay_order_id=order["id"],
        amount_paise=amount_paise,
        currency="INR",
        key_id=settings.razorpay_key_id,
    )


@router.post("/verify-signature", response_model=VerifyPaymentSignatureResponse)
def verify_payment_signature(payload: VerifyPaymentSignatureRequest, db: Session = Depends(get_db)):
    razorpay_client = RazorpayService()
    is_valid = razorpay_client.verify_signature(
        razorpay_order_id=payload.razorpay_order_id,
        razorpay_payment_id=payload.razorpay_payment_id,
        razorpay_signature=payload.razorpay_signature,
    )
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid payment signature")

    payment = db.query(Payment).filter(Payment.razorpay_order_id == payload.razorpay_order_id).first()
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment record not found")

    payment.razorpay_payment_id = payload.razorpay_payment_id
    payment.status = PaymentStatus.CAPTURED
    db.commit()

    return VerifyPaymentSignatureResponse(valid=True, message="Payment signature verified")

