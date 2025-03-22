/*
  # Add bootcamp interactions tracking

  1. New Tables
    - `bootcamp_interactions`
      - `id` (uuid, primary key)
      - `bootcamp_id` (uuid, references bootcamps)
      - `user_id` (uuid, references auth.users)
      - `interaction_type` (text)
      - `created_at` (timestamp)
      - `month` (text) - For monthly stats reset

  2. Security
    - Enable RLS
    - Add policies for users and admins
*/

-- Create bootcamp_interactions table
CREATE TABLE IF NOT EXISTS bootcamp_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bootcamp_id uuid REFERENCES bootcamps(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  interaction_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  month text NOT NULL,
  UNIQUE(bootcamp_id, user_id, interaction_type, month)
);

-- Enable RLS
ALTER TABLE bootcamp_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own interactions"
  ON bootcamp_interactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own interactions"
  ON bootcamp_interactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all interactions"
  ON bootcamp_interactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- Add tag_color column to bootcamps
ALTER TABLE bootcamps
ADD COLUMN IF NOT EXISTS tag_color text;