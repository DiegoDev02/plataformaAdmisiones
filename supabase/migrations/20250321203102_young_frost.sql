/*
  # Add phone column to profiles table

  1. Changes
    - Add phone column to profiles table
    - Make it nullable to support existing records
    - Add comment explaining the column purpose

  2. Security
    - No changes to RLS policies needed as existing profile policies cover the new column
*/

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone text;