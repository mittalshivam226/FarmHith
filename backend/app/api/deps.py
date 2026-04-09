from collections.abc import Callable

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import InvalidTokenError
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.enums import UserRole
from app.models.user import User
from app.services.auth_service import decode_token


bearer_security = HTTPBearer(auto_error=False)


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


def require_roles(*allowed_roles: UserRole) -> Callable[[User], User]:
    def dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            allowed = ", ".join(role.value for role in allowed_roles)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient role. Allowed roles: {allowed}",
            )
        return current_user

    return dependency
