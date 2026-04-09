from pydantic import BaseModel, Field


class CreatePaymentOrderRequest(BaseModel):
    user_id: str | None = None
    purpose: str = Field(min_length=1, description="soil_test or residue_order")
    purpose_ref_id: str = Field(min_length=1)
    amount_inr: float = Field(gt=0)
    currency: str = Field(default="INR")


class CreatePaymentOrderResponse(BaseModel):
    payment_id: str
    razorpay_order_id: str
    amount_paise: int
    currency: str
    key_id: str


class VerifyPaymentSignatureRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class VerifyPaymentSignatureResponse(BaseModel):
    valid: bool
    message: str


class PaymentResponse(BaseModel):
    id: str
    user_id: str | None
    purpose: str
    purpose_ref_id: str
    amount_inr: float
    currency: str
    status: str
    razorpay_order_id: str | None
    razorpay_payment_id: str | None
    created_at: str
    updated_at: str


class PaymentWebhookResponse(BaseModel):
    status: str
    message: str
