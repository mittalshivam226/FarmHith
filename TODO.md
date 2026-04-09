# FarmHith Execution Plan (MySQL + FastAPI + Razorpay)

## Phase 0: Foundation (In Progress)
- [x] Capture product scope and role definitions (Farmer, Lab, Buyer)
- [x] Select payment gateway: Razorpay
- [x] Scaffold backend folder with FastAPI app entrypoint
- [x] Add MySQL SQLAlchemy models for users, soil requests/reports, residue listings/orders, payments
- [x] Add Razorpay order creation + signature verification endpoints
- [x] Add Alembic scaffolding for production-safe schema evolution

## Phase 1: Auth and Roles
- [x] Replace Supabase OTP flow with backend-owned auth service
- [x] Implement role-based signup (single flow with role selection)
- [x] Implement JWT access/refresh tokens
- [x] Add route guards for Farmer/Lab/Buyer/Admin APIs
- [x] Add basic admin bootstrap script

## Phase 2: Soil Intelligence
- [x] Farmer can create soil test request
- [x] Lab assignment flow (admin assigns lab; role-based list APIs)
- [x] Lab accepts/rejects request and uploads report parameters (N, P, K, pH, moisture)
- [x] Farmer can view report by tracking and recommendations
- [ ] Add status timeline and notifications

## Phase 3: Crop Residue Marketplace
- [x] Farmer creates residue listing (type, quantity, location, expected price)
- [x] Buyer browsing/filter (status)
- [x] Buyer places order intent
- [ ] Farmer confirms order and logistics window
- [x] Buyer/farmer order history views

## Phase 4: Payments (Razorpay)
- [x] Soil test checkout from frontend using backend-created Razorpay orders
- [ ] Residue order payment flow
- [x] Webhook endpoint for payment capture/failed events
- [x] Payment history endpoint for dashboard integration
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
