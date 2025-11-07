# Backend and Database Improvements TODO

## 1. Database Security Fixes
- [x] Create new migration to fix RLS policies for proper data access control
- [ ] Add admin authentication setup in Supabase
- [x] Restrict report access to authenticated users or verified tracking IDs

## 2. API Enhancements
- [x] Add input validation to all API functions using Zod schema validation
- [ ] Enhance error handling with more specific error messages
- [ ] Add rate limiting considerations (document for future implementation)

## 3. Admin Functionality
- [ ] Create admin authentication service
- [x] Add admin API functions for managing bookings and reports
- [x] Add functions for updating booking/report status
- [x] Add contact message management for admins

## 4. Code Quality
- [x] Add TypeScript types for all API responses
- [ ] Improve logging in API functions
- [x] Add JSDoc comments to all functions

## 5. Testing and Validation
- [ ] Test all API functions with edge cases
- [ ] Verify database constraints and triggers work correctly
- [ ] Test RLS policies with different user roles
