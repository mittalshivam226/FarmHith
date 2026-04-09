from pydantic import BaseModel, Field

from app.models.enums import SoilRequestStatus


class CreateSoilRequestPayload(BaseModel):
    crop_type: str = Field(min_length=1, max_length=120)
    pickup_type: str = Field(min_length=1, max_length=20)
    notes: str | None = None


class AssignLabPayload(BaseModel):
    assigned_lab_id: str = Field(min_length=1)


class UpdateSoilRequestStatusPayload(BaseModel):
    status: SoilRequestStatus


class SoilRequestResponse(BaseModel):
    id: str
    tracking_id: str
    farmer_id: str
    assigned_lab_id: str | None
    crop_type: str
    pickup_type: str
    status: SoilRequestStatus
    notes: str | None
    created_at: str
    updated_at: str


class UpsertSoilReportPayload(BaseModel):
    soil_request_id: str = Field(min_length=1)
    submitted_date: str | None = None
    completed_date: str | None = None
    ph_level: float | None = None
    nitrogen: float | None = None
    phosphorus: float | None = None
    potassium: float | None = None
    moisture: float | None = None
    recommendations: str | None = None
    report_pdf_url: str | None = None


class SoilReportResponse(BaseModel):
    id: str
    soil_request_id: str
    submitted_date: str
    completed_date: str | None
    ph_level: float | None
    nitrogen: float | None
    phosphorus: float | None
    potassium: float | None
    moisture: float | None
    recommendations: str | None
    report_pdf_url: str | None
    created_at: str
    updated_at: str
