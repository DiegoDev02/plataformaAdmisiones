/*
  # Fix Authentication System
  
  1. Changes
    - Fix auth schema permissions
    - Add missing grants
    - Update existing admin user
    - Fix profile handling
    - Add proper session management
    
  2. Security
    - Maintain RLS protection
    - Ensure proper role-based access
    - Fix permission hierarchy
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

-- Update existing admin user if exists
DO $$
DECLARE
  admin_id uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
BEGIN
  -- Update admin user if exists
  UPDATE auth.users SET
    encrypted_password = crypt('Kodigo2025Admin!', gen_salt('bf')),
    role = 'admin',
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
    raw_user_meta_data = '{"full_name":"Super Admin"}'::jsonb,
    updated_at = now()
  WHERE email = 'admin@kodigo.org';

  -- Update profile if exists
  UPDATE public.profiles SET
    first_name = 'Super',
    last_name = 'Admin'
  WHERE email = 'admin@kodigo.org';
END $$;

-- Fix RLS policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Fix session handling
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO authenticated;