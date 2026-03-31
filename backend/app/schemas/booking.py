from pydantic import BaseModel


class CreateBookingRequest(BaseModel):
    package_id: str
    tracking_id: str
    farmer_name: str
    mobile: str
    village: str
    district: str
    state: str
    crop_type: str
    pickup_type: str
    address: str | None = None
    payment_method: str
    payment_status: str = "pending"
    status: str = "pending"


class CreateBookingResponse(BaseModel):
    id: str
    tracking_id: str
    status: str
    payment_status: str

