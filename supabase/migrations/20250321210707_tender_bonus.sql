/*
  # Fix bootcamps table permissions

  1. Changes
    - Drop existing policies
    - Create new policies for public access to bootcamps
    - Add policy for featured bootcamps
    - Add policy for active bootcamps

  2. Security
    - Enable public read access for active bootcamps
    - Enable public read access for featured bootcamps
    - Maintain admin management capabilities
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view active bootcamps" ON bootcamps;
DROP POLICY IF EXISTS "Admins can manage bootcamps" ON bootcamps;

-- Create new policies
CREATE POLICY "Enable read access for active bootcamps"
  ON bootcamps FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Enable read access for featured bootcamps"
  ON bootcamps FOR SELECT
  TO public
  USING (is_featured = true);

-- Admin policy for full management
CREATE POLICY "Enable admin management"
  ON bootcamps
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT SELECT ON bootcamps TO anon;
GRANT SELECT ON bootcamps TO authenticated;