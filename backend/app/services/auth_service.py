from datetime import datetime, timedelta, timezone
from hashlib import sha256
import hmac
import re
import secrets

import jwt
from jwt import InvalidTokenError

from app.core.config import settings


PHONE_SANITIZE_RE = re.compile(r"[\s\-\(\)]")
DIGITS_ONLY_RE = re.compile(r"^\d+$")


def normalize_phone(raw_phone: str) -> str:
    if not raw_phone:
        raise ValueError("Phone number is required")

    phone = PHONE_SANITIZE_RE.sub("", raw_phone.strip())
    country_code = settings.default_country_code.strip()
    if not country_code.startswith("+"):
        country_code = f"+{country_code}"

    if phone.startswith("+"):
        if not DIGITS_ONLY_RE.match(phone[1:]):
            raise ValueError("Phone number must contain only digits")
        return phone

    if DIGITS_ONLY_RE.match(phone):
        if len(phone) == 10:
            return f"{country_code}{phone}"
        if country_code == "+91" and len(phone) == 12 and phone.startswith("91"):
            return f"+{phone}"
        return f"{country_code}{phone}"

    raise ValueError("Invalid phone number format")


def generate_otp() -> str:
    if settings.otp_dev_static_code:
        return settings.otp_dev_static_code
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_otp(phone: str, otp: str) -> str:
    payload = f"{phone}:{otp}".encode("utf-8")
    secret = settings.otp_secret_key.encode("utf-8")
    return hmac.new(secret, payload, sha256).hexdigest()


def send_otp(phone: str, otp: str) -> None:
    # Console mode is intentionally default for local development and testing.
    if settings.otp_mode == "console":
        print(f"[OTP] phone={phone} otp={otp}")
        return
    raise RuntimeError("SMS provider is not configured. Set otp_mode=console or integrate provider mode.")


def create_token(subject: str, token_type: str, expires_delta: timedelta, claims: dict | None = None) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
    }
    if claims:
        payload.update(claims)
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str, expected_type: str | None = None) -> dict:
    payload = jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[settings.jwt_algorithm],
    )
    if expected_type and payload.get("type") != expected_type:
        raise InvalidTokenError("Invalid token type")
    return payload
