from datetime import datetime, timedelta
import re

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import InvalidTokenError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.enums import UserRole
from app.models.otp_challenge import OtpChallenge
from app.models.user import User
from app.schemas.auth import (
    AuthUserResponse,
    MessageResponse,
    RefreshTokenPayload,
    RequestOtpPayload,
    RequestOtpResponse,
    TokenBundleResponse,
    UpdateProfilePayload,
    VerifyOtpPayload,
    VerifyOtpResponse,
)
from app.services.auth_service import create_token, decode_token, generate_otp, hash_otp, normalize_phone, send_otp


router = APIRouter(prefix="/auth", tags=["auth"])
bearer_security = HTTPBearer(auto_error=False)
OTP_REGEX = re.compile(r"^\d{4,8}$")


def to_user_response(user: User) -> AuthUserResponse:
    return AuthUserResponse(
        id=user.id,
        role=user.role.value if hasattr(user.role, "value") else str(user.role),
        phone=user.phone,
        name=user.name,
        email=user.email,
        village=user.village,
        district=user.district,
        state=user.state,
        address=user.address,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


def issue_token_bundle(user: User) -> TokenBundleResponse:
    common_claims = {
        "phone": user.phone,
        "role": user.role.value if hasattr(user.role, "value") else str(user.role),
    }
    access_token = create_token(
        subject=user.id,
        token_type="access",
        expires_delta=timedelta(minutes=settings.jwt_access_token_exp_minutes),
        claims=common_claims,
    )
    refresh_token = create_token(
        subject=user.id,
        token_type="refresh",
        expires_delta=timedelta(days=settings.jwt_refresh_token_exp_days),
        claims=common_claims,
    )
    return TokenBundleResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in_seconds=settings.jwt_access_token_exp_minutes * 60,
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_security),
    db: Session = Depends(get_db),
) -> User:
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    try:
        payload = decode_token(credentials.credentials, expected_type="access")
        user_id = payload.get("sub")
        if not user_id:
            raise InvalidTokenError("Missing subject")
    except InvalidTokenError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token") from exc

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def _is_profile_incomplete(user: User) -> bool:
    # New users are created with a temporary display name and complete profile after OTP verification.
    return not user.name or user.name.startswith("Farmer ")


@router.post("/otp/request", response_model=RequestOtpResponse)
def request_otp(payload: RequestOtpPayload, db: Session = Depends(get_db)):
    try:
        normalized_phone = normalize_phone(payload.phone)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    now = datetime.utcnow()
    latest = (
        db.query(OtpChallenge)
        .filter(OtpChallenge.phone == normalized_phone)
        .order_by(OtpChallenge.created_at.desc())
        .first()
    )
    if latest:
        elapsed_seconds = int((now - latest.created_at).total_seconds())
        cooldown = settings.otp_resend_cooldown_seconds
        if elapsed_seconds < cooldown:
            remaining = cooldown - elapsed_seconds
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Please wait {remaining} seconds before requesting another OTP.",
            )

    otp_code = generate_otp()
    challenge = OtpChallenge(
        phone=normalized_phone,
        otp_hash=hash_otp(normalized_phone, otp_code),
        max_attempts=settings.otp_max_attempts,
        expires_at=now + timedelta(minutes=settings.otp_expiry_minutes),
    )

    db.add(challenge)
    try:
        send_otp(normalized_phone, otp_code)
    except RuntimeError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc

    db.commit()

    return RequestOtpResponse(
        message="OTP sent successfully",
        expires_in_seconds=settings.otp_expiry_minutes * 60,
        otp_length=len(otp_code),
        dev_otp=otp_code if settings.app_env != "production" else None,
    )


@router.post("/otp/verify", response_model=VerifyOtpResponse)
def verify_otp(payload: VerifyOtpPayload, db: Session = Depends(get_db)):
    try:
        normalized_phone = normalize_phone(payload.phone)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    if not OTP_REGEX.match(payload.otp):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP must be 4 to 8 digits")

    now = datetime.utcnow()
    challenge = (
        db.query(OtpChallenge)
        .filter(
            OtpChallenge.phone == normalized_phone,
            OtpChallenge.consumed_at.is_(None),
        )
        .order_by(OtpChallenge.created_at.desc())
        .first()
    )

    if not challenge:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No active OTP found for this number")

    if challenge.expires_at < now:
        challenge.consumed_at = now
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has expired. Please request a new OTP.")

    if challenge.attempts >= challenge.max_attempts:
        challenge.consumed_at = now
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed attempts. Request a new OTP.",
        )

    if hash_otp(normalized_phone, payload.otp) != challenge.otp_hash:
        challenge.attempts += 1
        if challenge.attempts >= challenge.max_attempts:
            challenge.consumed_at = now
        db.commit()
        if challenge.attempts >= challenge.max_attempts:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many failed attempts. Request a new OTP.",
            )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")

    challenge.consumed_at = now

    user = db.query(User).filter(User.phone == normalized_phone).first()
    if not user:
        user = User(
            role=UserRole.FARMER,
            phone=normalized_phone,
            name=f"Farmer {normalized_phone[-4:]}",
        )
        db.add(user)

    db.commit()
    db.refresh(user)

    token_bundle = issue_token_bundle(user)
    return VerifyOtpResponse(
        access_token=token_bundle.access_token,
        refresh_token=token_bundle.refresh_token,
        token_type=token_bundle.token_type,
        expires_in_seconds=token_bundle.expires_in_seconds,
        user=to_user_response(user),
        needs_profile_completion=_is_profile_incomplete(user),
    )


@router.post("/refresh", response_model=TokenBundleResponse)
def refresh_token(payload: RefreshTokenPayload, db: Session = Depends(get_db)):
    try:
        claims = decode_token(payload.refresh_token, expected_type="refresh")
        user_id = claims.get("sub")
        if not user_id:
            raise InvalidTokenError("Missing subject")
    except InvalidTokenError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return issue_token_bundle(user)


@router.get("/me", response_model=AuthUserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return to_user_response(current_user)


@router.put("/profile", response_model=AuthUserResponse)
def update_profile(
    payload: UpdateProfilePayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.name = payload.name.strip()
    current_user.email = payload.email.strip() if payload.email else None
    current_user.village = payload.village.strip() if payload.village else None
    current_user.district = payload.district.strip() if payload.district else None
    current_user.state = payload.state.strip() if payload.state else None
    current_user.address = payload.address.strip() if payload.address else None

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return to_user_response(current_user)


@router.post("/logout", response_model=MessageResponse)
def logout():
    # Stateless JWT logout; frontend clears local tokens.
    return MessageResponse(message="Logged out successfully")
