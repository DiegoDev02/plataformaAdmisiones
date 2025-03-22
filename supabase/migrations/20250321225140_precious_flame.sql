/*
  # Update User Role to Admin
  
  1. Changes
    - Update specified user's role to admin
    - Update user's metadata to reflect admin role
    - Ensure proper role cache update
    
  2. Security
    - Use safe role update function
    - Maintain existing permissions
    - Update related metadata
*/

-- Create function to safely update user role
CREATE OR REPLACE FUNCTION auth.update_user_to_admin(target_email text)
RETURNS void AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get user ID
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = target_email;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found with email %', target_email;
  END IF;

  -- Update user role and metadata
  UPDATE auth.users
  SET 
    role = 'admin',
    raw_app_meta_data = 
      CASE 
        WHEN raw_app_meta_data IS NULL THEN 
          '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb
        ELSE 
          raw_app_meta_data || '{"role":"admin"}'::jsonb
      END,
    updated_at = now()
  WHERE id = target_user_id;

  -- Update role cache
  INSERT INTO auth.role_cache (user_id, is_admin, updated_at)
  VALUES (target_user_id, true, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    is_admin = true,
    updated_at = now();

  RAISE NOTICE 'Successfully updated user % to admin role', target_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute role update for specific user
SELECT auth.update_user_to_admin('twobrosgms@gmail.com');

-- Drop the function after use
DROP FUNCTION auth.update_user_to_admin(text);