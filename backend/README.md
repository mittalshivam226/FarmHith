# FarmHith Backend (FastAPI + MySQL)

This backend now covers core FarmHith modules end-to-end:

- OTP + JWT auth
- Role-based access (`farmer`, `lab`, `buyer`, `admin`)
- Soil requests and lab report workflows
- Crop residue marketplace (listings + orders)
- Soil test booking and report APIs
- Razorpay payment order, signature verification, webhook sync, and history

## 1. Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

## 2. Run API

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health check:

- `GET /api/v1/health`

## 3. Authentication (OTP + JWT)

- `POST /api/v1/auth/otp/request`
- `POST /api/v1/auth/otp/verify`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`
- `PUT /api/v1/auth/profile`
- `PATCH /api/v1/auth/users/{user_id}/role` (admin)
- `POST /api/v1/auth/logout`

Default mode is `otp_mode=console` for local development, which prints OTP to backend logs.

## 4. Soil Intelligence APIs

- `POST /api/v1/soil/requests` (farmer)
- `GET /api/v1/soil/requests` (role-aware list)
- `GET /api/v1/soil/requests/{request_id}`
- `PATCH /api/v1/soil/requests/{request_id}/assign-lab` (admin)
- `PATCH /api/v1/soil/requests/{request_id}/status` (lab/admin)
- `POST /api/v1/soil/reports` (lab/admin upsert)
- `GET /api/v1/soil/reports/by-tracking?tracking_id=...`

## 5. Crop Residue Marketplace APIs

- `POST /api/v1/marketplace/listings` (farmer)
- `GET /api/v1/marketplace/listings`
- `PATCH /api/v1/marketplace/listings/{listing_id}/status` (farmer/admin)
- `POST /api/v1/marketplace/orders` (buyer)
- `GET /api/v1/marketplace/orders/my`
- `PATCH /api/v1/marketplace/orders/{order_id}/status`

## 6. Booking, Reports, Contact

- `POST /api/v1/bookings`
- `GET /api/v1/bookings/by-tracking?tracking_id=...&mobile=...`
- `PATCH /api/v1/bookings/{booking_id}/status` (lab/admin)
- `POST /api/v1/reports/upsert` (lab/admin)
- `GET /api/v1/reports/by-tracking?tracking_id=...`
- `POST /api/v1/contact-messages`
- `GET /api/v1/contact-messages` (admin)

## 7. Payments (Razorpay)

- `POST /api/v1/payments/create-order`
- `POST /api/v1/payments/verify-signature`
- `GET /api/v1/payments/history/my`
- `POST /api/v1/payments/webhook/razorpay`

Set `RAZORPAY_WEBHOOK_SECRET` in `.env` before enabling webhook in production.

## 8. Admin Bootstrap

Create or upgrade an account to admin role:

```bash
python scripts/bootstrap_admin.py --phone +919876543210 --name "FarmHith Admin"
```

## 9. Notes

- `AUTO_CREATE_TABLES=true` creates tables automatically on startup for development.
- For production, keep `AUTO_CREATE_TABLES=false` and use managed migrations.
- Use strong secrets for JWT, OTP, and Razorpay webhook verification.
- `setuptools<81` is pinned because current `razorpay` SDK still imports `pkg_resources`.

Basic Alembic commands:

```bash
alembic revision --autogenerate -m "init"
alembic upgrade head
```
