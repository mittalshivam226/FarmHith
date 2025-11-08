-- Seed data for FarmHith database
-- This file contains sample data for development and testing

-- Insert sample bookings
INSERT INTO bookings (
  tracking_id, package_id, farmer_name, mobile, village, district, state,
  crop_type, pickup_type, address, payment_method, payment_status, status
) VALUES
  ('FH001', 'basic', 'Rajesh Kumar', '9876543210', 'Rampur', 'Meerut', 'Uttar Pradesh',
   'wheat', 'pickup', 'Village Rampur, Meerut, UP - 250001', 'cash', 'completed', 'completed'),
  ('FH002', 'premium', 'Sunita Devi', '9876543211', 'Biharipur', 'Muzaffarpur', 'Bihar',
   'rice', 'drop', NULL, 'online', 'pending', 'in_process'),
  ('FH003', 'basic', 'Mohan Singh', '9876543212', 'Jalandhar', 'Jalandhar', 'Punjab',
   'cotton', 'pickup', 'Village Jalandhar, Punjab - 144001', 'cash', 'completed', 'pending'),
  ('FH004', 'comprehensive', 'Priya Sharma', '9876543213', 'Jaipur', 'Jaipur', 'Rajasthan',
   'maize', 'drop', NULL, 'online', 'completed', 'completed'),
  ('FH005', 'premium', 'Amit Patel', '9876543214', 'Ahmedabad', 'Ahmedabad', 'Gujarat',
   'sugarcane', 'pickup', 'Village Ahmedabad, Gujarat - 380001', 'cash', 'pending', 'pending');

-- Insert sample reports
INSERT INTO reports (
  booking_id, tracking_id, status, submitted_date, completed_date,
  ph_level, nitrogen, phosphorus, potassium, organic_carbon,
  recommendations
) VALUES
  ((SELECT id FROM bookings WHERE tracking_id = 'FH001'), 'FH001', 'completed',
   '2024-11-01', '2024-11-05', 6.8, 45.2, 12.5, 180.3, 0.85,
   'Soil pH is slightly acidic. Add lime to increase pH. Nitrogen levels are adequate. Phosphorus is low - apply DAP fertilizer. Potassium is sufficient. Organic carbon is good.'),
  ((SELECT id FROM bookings WHERE tracking_id = 'FH004'), 'FH004', 'completed',
   '2024-11-02', '2024-11-06', 7.2, 38.7, 15.8, 195.4, 0.92,
   'Soil pH is optimal. Nitrogen levels are adequate. Phosphorus is sufficient. Potassium is good. Organic carbon is excellent. Continue current practices.');

-- Insert sample contact messages
INSERT INTO contact_messages (name, email, phone, subject, message, status) VALUES
  ('Rajesh Kumar', 'rajesh@example.com', '9876543210', 'Soil Test Report',
   'I received my soil test report but need clarification on the recommendations.', 'new'),
  ('Sunita Devi', 'sunita@example.com', '9876543211', 'Booking Inquiry',
   'How long does it take to get the soil test results?', 'responded'),
  ('Mohan Singh', 'mohan@example.com', '9876543212', 'Payment Issue',
   'I made payment but status still shows pending.', 'new'),
  ('Priya Sharma', 'priya@example.com', '9876543213', 'General Inquiry',
   'Do you provide soil testing for organic farming?', 'responded'),
  ('Amit Patel', 'amit@example.com', '9876543214', 'Feedback',
   'Great service! The report was very detailed and helpful.', 'closed');

-- Insert sample admin user (for development only)
-- Note: In production, this should be created through proper auth flow
-- Password: admin123 (hashed)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  invited_at, confirmation_token, confirmation_sent_at, recovery_token,
  recovery_sent_at, email_change_token_new, email_change, email_change_sent_at,
  last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin,
  created_at, updated_at, phone, phone_confirmed_at, phone_change,
  phone_change_token, phone_change_sent_at, email_change_token_current,
  email_change_confirm_status, banned_until, reauthentication_token,
  reauthentication_sent_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '550e8400-e29b-41d4-a716-446655440000',
  'authenticated',
  'authenticated',
  'admin@farmhith.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'admin123'
  NOW(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin", "full_name": "FarmHith Admin"}',
  FALSE,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL
);

-- Update the user metadata to include admin role
UPDATE auth.users
SET raw_user_meta_data = '{"role": "admin", "full_name": "FarmHith Admin"}'
WHERE email = 'admin@farmhith.com';
