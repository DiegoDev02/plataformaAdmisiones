/*
  # Create bootcamps and enrollment progress tables

  1. New Tables
    - `bootcamps`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `duration_weeks` (integer)
      - `price` (numeric)
      - `requires_test` (boolean)
      - `is_active` (boolean)
      - `is_featured` (boolean)
      - `topics` (text array)
      - `skills` (text array)
      - `image_url` (text)
      - `created_at` (timestamp)

    - `enrollment_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `bootcamp_id` (uuid, references bootcamps)
      - `current_step` (integer)
      - `form_data` (jsonb)
      - `last_updated` (timestamp)
      - `completed` (boolean)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users and admins
*/

-- Create bootcamps table
CREATE TABLE IF NOT EXISTS bootcamps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  duration_weeks integer NOT NULL,
  price numeric NOT NULL,
  requires_test boolean DEFAULT false,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  topics text[] DEFAULT '{}',
  skills text[] DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on bootcamps
ALTER TABLE bootcamps ENABLE ROW LEVEL SECURITY;

-- Policies for bootcamps
CREATE POLICY "Anyone can view active bootcamps"
  ON bootcamps
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage bootcamps"
  ON bootcamps
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- Create enrollment progress table
CREATE TABLE IF NOT EXISTS enrollment_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  bootcamp_id uuid REFERENCES bootcamps NOT NULL,
  current_step integer NOT NULL DEFAULT 1,
  form_data jsonb DEFAULT '{}'::jsonb,
  last_updated timestamptz DEFAULT now(),
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, bootcamp_id)
);

-- Enable RLS on enrollment_progress
ALTER TABLE enrollment_progress ENABLE ROW LEVEL SECURITY;

-- Policies for enrollment_progress
CREATE POLICY "Users can view their own progress"
  ON enrollment_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON enrollment_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON enrollment_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for admins
CREATE POLICY "Admins can view all progress"
  ON enrollment_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );