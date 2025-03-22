/*
  # Fix infinite recursion in users policies

  1. Changes
    - Remove recursive policy checks that cause infinite loops
    - Implement role-based access using a materialized role check
    - Simplify policy definitions for better performance

  2. Security
    - Maintain RLS on auth.users table
    - Preserve user data privacy
    - Keep admin access functionality
*/

-- Create a function to safely check admin role
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
BEGIN
  -- Direct role check without recursion
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND role = 'admin'::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own data" ON auth.users;
DROP POLICY IF EXISTS "Admins can view all user data" ON auth.users;

-- Recreate policies without recursion
CREATE POLICY "Users can view their own data"
ON auth.users FOR SELECT
TO authenticated
USING (
  id = auth.uid() -- Direct user check
  OR auth.is_admin() -- Use the function instead of nested exists
);

-- No need for separate admin policy since it's handled in the function