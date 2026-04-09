from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.enums import SoilRequestStatus, UserRole
from app.models.soil_request import SoilReport, SoilRequest
from app.models.user import User
from app.schemas.soil import (
    AssignLabPayload,
    CreateSoilRequestPayload,
    SoilReportResponse,
    SoilRequestResponse,
    UpdateSoilRequestStatusPayload,
    UpsertSoilReportPayload,
)


router = APIRouter(prefix="/soil", tags=["soil"])


def _request_response(item: SoilRequest) -> SoilRequestResponse:
    return SoilRequestResponse(
        id=item.id,
        tracking_id=item.tracking_id,
        farmer_id=item.farmer_id,
        assigned_lab_id=item.assigned_lab_id,
        crop_type=item.crop_type,
        pickup_type=item.pickup_type,
        status=item.status,
        notes=item.notes,
        created_at=item.created_at.isoformat(),
        updated_at=item.updated_at.isoformat(),
    )


def _report_response(item: SoilReport) -> SoilReportResponse:
    return SoilReportResponse(
        id=item.id,
        soil_request_id=item.soil_request_id,
        submitted_date=item.submitted_date.isoformat(),
        completed_date=item.completed_date.isoformat() if item.completed_date else None,
        ph_level=float(item.ph_level) if item.ph_level is not None else None,
        nitrogen=float(item.nitrogen) if item.nitrogen is not None else None,
        phosphorus=float(item.phosphorus) if item.phosphorus is not None else None,
        potassium=float(item.potassium) if item.potassium is not None else None,
        moisture=float(item.moisture) if item.moisture is not None else None,
        recommendations=item.recommendations,
        report_pdf_url=item.report_pdf_url,
        created_at=item.created_at.isoformat(),
        updated_at=item.updated_at.isoformat(),
    )


def _parse_iso_date(value: str | None) -> date | None:
    if not value:
        return None
    return date.fromisoformat(value)


def _assert_request_access(item: SoilRequest, user: User) -> None:
    if user.role == UserRole.ADMIN:
        return
    if user.role == UserRole.FARMER and item.farmer_id == user.id:
        return
    if user.role == UserRole.LAB and item.assigned_lab_id == user.id:
        return
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized for this request")


@router.post(
    "/requests",
    response_model=SoilRequestResponse,
)
def create_soil_request(
    payload: CreateSoilRequestPayload,
    current_user: User = Depends(require_roles(UserRole.FARMER)),
    db: Session = Depends(get_db),
):
    tracking_id = f"SR{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')[-14:]}"
    request_item = SoilRequest(
        tracking_id=tracking_id,
        farmer_id=current_user.id,
        crop_type=payload.crop_type.strip(),
        pickup_type=payload.pickup_type.strip(),
        notes=payload.notes.strip() if payload.notes else None,
    )
    db.add(request_item)
    db.commit()
    db.refresh(request_item)
    return _request_response(request_item)


@router.get("/requests", response_model=list[SoilRequestResponse])
def list_soil_requests(
    status_filter: SoilRequestStatus | None = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(SoilRequest)
    if current_user.role == UserRole.FARMER:
        query = query.filter(SoilRequest.farmer_id == current_user.id)
    elif current_user.role == UserRole.LAB:
        query = query.filter(SoilRequest.assigned_lab_id == current_user.id)

    if status_filter is not None:
        query = query.filter(SoilRequest.status == status_filter)

    items = query.order_by(SoilRequest.created_at.desc()).all()
    return [_request_response(item) for item in items]


@router.get("/requests/{request_id}", response_model=SoilRequestResponse)
def get_soil_request(
    request_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.query(SoilRequest).filter(SoilRequest.id == request_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soil request not found")
    _assert_request_access(item, current_user)
    return _request_response(item)


@router.patch("/requests/{request_id}/assign-lab", response_model=SoilRequestResponse)
def assign_lab_to_request(
    request_id: str,
    payload: AssignLabPayload,
    _: User = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    item = db.query(SoilRequest).filter(SoilRequest.id == request_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soil request not found")

    lab_user = db.query(User).filter(User.id == payload.assigned_lab_id, User.role == UserRole.LAB).first()
    if not lab_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lab user not found")

    item.assigned_lab_id = payload.assigned_lab_id
    if item.status == SoilRequestStatus.PENDING:
        item.status = SoilRequestStatus.ACCEPTED

    db.add(item)
    db.commit()
    db.refresh(item)
    return _request_response(item)


@router.patch("/requests/{request_id}/status", response_model=SoilRequestResponse)
def update_soil_request_status(
    request_id: str,
    payload: UpdateSoilRequestStatusPayload,
    current_user: User = Depends(require_roles(UserRole.LAB, UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    item = db.query(SoilRequest).filter(SoilRequest.id == request_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soil request not found")

    if current_user.role == UserRole.LAB and item.assigned_lab_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Request is not assigned to this lab")

    item.status = payload.status
    db.add(item)
    db.commit()
    db.refresh(item)
    return _request_response(item)


@router.post("/reports", response_model=SoilReportResponse)
def upsert_soil_report(
    payload: UpsertSoilReportPayload,
    current_user: User = Depends(require_roles(UserRole.LAB, UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    request_item = db.query(SoilRequest).filter(SoilRequest.id == payload.soil_request_id).first()
    if not request_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soil request not found")

    if current_user.role == UserRole.LAB and request_item.assigned_lab_id not in (None, current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Request is not assigned to this lab")

    if request_item.assigned_lab_id is None and current_user.role == UserRole.LAB:
        request_item.assigned_lab_id = current_user.id

    report = db.query(SoilReport).filter(SoilReport.soil_request_id == payload.soil_request_id).first()
    if not report:
        report = SoilReport(
            soil_request_id=payload.soil_request_id,
            submitted_date=_parse_iso_date(payload.submitted_date) or date.today(),
        )
        db.add(report)

    if payload.submitted_date is not None:
        report.submitted_date = _parse_iso_date(payload.submitted_date) or date.today()
    if payload.completed_date is not None:
        report.completed_date = _parse_iso_date(payload.completed_date)
    if payload.ph_level is not None:
        report.ph_level = payload.ph_level
    if payload.nitrogen is not None:
        report.nitrogen = payload.nitrogen
    if payload.phosphorus is not None:
        report.phosphorus = payload.phosphorus
    if payload.potassium is not None:
        report.potassium = payload.potassium
    if payload.moisture is not None:
        report.moisture = payload.moisture
    if payload.recommendations is not None:
        report.recommendations = payload.recommendations
    if payload.report_pdf_url is not None:
        report.report_pdf_url = payload.report_pdf_url

    request_item.status = (
        SoilRequestStatus.COMPLETED if report.completed_date else SoilRequestStatus.REPORT_READY
    )

    db.add(report)
    db.add(request_item)
    db.commit()
    db.refresh(report)
    return _report_response(report)


@router.get("/reports/by-tracking", response_model=SoilReportResponse)
def get_soil_report_by_tracking(
    tracking_id: str = Query(..., min_length=1),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    request_item = db.query(SoilRequest).filter(SoilRequest.tracking_id == tracking_id).first()
    if not request_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soil request not found")
    _assert_request_access(request_item, current_user)

    report = db.query(SoilReport).filter(SoilReport.soil_request_id == request_item.id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soil report not uploaded yet")
    return _report_response(report)
