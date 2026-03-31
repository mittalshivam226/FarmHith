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

## 4. Notes

- Tables are created automatically on startup for quick bootstrapping.
- Auth/JWT is intentionally kept as next step so we can align role onboarding with your final UX.
