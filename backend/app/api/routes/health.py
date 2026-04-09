from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db


router = APIRouter()


@router.get("/health")
def health_check(db: Session = Depends(get_db)) -> dict[str, str]:
    db_ok = "ok"
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        db_ok = "error"

    status = "ok" if db_ok == "ok" else "degraded"
    return {
        "status": status,
        "environment": settings.app_env,
        "database": db_ok,
    }
