from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.contact import ContactMessage
from app.schemas.contact import (
    ContactMessageResponse,
    CreateContactMessageRequest,
    CreateContactMessageResponse,
    UpdateContactMessageStatusRequest,
)


router = APIRouter(prefix="/contact-messages", tags=["contact"])


@router.post("", response_model=CreateContactMessageResponse)
def create_contact_message(payload: CreateContactMessageRequest, db: Session = Depends(get_db)):
    message = ContactMessage(**payload.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return CreateContactMessageResponse(id=message.id, status=message.status)


@router.get("", response_model=list[ContactMessageResponse])
def list_contact_messages(db: Session = Depends(get_db)):
    messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return [
        ContactMessageResponse(
            id=message.id,
            name=message.name,
            email=message.email,
            phone=message.phone,
            subject=message.subject,
            message=message.message,
            status=message.status,
            created_at=message.created_at.isoformat(),
        )
        for message in messages
    ]


@router.patch("/{message_id}/status", response_model=ContactMessageResponse)
def update_contact_message_status(
    message_id: str,
    payload: UpdateContactMessageStatusRequest,
    db: Session = Depends(get_db),
):
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Contact message not found")

    message.status = payload.status
    db.add(message)
    db.commit()
    db.refresh(message)

    return ContactMessageResponse(
        id=message.id,
        name=message.name,
        email=message.email,
        phone=message.phone,
        subject=message.subject,
        message=message.message,
        status=message.status,
        created_at=message.created_at.isoformat(),
    )
