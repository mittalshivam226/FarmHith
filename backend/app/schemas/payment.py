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
