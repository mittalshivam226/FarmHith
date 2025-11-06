-- Fix RLS policies for better security
-- This migration updates the Row Level Security policies to properly restrict access

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view reports" ON reports;
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;

-- Create improved policies for bookings
-- Allow anyone to create bookings (public registration)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow users to view their own bookings by tracking_id and mobile verification
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO anon
  USING (
    tracking_id = current_setting('request.jwt.claims', true)::json->>'tracking_id' OR
    mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
  );

-- Allow users to update their own bookings
CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  TO anon
  USING (
    tracking_id = current_setting('request.jwt.claims', true)::json->>'tracking_id' OR
    mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
  )
  WITH CHECK (
    tracking_id = current_setting('request.jwt.claims', true)::json->>'tracking_id' OR
    mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
  );

-- Create improved policies for reports
-- Allow users to view reports for their bookings
CREATE POLICY "Users can view their reports"
  ON reports FOR SELECT
  TO anon
  USING (
    tracking_id IN (
      SELECT b.tracking_id FROM bookings b
      WHERE b.mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    )
  );

-- Allow authenticated admins to manage all reports
CREATE POLICY "Admins can manage reports"
  ON reports FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create policies for contact_messages
-- Allow anyone to submit contact messages
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated admins to view and manage contact messages
CREATE POLICY "Admins can manage contact messages"
  ON contact_messages FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create admin role and policies for bookings management
CREATE POLICY "Admins can manage bookings"
  ON bookings FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
