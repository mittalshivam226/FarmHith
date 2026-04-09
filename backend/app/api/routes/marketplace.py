from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.enums import ListingStatus, UserRole
from app.models.residue_listing import ResidueListing, ResidueOrder
from app.models.user import User
from app.schemas.marketplace import (
    CreateResidueListingPayload,
    CreateResidueOrderPayload,
    ResidueListingResponse,
    ResidueOrderResponse,
    UpdateResidueListingStatusPayload,
    UpdateResidueOrderStatusPayload,
)


router = APIRouter(prefix="/marketplace", tags=["marketplace"])


def _listing_response(item: ResidueListing) -> ResidueListingResponse:
    return ResidueListingResponse(
        id=item.id,
        farmer_id=item.farmer_id,
        residue_type=item.residue_type,
        quantity_tons=float(item.quantity_tons),
        price_per_ton=float(item.price_per_ton),
        location_text=item.location_text,
        status=item.status,
        description=item.description,
        created_at=item.created_at.isoformat(),
        updated_at=item.updated_at.isoformat(),
    )


def _order_response(item: ResidueOrder) -> ResidueOrderResponse:
    return ResidueOrderResponse(
        id=item.id,
        listing_id=item.listing_id,
        buyer_id=item.buyer_id,
        ordered_quantity_tons=float(item.ordered_quantity_tons),
        total_amount_inr=float(item.total_amount_inr),
        status=item.status,
        created_at=item.created_at.isoformat(),
        updated_at=item.updated_at.isoformat(),
    )


@router.post("/listings", response_model=ResidueListingResponse)
def create_listing(
    payload: CreateResidueListingPayload,
    current_user: User = Depends(require_roles(UserRole.FARMER)),
    db: Session = Depends(get_db),
):
    listing = ResidueListing(
        farmer_id=current_user.id,
        residue_type=payload.residue_type.strip(),
        quantity_tons=payload.quantity_tons,
        price_per_ton=payload.price_per_ton,
        location_text=payload.location_text.strip(),
        description=payload.description.strip() if payload.description else None,
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return _listing_response(listing)


@router.get("/listings", response_model=list[ResidueListingResponse])
def list_listings(
    status_filter: ListingStatus | None = Query(ListingStatus.ACTIVE, alias="status"),
    db: Session = Depends(get_db),
):
    query = db.query(ResidueListing)
    if status_filter is not None:
        query = query.filter(ResidueListing.status == status_filter)
    items = query.order_by(ResidueListing.created_at.desc()).all()
    return [_listing_response(item) for item in items]


@router.patch("/listings/{listing_id}/status", response_model=ResidueListingResponse)
def update_listing_status(
    listing_id: str,
    payload: UpdateResidueListingStatusPayload,
    current_user: User = Depends(require_roles(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    listing = db.query(ResidueListing).filter(ResidueListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    if current_user.role == UserRole.FARMER and listing.farmer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized for this listing")

    listing.status = payload.status
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return _listing_response(listing)


@router.post("/orders", response_model=ResidueOrderResponse)
def create_order(
    payload: CreateResidueOrderPayload,
    current_user: User = Depends(require_roles(UserRole.BUYER)),
    db: Session = Depends(get_db),
):
    listing = db.query(ResidueListing).filter(ResidueListing.id == payload.listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    if listing.status != ListingStatus.ACTIVE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Listing is not active")

    available_quantity = float(listing.quantity_tons)
    if payload.ordered_quantity_tons > available_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only {available_quantity:.2f} tons are available",
        )

    total_amount_inr = payload.ordered_quantity_tons * float(listing.price_per_ton)
    order = ResidueOrder(
        listing_id=listing.id,
        buyer_id=current_user.id,
        ordered_quantity_tons=payload.ordered_quantity_tons,
        total_amount_inr=total_amount_inr,
        status="created",
    )
    db.add(order)

    remaining = available_quantity - payload.ordered_quantity_tons
    listing.quantity_tons = max(remaining, 0.0)
    listing.status = ListingStatus.SOLD if remaining <= 0 else ListingStatus.RESERVED
    db.add(listing)

    db.commit()
    db.refresh(order)
    return _order_response(order)


@router.get("/orders/my", response_model=list[ResidueOrderResponse])
def list_my_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(ResidueOrder)
    if current_user.role == UserRole.BUYER:
        query = query.filter(ResidueOrder.buyer_id == current_user.id)
    elif current_user.role == UserRole.FARMER:
        query = query.join(ResidueListing, ResidueListing.id == ResidueOrder.listing_id).filter(
            ResidueListing.farmer_id == current_user.id
        )
    elif current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")

    items = query.order_by(ResidueOrder.created_at.desc()).all()
    return [_order_response(item) for item in items]


@router.patch("/orders/{order_id}/status", response_model=ResidueOrderResponse)
def update_order_status(
    order_id: str,
    payload: UpdateResidueOrderStatusPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    order = db.query(ResidueOrder).filter(ResidueOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    listing = db.query(ResidueListing).filter(ResidueListing.id == order.listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Related listing not found")

    can_update = (
        current_user.role == UserRole.ADMIN
        or (current_user.role == UserRole.BUYER and order.buyer_id == current_user.id)
        or (current_user.role == UserRole.FARMER and listing.farmer_id == current_user.id)
    )
    if not can_update:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this order")

    order.status = payload.status.strip()
    db.add(order)
    db.commit()
    db.refresh(order)
    return _order_response(order)
