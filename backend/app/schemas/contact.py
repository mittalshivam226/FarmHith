from pydantic import BaseModel


class CreateContactMessageRequest(BaseModel):
    name: str
    email: str
    phone: str
    subject: str
    message: str


class CreateContactMessageResponse(BaseModel):
    id: str
    status: str


class ContactMessageResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    subject: str
    message: str
    status: str
    created_at: str


class UpdateContactMessageStatusRequest(BaseModel):
    status: str
