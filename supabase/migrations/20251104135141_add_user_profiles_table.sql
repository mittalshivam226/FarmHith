/*
  # Add User Profiles Table Migration

  ## Overview
  This migration creates a user_profiles table to store centralized user profile information
  collected during the login process after OTP verification.

  ## New Table Created

  ### `user_profiles`
  Stores user profile information linked to Supabase auth.users
  - `id` (uuid, primary key) - Unique profile identifier
  - `user_id` (uuid, foreign key) - References auth.users(id)
  - `name` (text) - Full name of the user
  - `email` (text, nullable) - Email address
  - `phone` (text) - Phone number (from auth)
  - `village` (text, nullable) - Village name
  - `district` (text, nullable) - District name
  - `state` (text, nullable) - State name
  - `address` (text, nullable) - Full address
  - `farm_details` (text, nullable) - Optional farm-specific information
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Row Level Security (RLS) enabled
  - Users can only access their own profile
  - Profile creation requires authentication

  ## Important Notes
  - user_id is unique to ensure one profile per user
  - Basic fields (name, phone) are required
  - Location fields are optional but recommended
  - farm_details is optional for future extensibility
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name text NOT NULL,
  email text,
  phone text NOT NULL,
  village text,
  district text,
  state text,
  address text,
  farm_details text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles table
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_user_profiles_updated_at
      BEFORE UPDATE ON user_profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
