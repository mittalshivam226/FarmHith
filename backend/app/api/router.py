from fastapi import APIRouter

from app.api.routes.bookings import router as bookings_router
from app.api.routes.contact import router as contact_router
from app.api.routes.auth import router as auth_router
from app.api.routes.health import router as health_router
from app.api.routes.marketplace import router as marketplace_router
from app.api.routes.payments import router as payments_router
from app.api.routes.reports import router as reports_router
from app.api.routes.soil import router as soil_router


api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(bookings_router)
api_router.include_router(reports_router)
api_router.include_router(contact_router)
api_router.include_router(payments_router)
api_router.include_router(soil_router)
api_router.include_router(marketplace_router)
