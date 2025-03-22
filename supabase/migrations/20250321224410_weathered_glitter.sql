/*
  # Fix authentication system and create admin user
  
  1. Changes
    - Fix auth schema permissions
    - Create admin user safely
    - Set up proper role checks
    - Fix profile creation
    
  2. Security
    - Ensure proper permissions
    - Set up secure authentication
    - Create admin user with proper role
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

-- Create admin user with UUID
DO $$
DECLARE
  admin_id uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
BEGIN
  -- Create admin user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    role,
    aud,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    last_sign_in_at
  ) VALUES (
    admin_id,
    '00000000-0000-0000-0000-000000000000',
    'superadmin@kodigo.org',
    crypt('Kodigo2025Admin!', gen_salt('bf')),
    now(),
    'admin',
    'authenticated',
    '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
    '{"full_name":"Super Admin"}'::jsonb,
    now(),
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    role = EXCLUDED.role;

  -- Create or update profile
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    created_at
  ) VALUES (
    admin_id,
    'superadmin@kodigo.org',
    'Super',
    'Admin',
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;