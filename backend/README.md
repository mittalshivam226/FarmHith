# FarmHith Backend (FastAPI + MySQL)

This folder contains the backend foundation for FarmHith with:

- FastAPI REST API
- MySQL (via SQLAlchemy ORM)
- Multi-role user model (`farmer`, `lab`, `buyer`, `admin`)
- Soil request and residue marketplace core entities
- Razorpay order creation + signature verification endpoints

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

Health endpoint:

`GET /api/v1/health`

Booking endpoint:

`POST /api/v1/bookings`

Contact endpoint:

`POST /api/v1/contact-messages`

## 3. Payments (Razorpay)

- `POST /api/v1/payments/create-order`
- `POST /api/v1/payments/verify-signature`

Both endpoints are ready to plug into frontend checkout flow.

## 4. Auth (OTP + JWT)

- `POST /api/v1/auth/otp/request`
- `POST /api/v1/auth/otp/verify`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`
- `PUT /api/v1/auth/profile`
- `POST /api/v1/auth/logout`

Default mode is `otp_mode=console` for local development, which prints OTP to backend logs.

## 5. Notes

- Tables are created automatically on startup for quick bootstrapping.
- Use strong `jwt_secret_key` and `otp_secret_key` values before production.
