-- Add admin users table for proper admin management
-- This migration creates a dedicated table for admin users

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  permissions jsonb DEFAULT '{
    "bookings": {"read": true, "write": true, "delete": false},
    "reports": {"read": true, "write": true, "delete": false},
    "contacts": {"read": true, "write": true, "delete": false},
    "analytics": {"read": true, "write": false, "delete": false}
  }',
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users table
-- Only authenticated admins can view admin users
CREATE POLICY "Admins can manage admin users"
  ON admin_users FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'super_admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'super_admin');

-- Function to automatically create admin user record when user signs up with admin role
CREATE OR REPLACE FUNCTION create_admin_user_record()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user has admin role in metadata
  IF NEW.raw_user_meta_data ->> 'role' IN ('admin', 'super_admin') THEN
    INSERT INTO admin_users (user_id, email, full_name, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
      COALESCE(NEW.raw_user_meta_data ->> 'role', 'admin')
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create admin user records
DROP TRIGGER IF EXISTS on_auth_user_created_create_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_create_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_admin_user_record();

-- Function to update last_login for admin users
CREATE OR REPLACE FUNCTION update_admin_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE admin_users
  SET last_login = now()
  WHERE user_id = NEW.id AND EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = NEW.id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating last login
DROP TRIGGER IF EXISTS on_auth_user_signin_update_admin_login ON auth.users;
CREATE TRIGGER on_auth_user_signin_update_admin_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (NEW.last_sign_in_at IS NOT NULL AND OLD.last_sign_in_at IS NULL)
  EXECUTE FUNCTION update_admin_last_login();

-- Create trigger for updated_at on admin_users
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
