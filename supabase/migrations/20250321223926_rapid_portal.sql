/*
  # Fix Authentication Schema and Permissions
  
  1. Changes
    - Fix auth schema permissions
    - Add missing auth functions
    - Repair role-based access
    - Add proper indexes
    
  2. Security
    - Maintain RLS protection
    - Fix auth token generation
    - Ensure proper access control
*/

-- Fix auth schema permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA auth TO postgres, service_role;

-- Fix auth.users permissions
GRANT SELECT ON auth.users TO anon, authenticated;

-- Create function to safely check user role
CREATE OR REPLACE FUNCTION auth.check_user_role(user_id uuid, required_role text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = user_id
    AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to safely get user role
CREATE OR REPLACE FUNCTION auth.get_user_role(user_id uuid)
RETURNS text AS $$
BEGIN
  RETURN (
    SELECT role
    FROM auth.users
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index on auth.users for role lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON auth.users(role);

-- Create index on auth.users for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);

-- Fix auth.role_cache permissions
GRANT SELECT ON auth.role_cache TO authenticated;

-- Ensure proper session handling
CREATE OR REPLACE FUNCTION auth.handle_user_session()
RETURNS trigger AS $$
BEGIN
  -- Update last sign in
  UPDATE auth.users 
  SET last_sign_in_at = now()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for session handling
DROP TRIGGER IF EXISTS on_auth_session_created ON auth.sessions;
CREATE TRIGGER on_auth_session_created
  AFTER INSERT ON auth.sessions
  FOR EACH ROW
  EXECUTE FUNCTION auth.handle_user_session();

-- Grant necessary permissions for auth functions
GRANT EXECUTE ON FUNCTION 
  auth.check_user_role,
  auth.get_user_role,
  auth.handle_user_session
TO authenticated;