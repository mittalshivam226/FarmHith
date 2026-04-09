from datetime import datetime

from pydantic import BaseModel, Field

from app.models.enums import UserRole


class RequestOtpPayload(BaseModel):
    phone: str = Field(min_length=8, max_length=20)


class RequestOtpResponse(BaseModel):
    message: str
    expires_in_seconds: int
    otp_length: int = 6
    dev_otp: str | None = None


class VerifyOtpPayload(BaseModel):
    phone: str = Field(min_length=8, max_length=20)
    otp: str = Field(min_length=4, max_length=8)
    role: UserRole | None = None


class RefreshTokenPayload(BaseModel):
    refresh_token: str


class UpdateProfilePayload(BaseModel):
    name: str
    email: str | None = None
    village: str | None = None
    district: str | None = None
    state: str | None = None
    address: str | None = None


class UpdateUserRolePayload(BaseModel):
    role: UserRole


class AuthUserResponse(BaseModel):
    id: str
    role: str
    phone: str
    name: str
    email: str | None = None
    village: str | None = None
    district: str | None = None
    state: str | None = None
    address: str | None = None
    created_at: datetime
    updated_at: datetime


class TokenBundleResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in_seconds: int


class VerifyOtpResponse(TokenBundleResponse):
    user: AuthUserResponse
    needs_profile_completion: bool


class MessageResponse(BaseModel):
    message: str
