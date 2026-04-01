from pydantic import BaseModel


class ReportResponse(BaseModel):
    id: str
    booking_id: str | None = None
    tracking_id: str
    status: str
    submitted_date: str | None = None
    completed_date: str | None = None
    ph_level: float | None = None
    nitrogen: float | None = None
    phosphorus: float | None = None
    potassium: float | None = None
    organic_carbon: float | None = None
    pdf_url: str | None = None
    recommendations: str | None = None
    created_at: str
    updated_at: str


class UpsertReportRequest(BaseModel):
    booking_id: str | None = None
    tracking_id: str
    status: str | None = None
    submitted_date: str | None = None
    completed_date: str | None = None
    ph_level: float | None = None
    nitrogen: float | None = None
    phosphorus: float | None = None
    potassium: float | None = None
    organic_carbon: float | None = None
    pdf_url: str | None = None
    recommendations: str | None = None
