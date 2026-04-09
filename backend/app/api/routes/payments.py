import hashlib
import hmac

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.db.session import get_db
from app.models.booking import Booking
from app.models.enums import PaymentStatus
from app.models.payment import Payment
from app.models.residue_listing import ResidueOrder
from app.models.user import User
from app.schemas.payment import (
    CreatePaymentOrderRequest,
    CreatePaymentOrderResponse,
    PaymentResponse,
    PaymentWebhookResponse,
    VerifyPaymentSignatureRequest,
    VerifyPaymentSignatureResponse,
)
from app.services.razorpay_service import RazorpayService


router = APIRouter(prefix="/payments", tags=["payments"])


def to_payment_response(item: Payment) -> PaymentResponse:
    return PaymentResponse(
        id=item.id,
        user_id=item.user_id,
        purpose=item.purpose,
        purpose_ref_id=item.purpose_ref_id,
        amount_inr=float(item.amount_inr),
        currency=item.currency,
        status=item.status.value if hasattr(item.status, "value") else str(item.status),
        razorpay_order_id=item.razorpay_order_id,
        razorpay_payment_id=item.razorpay_payment_id,
        created_at=item.created_at.isoformat(),
        updated_at=item.updated_at.isoformat(),
    )


def sync_purpose_state(payment: Payment, db: Session) -> None:
    if payment.purpose == "soil_test":
        booking = db.query(Booking).filter(Booking.id == payment.purpose_ref_id).first()
        if booking:
            booking.payment_status = payment.status.value if hasattr(payment.status, "value") else str(payment.status)
            if booking.payment_status == PaymentStatus.CAPTURED.value and booking.status == "pending":
                booking.status = "accepted"
            db.add(booking)
    elif payment.purpose == "residue_order":
        order = db.query(ResidueOrder).filter(ResidueOrder.id == payment.purpose_ref_id).first()
        if order:
            if payment.status == PaymentStatus.CAPTURED:
                order.status = "paid"
            elif payment.status == PaymentStatus.FAILED:
                order.status = "payment_failed"
            db.add(order)


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
    sync_purpose_state(payment, db)
    db.commit()

    return VerifyPaymentSignatureResponse(valid=True, message="Payment signature verified")


@router.get("/history/my", response_model=list[PaymentResponse])
def get_my_payment_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Payment)
    role_value = current_user.role.value if hasattr(current_user.role, "value") else str(current_user.role)
    if role_value != "admin":
        query = query.filter(Payment.user_id == current_user.id)
    records = query.order_by(Payment.created_at.desc()).all()
    return [to_payment_response(item) for item in records]


@router.post("/webhook/razorpay", response_model=PaymentWebhookResponse)
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    if not settings.razorpay_webhook_secret:
        raise HTTPException(status_code=500, detail="Razorpay webhook secret is not configured")

    signature = request.headers.get("x-razorpay-signature")
    if not signature:
        raise HTTPException(status_code=400, detail="Missing Razorpay signature header")

    body = await request.body()
    digest = hmac.new(
        settings.razorpay_webhook_secret.encode("utf-8"),
        body,
        hashlib.sha256,
    ).hexdigest()
    if not hmac.compare_digest(digest, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    payload = await request.json()
    event = payload.get("event")
    payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
    razorpay_order_id = payment_entity.get("order_id")
    razorpay_payment_id = payment_entity.get("id")

    if not razorpay_order_id:
        return PaymentWebhookResponse(status="ignored", message="No order id in payload")

    payment = db.query(Payment).filter(Payment.razorpay_order_id == razorpay_order_id).first()
    if not payment:
        return PaymentWebhookResponse(status="ignored", message="Payment record not found")

    if razorpay_payment_id:
        payment.razorpay_payment_id = razorpay_payment_id

    if event == "payment.captured":
        payment.status = PaymentStatus.CAPTURED
    elif event in {"payment.failed", "payment.authorized.failed"}:
        payment.status = PaymentStatus.FAILED
    else:
        return PaymentWebhookResponse(status="ignored", message=f"Event {event} not mapped")

    sync_purpose_state(payment, db)
    db.add(payment)
    db.commit()
    return PaymentWebhookResponse(status="ok", message="Webhook processed")
