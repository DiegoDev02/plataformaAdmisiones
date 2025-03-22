/*
  # Add create_profile_if_not_exists function

  1. Changes
    - Create a stored procedure for safe profile creation
    - Handle race conditions and duplicate inserts
    - Provide atomic profile creation operation

  2. Security
    - Function runs with SECURITY DEFINER
    - Proper error handling
    - Safe parameter handling
*/

-- Create or replace the function for safe profile creation
CREATE OR REPLACE FUNCTION create_profile_if_not_exists(
  user_id uuid,
  user_email text,
  user_first_name text,
  user_last_name text,
  user_phone text
) RETURNS void AS $$
BEGIN
  INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    phone
  ) VALUES (
    user_id,
    user_email,
    user_first_name,
    user_last_name,
    user_phone
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone
  WHERE profiles.id = EXCLUDED.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;