/*
  # Create Admin User Account with Safe Profile Handling
  
  1. Changes
    - Create admin user with secure credentials
    - Handle existing profile gracefully
    - Set up proper role and permissions
    
  2. Security
    - Use secure password hashing
    - Set proper role metadata
    - Handle conflicts properly
*/

-- Create function to handle admin user creation with proper conflict handling
CREATE OR REPLACE FUNCTION create_kodigo_admin()
RETURNS void AS $$
DECLARE
  admin_id uuid;
BEGIN
  -- Generate UUID for admin user
  admin_id := gen_random_uuid();
  
  -- Create admin user with specified credentials
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
    'admin@kodigo.org',
    crypt('Kodigo2025!', gen_salt('bf')),
    now(),
    'admin',
    'authenticated',
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Admin Kodigo"}',
    now(),
    now(),
    now()
  );

  -- Create profile using the safe function
  PERFORM create_profile_if_not_exists(
    admin_id,
    'admin@kodigo.org',
    'Admin',
    'Kodigo',
    null
  );

  -- Update role cache with conflict handling
  INSERT INTO auth.role_cache (
    user_id,
    is_admin,
    updated_at
  ) VALUES (
    admin_id,
    true,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    is_admin = EXCLUDED.is_admin,
    updated_at = EXCLUDED.updated_at;

  RAISE NOTICE 'Admin user created/updated successfully with ID: %', admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute function to create admin user
SELECT create_kodigo_admin();

-- Drop function after use
DROP FUNCTION create_kodigo_admin();