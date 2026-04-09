from pydantic import BaseModel, Field

from app.models.enums import ListingStatus


class CreateResidueListingPayload(BaseModel):
    residue_type: str = Field(min_length=1, max_length=120)
    quantity_tons: float = Field(gt=0)
    price_per_ton: float = Field(gt=0)
    location_text: str = Field(min_length=1, max_length=255)
    description: str | None = None


class UpdateResidueListingStatusPayload(BaseModel):
    status: ListingStatus


class ResidueListingResponse(BaseModel):
    id: str
    farmer_id: str
    residue_type: str
    quantity_tons: float
    price_per_ton: float
    location_text: str
    status: ListingStatus
    description: str | None
    created_at: str
    updated_at: str


class CreateResidueOrderPayload(BaseModel):
    listing_id: str = Field(min_length=1)
    ordered_quantity_tons: float = Field(gt=0)


class UpdateResidueOrderStatusPayload(BaseModel):
    status: str = Field(min_length=1, max_length=30)


class ResidueOrderResponse(BaseModel):
    id: str
    listing_id: str
    buyer_id: str
    ordered_quantity_tons: float
    total_amount_inr: float
    status: str
    created_at: str
    updated_at: str
