from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.db.session import get_db
from app.models.enums import UserRole
from app.models.report import Report
from app.models.user import User
from app.schemas.report import ReportResponse, UpsertReportRequest


router = APIRouter(prefix="/reports", tags=["reports"])


def to_report_response(report: Report) -> ReportResponse:
    return ReportResponse(
        id=report.id,
        booking_id=report.booking_id,
        tracking_id=report.tracking_id,
        status=report.status,
        submitted_date=report.submitted_date.isoformat() if report.submitted_date else None,
        completed_date=report.completed_date.isoformat() if report.completed_date else None,
        ph_level=float(report.ph_level) if report.ph_level is not None else None,
        nitrogen=float(report.nitrogen) if report.nitrogen is not None else None,
        phosphorus=float(report.phosphorus) if report.phosphorus is not None else None,
        potassium=float(report.potassium) if report.potassium is not None else None,
        organic_carbon=float(report.organic_carbon) if report.organic_carbon is not None else None,
        pdf_url=report.pdf_url,
        recommendations=report.recommendations,
        created_at=report.created_at.isoformat(),
        updated_at=report.updated_at.isoformat(),
    )


def parse_iso_date(value: str | None) -> date | None:
    if not value:
        return None
    return date.fromisoformat(value)


@router.get("", response_model=list[ReportResponse])
def list_reports(
    _: User = Depends(require_roles(UserRole.LAB, UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    reports = db.query(Report).order_by(Report.created_at.desc()).all()
    return [to_report_response(report) for report in reports]


@router.get("/by-tracking", response_model=ReportResponse)
def get_report_by_tracking(tracking_id: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.tracking_id == tracking_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")
    return to_report_response(report)


@router.post("/upsert", response_model=ReportResponse)
def upsert_report(
    payload: UpsertReportRequest,
    _: User = Depends(require_roles(UserRole.LAB, UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    report = db.query(Report).filter(Report.tracking_id == payload.tracking_id).first()
    if not report:
        report = Report(
            tracking_id=payload.tracking_id,
            booking_id=payload.booking_id,
            status=payload.status or "pending",
        )
        db.add(report)

    if payload.booking_id is not None:
        report.booking_id = payload.booking_id
    if payload.status is not None:
        report.status = payload.status
    if payload.submitted_date is not None:
        report.submitted_date = parse_iso_date(payload.submitted_date)
    if payload.completed_date is not None:
        report.completed_date = parse_iso_date(payload.completed_date)
    if payload.ph_level is not None:
        report.ph_level = payload.ph_level
    if payload.nitrogen is not None:
        report.nitrogen = payload.nitrogen
    if payload.phosphorus is not None:
        report.phosphorus = payload.phosphorus
    if payload.potassium is not None:
        report.potassium = payload.potassium
    if payload.organic_carbon is not None:
        report.organic_carbon = payload.organic_carbon
    if payload.pdf_url is not None:
        report.pdf_url = payload.pdf_url
    if payload.recommendations is not None:
        report.recommendations = payload.recommendations

    db.add(report)
    db.commit()
    db.refresh(report)
    return to_report_response(report)
