/*
  # Fix admin role checks without trigger errors

  1. Changes
    - Create a secure function for admin role checks
    - Implement efficient role-based policies
    - Remove problematic trigger conditions
    - Add proper security barriers

  2. Security
    - Maintain RLS protection
    - Preserve admin access functionality
    - Keep user data private
*/

-- Create a secure function to check admin status
CREATE OR REPLACE FUNCTION auth.check_admin_access()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND role = 'admin'::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = auth, pg_temp;

-- Create a table to cache admin status
CREATE TABLE IF NOT EXISTS auth.role_cache (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Function to update role cache
CREATE OR REPLACE FUNCTION auth.update_role_cache()
RETURNS trigger AS $$
BEGIN
  INSERT INTO auth.role_cache (user_id, is_admin, updated_at)
  VALUES (NEW.id, NEW.role = 'admin', now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    is_admin = NEW.role = 'admin',
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for role updates
CREATE TRIGGER update_role_cache_trigger
AFTER INSERT OR UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION auth.update_role_cache();

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own data" ON auth.users;
DROP POLICY IF EXISTS "Admins can view all user data" ON auth.users;

-- Create new efficient policies
CREATE POLICY "Users can view their own data"
ON auth.users FOR SELECT
TO authenticated
USING (
  id = auth.uid() OR -- Direct user check
  EXISTS (
    SELECT 1 
    FROM auth.role_cache 
    WHERE user_id = auth.uid() 
    AND is_admin = true
  )
);

-- Grant necessary permissions
GRANT SELECT ON auth.role_cache TO authenticated;

-- Initial population of role cache
INSERT INTO auth.role_cache (user_id, is_admin)
SELECT id, role = 'admin' 
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;