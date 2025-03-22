/*
  # Fix role policies without altering column type
  
  1. Changes
    - Drop existing policies that depend on role column
    - Create new policies with proper role checks
    - Update admin users' roles
    - Fix permissions and grants
    
  2. Security
    - Maintain RLS protection
    - Keep existing permissions
    - Ensure proper role checks
*/

-- Drop policies that depend on role column
DROP POLICY IF EXISTS "Admins can view all progress" ON enrollment_progress;
DROP POLICY IF EXISTS "Enable admin management" ON bootcamps;
DROP POLICY IF EXISTS "Enable read access for admins to all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all interactions" ON bootcamp_interactions;

-- Create new policies with safe role checks
CREATE POLICY "Admins can view all progress"
ON enrollment_progress
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_app_meta_data->>'role' = 'admin'
  )
);

CREATE POLICY "Enable admin management"
ON bootcamps
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_app_meta_data->>'role' = 'admin'
  )
);

CREATE POLICY "Enable read access for admins to all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_app_meta_data->>'role' = 'admin'
  )
);

CREATE POLICY "Admins can view all interactions"
ON bootcamp_interactions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_app_meta_data->>'role' = 'admin'
  )
);

-- Update admin users
UPDATE auth.users
SET raw_app_meta_data = 
  CASE 
    WHEN raw_app_meta_data IS NULL THEN 
      '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb
    ELSE 
      raw_app_meta_data || '{"role":"admin"}'::jsonb
  END
WHERE email IN ('twobrosgms@gmail.com', 'admin@kodigo.org', 'superadmin@kodigo.org');

-- Create function to check admin role safely
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1
      FROM auth.users
      WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION auth.is_admin TO authenticated;
GRANT USAGE ON SCHEMA auth TO authenticated;