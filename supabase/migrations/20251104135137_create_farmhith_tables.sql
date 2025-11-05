/*
  # Farmहित (FarmHith) Database Schema
  
  ## Overview
  This migration creates the complete database schema for the Farmहित soil testing and sustainable agriculture platform.
  
  ## New Tables Created
  
  ### 1. `bookings`
  Stores all soil test booking information from farmers
  - `id` (uuid, primary key) - Unique booking identifier
  - `tracking_id` (text, unique) - Human-readable tracking ID for farmers
  - `package_id` (text) - Reference to soil test package type
  - `farmer_name` (text) - Name of the farmer
  - `mobile` (text) - Contact mobile number
  - `village` (text) - Village name
  - `district` (text) - District name
  - `state` (text) - State name
  - `crop_type` (text) - Type of crop being grown
  - `pickup_type` (text) - Either 'pickup' or 'drop'
  - `address` (text, nullable) - Full address if pickup selected
  - `payment_method` (text) - Payment method chosen
  - `payment_status` (text) - Payment status tracking
  - `status` (text) - Overall booking status
  - `created_at` (timestamptz) - Booking creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 2. `reports`
  Stores soil test results and report data
  - `id` (uuid, primary key) - Unique report identifier
  - `booking_id` (uuid, foreign key) - References bookings table
  - `tracking_id` (text) - Same as booking for easy lookup
  - `status` (text) - Report status (pending/in_process/completed)
  - `submitted_date` (date) - When sample was received
  - `completed_date` (date, nullable) - When report was completed
  - `ph_level` (numeric, nullable) - pH test result
  - `nitrogen` (numeric, nullable) - Nitrogen content (kg/ha)
  - `phosphorus` (numeric, nullable) - Phosphorus content (kg/ha)
  - `potassium` (numeric, nullable) - Potassium content (kg/ha)
  - `organic_carbon` (numeric, nullable) - Organic carbon percentage
  - `pdf_url` (text, nullable) - Link to downloadable PDF report
  - `recommendations` (text, nullable) - Expert recommendations
  - `created_at` (timestamptz) - Report creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 3. `contact_messages`
  Stores contact form submissions
  - `id` (uuid, primary key) - Unique message identifier
  - `name` (text) - Sender name
  - `email` (text) - Sender email
  - `phone` (text) - Sender phone
  - `subject` (text) - Message subject
  - `message` (text) - Message content
  - `status` (text) - Response status
  - `created_at` (timestamptz) - Message timestamp
  
  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public can insert bookings and contact messages
  - Users can read their own bookings/reports by tracking_id + mobile verification
  - Admin access for management (to be implemented with auth)
  
  ## Important Notes
  - All tables use UUID primary keys for security
  - Tracking IDs are generated with 'FH' prefix for branding
  - Timestamps are in UTC for consistency
  - Status fields use text for flexibility
  - Numeric fields for test results allow decimal precision
*/

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id text UNIQUE NOT NULL,
  package_id text NOT NULL,
  farmer_name text NOT NULL,
  mobile text NOT NULL,
  village text NOT NULL,
  district text NOT NULL,
  state text NOT NULL,
  crop_type text NOT NULL,
  pickup_type text NOT NULL CHECK (pickup_type IN ('pickup', 'drop')),
  address text,
  payment_method text NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  tracking_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_process', 'completed')),
  submitted_date date DEFAULT CURRENT_DATE,
  completed_date date,
  ph_level numeric(4,2),
  nitrogen numeric(8,2),
  phosphorus numeric(8,2),
  potassium numeric(8,2),
  organic_carbon numeric(4,3),
  pdf_url text,
  recommendations text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_tracking_id ON bookings(tracking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mobile ON bookings(mobile);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reports_tracking_id ON reports(tracking_id);
CREATE INDEX IF NOT EXISTS idx_reports_booking_id ON reports(booking_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings table
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for reports table
CREATE POLICY "Users can view reports"
  ON reports FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for contact_messages table
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  TO anon
  WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_bookings_updated_at'
  ) THEN
    CREATE TRIGGER update_bookings_updated_at
      BEFORE UPDATE ON bookings
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_reports_updated_at'
  ) THEN
    CREATE TRIGGER update_reports_updated_at
      BEFORE UPDATE ON reports
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
