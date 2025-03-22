/*
  # Add Full Bootcamp Enrollment Schema

  1. New Tables
    - `bootcamp_payment_options`
      - `id` (uuid, primary key)
      - `bootcamp_id` (uuid, references bootcamps)
      - `name` (text) - e.g. "Pago upfront", "Pagos tasa cero"
      - `description` (text)
      - `tag` (text) - e.g. "MÁS ECONÓMICO", "MÁS FLEXIBLE"
      - `price` (numeric)
      - `installment_amount` (numeric, nullable)
      - `installment_period` (text, nullable) - e.g. "monthly"
      - `discount_percentage` (numeric, nullable)
      - `requirements` (text[], nullable)
      - `is_active` (boolean)
      - `created_at` (timestamp)

    - `bootcamp_tests`
      - `id` (uuid, primary key)
      - `bootcamp_id` (uuid, references bootcamps)
      - `name` (text)
      - `description` (text)
      - `type` (text) - e.g. "technical", "english"
      - `duration_minutes` (integer)
      - `passing_score` (integer)
      - `is_required` (boolean)
      - `created_at` (timestamp)

    - `enrollment_steps`
      - `id` (uuid, primary key)
      - `bootcamp_id` (uuid, references bootcamps)
      - `step_number` (integer)
      - `name` (text)
      - `description` (text)
      - `is_required` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users and admins
*/

-- Create bootcamp_payment_options table
CREATE TABLE IF NOT EXISTS bootcamp_payment_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bootcamp_id uuid REFERENCES bootcamps(id) NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  tag text,
  price numeric NOT NULL,
  installment_amount numeric,
  installment_period text,
  discount_percentage numeric,
  requirements text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create bootcamp_tests table
CREATE TABLE IF NOT EXISTS bootcamp_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bootcamp_id uuid REFERENCES bootcamps(id) NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  type text NOT NULL,
  duration_minutes integer NOT NULL,
  passing_score integer NOT NULL,
  is_required boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create enrollment_steps table
CREATE TABLE IF NOT EXISTS enrollment_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bootcamp_id uuid REFERENCES bootcamps(id) NOT NULL,
  step_number integer NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  is_required boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(bootcamp_id, step_number)
);

-- Enable RLS
ALTER TABLE bootcamp_payment_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE bootcamp_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment_steps ENABLE ROW LEVEL SECURITY;

-- Policies for bootcamp_payment_options
CREATE POLICY "Enable read access for active payment options"
  ON bootcamp_payment_options FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Enable admin management for payment options"
  ON bootcamp_payment_options
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Policies for bootcamp_tests
CREATE POLICY "Enable read access for bootcamp tests"
  ON bootcamp_tests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable admin management for tests"
  ON bootcamp_tests
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Policies for enrollment_steps
CREATE POLICY "Enable read access for enrollment steps"
  ON enrollment_steps FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable admin management for steps"
  ON enrollment_steps
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Insert initial data for Full Stack Developer bootcamp
DO $$ 
DECLARE
  bootcamp_id uuid;
BEGIN
  -- Get the Full Stack Developer bootcamp ID
  SELECT id INTO bootcamp_id
  FROM bootcamps
  WHERE name = 'Full Stack Developer';

  IF bootcamp_id IS NOT NULL THEN
    -- Insert payment options
    INSERT INTO bootcamp_payment_options 
    (bootcamp_id, name, description, tag, price, discount_percentage, installment_period)
    VALUES
    (
      bootcamp_id,
      'Pago upfront',
      'Realiza el pago completo de $3,060 USD y recibe un increíble descuento del 35% en el valor total del bootcamp.',
      'MÁS ECONÓMICO',
      3060,
      35,
      null
    ),
    (
      bootcamp_id,
      'Pagos tasa cero',
      'Si eres salvadoreño y posees una tarjeta de crédito del Banco Agrícola, disfruta de cuotas atractivas desde $191.50 USD',
      'MÁS ECONÓMICO',
      4600,
      null,
      'monthly'
    ),
    (
      bootcamp_id,
      'Pagos Mensuales',
      'Selecciona entre planes de 3, 6, 9 o 12 meses para mayor flexibilidad.',
      'MÁS FLEXIBLE',
      4600,
      null,
      'monthly'
    ),
    (
      bootcamp_id,
      'Acuerdo de Ingresos Compartidos',
      'Exclusivo para estudiantes salvadoreños interesados en emplearse.',
      'NACIONALES',
      4600,
      null,
      null
    );

    -- Insert enrollment steps
    INSERT INTO enrollment_steps
    (bootcamp_id, step_number, name, description, is_required)
    VALUES
    (
      bootcamp_id,
      1,
      'Método de pago',
      'Elige la opción de pago que mejor se adapte a tus necesidades',
      true
    ),
    (
      bootcamp_id,
      2,
      'Acerca de ti',
      'Cuéntanos más sobre tu perfil y experiencia',
      true
    ),
    (
      bootcamp_id,
      3,
      'Prueba técnica',
      'Demuestra tus conocimientos básicos',
      true
    ),
    (
      bootcamp_id,
      4,
      'Entrevista',
      'Conoce a tu mentor y resuelve tus dudas',
      true
    );

    -- Insert tests
    INSERT INTO bootcamp_tests
    (bootcamp_id, name, description, type, duration_minutes, passing_score, is_required)
    VALUES
    (
      bootcamp_id,
      'Prueba técnica de programación',
      'Evaluación de conceptos básicos de programación y lógica',
      'technical',
      60,
      70,
      true
    ),
    (
      bootcamp_id,
      'Evaluación de inglés',
      'Prueba de comprensión de lectura técnica en inglés',
      'english',
      30,
      60,
      true
    );
  END IF;
END $$;