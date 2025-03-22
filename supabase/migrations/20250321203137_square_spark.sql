/*
  # Fix profile permissions

  1. Changes
    - Drop existing RLS policies for profiles table to avoid conflicts
    - Create new policies that properly handle all CRUD operations
    - Ensure users can only access and modify their own profiles
    - Allow admins to view all profiles

  2. Security
    - Enable RLS on profiles table (in case it wasn't enabled)
    - Add comprehensive policies for authenticated users
*/

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create new policies
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

-- Admin policies
CREATE POLICY "Enable read access for admins to all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE role = 'admin'
    )
  );