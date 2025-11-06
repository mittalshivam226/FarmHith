# Backend and Database Improvements TODO

## 1. Database Security Fixes
- [ ] Create new migration to fix RLS policies for proper data access control
- [ ] Add admin authentication setup in Supabase
- [ ] Restrict report access to authenticated users or verified tracking IDs

## 2. API Enhancements
- [ ] Add input validation to all API functions using Zod schema validation
- [ ] Enhance error handling with more specific error messages
- [ ] Add rate limiting considerations (document for future implementation)

## 3. Admin Functionality
- [ ] Create admin authentication service
- [ ] Add admin API functions for managing bookings and reports
- [ ] Add functions for updating booking/report status
- [ ] Add contact message management for admins

## 4. Code Quality
- [ ] Add TypeScript types for all API responses
- [ ] Improve logging in API functions
- [ ] Add JSDoc comments to all functions

## 5. Testing and Validation
- [ ] Test all API functions with edge cases
- [ ] Verify database constraints and triggers work correctly
- [ ] Test RLS policies with different user roles
