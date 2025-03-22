/*
  # Fix users table permissions

  1. Changes
    - Add policies for auth.users table
    - Grant proper permissions to authenticated users
    - Fix admin access to user data

  2. Security
    - Enable RLS on auth.users table
    - Add policies for authenticated users to view their own data
    - Add policies for admins to view all user data
*/

-- Enable RLS on users table
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own data" ON auth.users;
DROP POLICY IF EXISTS "Admins can view all user data" ON auth.users;

-- Create policies for users to access their own data
CREATE POLICY "Users can view their own data"
ON auth.users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create admin policy
CREATE POLICY "Admins can view all user data"
ON auth.users FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
  )
);

-- Grant necessary permissions
GRANT SELECT ON auth.users TO authenticated;
GRANT USAGE ON SCHEMA auth TO authenticated;