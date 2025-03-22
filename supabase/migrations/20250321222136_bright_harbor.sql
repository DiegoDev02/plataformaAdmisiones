/*
  # Fix bootcamp interactions RLS policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new policies with proper checks
    - Add upsert policy for interactions

  2. Security
    - Enable RLS
    - Allow users to track their own interactions
    - Allow admins to view all interactions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own interactions" ON bootcamp_interactions;
DROP POLICY IF EXISTS "Users can view their own interactions" ON bootcamp_interactions;
DROP POLICY IF EXISTS "Admins can view all interactions" ON bootcamp_interactions;

-- Create new policies
CREATE POLICY "Enable insert/update for users own interactions"
  ON bootcamp_interactions
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = user_id
  )
  WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Enable read access for users own interactions"
  ON bootcamp_interactions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT ALL ON bootcamp_interactions TO authenticated;