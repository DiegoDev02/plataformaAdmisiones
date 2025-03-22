/*
  # Fix profile and user permissions

  1. Changes
    - Drop existing RLS policies to avoid conflicts
    - Create new policies that properly handle all CRUD operations
    - Add proper user role check for admin access
    - Fix permissions for accessing user data

  2. Security
    - Enable RLS on profiles table
    - Add comprehensive policies for authenticated users
    - Ensure proper access to user data
*/

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for users to their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update access for users to their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert access for users to their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for admins to all profiles" ON profiles;

-- Create new policies with proper user role check
CREATE POLICY "Enable read access for users to their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable update access for users to their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert access for users to their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Admin policies with proper role check
CREATE POLICY "Enable read access for admins to all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;