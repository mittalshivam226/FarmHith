from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.contact import ContactMessage
from app.schemas.contact import CreateContactMessageRequest, CreateContactMessageResponse


router = APIRouter(prefix="/contact-messages", tags=["contact"])


@router.post("", response_model=CreateContactMessageResponse)
def create_contact_message(payload: CreateContactMessageRequest, db: Session = Depends(get_db)):
    message = ContactMessage(**payload.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return CreateContactMessageResponse(id=message.id, status=message.status)

