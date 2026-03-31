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

