# FarmHith Execution Plan (MySQL + FastAPI + Razorpay)

## Phase 0: Foundation (In Progress)
- [x] Capture product scope and role definitions (Farmer, Lab, Buyer)
- [x] Select payment gateway: Razorpay
- [x] Scaffold backend folder with FastAPI app entrypoint
- [x] Add MySQL SQLAlchemy models for users, soil requests/reports, residue listings/orders, payments
- [x] Add Razorpay order creation + signature verification endpoints
- [ ] Add Alembic migrations for production-safe schema evolution

## Phase 1: Auth and Roles
- [ ] Replace Supabase OTP flow with backend-owned auth service
- [ ] Implement role-based signup (single flow with role selection)
- [ ] Implement JWT access/refresh tokens
- [ ] Add route guards for Farmer/Lab/Buyer/Admin APIs
- [ ] Add basic admin bootstrap script

## Phase 2: Soil Intelligence
- [ ] Farmer can create soil test request
- [ ] Lab discovery and assignment flow
- [ ] Lab accepts/rejects request and uploads report parameters (N, P, K, pH, moisture)
- [ ] Farmer can view report history and recommendations
- [ ] Add status timeline and notifications

## Phase 3: Crop Residue Marketplace
- [ ] Farmer creates residue listing (type, quantity, location, expected price)
- [ ] Buyer browsing/filter/search
- [ ] Buyer places order intent
- [ ] Farmer confirms order and logistics window
- [ ] Buyer/farmer order history views

## Phase 4: Payments (Razorpay)
- [ ] Soil test checkout from frontend using backend-created Razorpay orders
- [ ] Residue order payment flow
- [ ] Webhook endpoint for payment capture/failed events
- [ ] Settlement status and transaction history in dashboards
- [ ] Refund workflow hooks

## Phase 5: Matching and Ranking
- [ ] Implement distance-aware matching
- [ ] Implement demand-supply prioritization
- [ ] Rank by distance, price, availability (system defaults)
- [ ] Add observable matching logs for tuning

## Phase 6: Frontend Modernization
- [ ] Move from local page-switch navigation to `react-router-dom`
- [ ] Split dashboards by role (Farmer/Lab/Buyer)
- [ ] Replace placeholder/mock data with API integration
- [ ] Improve low-literacy UX (clear labels, fewer steps, larger controls)

## Phase 7: Multilingual Support
- [ ] Add i18n framework (`react-i18next`)
- [ ] Language toggle: English / Hindi first
- [ ] Externalize all UI strings
- [ ] Add translation QA checklist for farming terms

## Phase 8: Quality and Launch
- [ ] Backend integration tests (API + DB)
- [ ] E2E smoke tests for booking, report, listing, checkout
- [ ] Observability: request logs, payment logs, error alerts
- [ ] Staging deployment and pilot rollout checklist
