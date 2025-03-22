-- ==================================================
-- MIGRACIÓN: CONFIGURACIÓN DE ROL ADMINISTRADOR Y TABLAS
-- ==================================================

-- Configuración del esquema y extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================== TABLAS PRINCIPALES ==================

-- Tabla de perfiles (si no existe)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabla de bootcamps
CREATE TABLE IF NOT EXISTS public.bootcamps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration_weeks INTEGER NOT NULL,
  difficulty_level TEXT NOT NULL,
  cover_image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabla de inscripciones
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bootcamp_id UUID NOT NULL REFERENCES public.bootcamps(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, active, completed, cancelled
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed
  technical_test_status TEXT DEFAULT 'not_submitted', -- not_submitted, submitted, approved, rejected
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  completion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, bootcamp_id)
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_method TEXT,
  transaction_id TEXT,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabla de interacciones con bootcamps
CREATE TABLE IF NOT EXISTS public.bootcamp_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bootcamp_id UUID NOT NULL REFERENCES public.bootcamps(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- view, favorite, share
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, bootcamp_id, interaction_type)
);

-- ================== POLÍTICAS DE SEGURIDAD (RLS) ==================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bootcamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bootcamp_interactions ENABLE ROW LEVEL SECURITY;

-- ================== FUNCIÓN PARA VERIFICAR ADMINISTRADORES ==================

-- Función para comprobar si el usuario actual es administrador
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  current_user_metadata JSONB;
BEGIN
  -- Obtener los metadatos del usuario actual
  current_user_metadata := (SELECT raw_app_meta_data FROM auth.users WHERE id = auth.uid());
  
  -- Verificar si el usuario tiene el rol de administrador
  RETURN current_user_metadata->>'role' = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================== POLÍTICAS PARA PERFILES ==================

-- Política para administradores (acceso completo a todos los perfiles)
DROP POLICY IF EXISTS profiles_admin_policy ON public.profiles;
CREATE POLICY profiles_admin_policy ON public.profiles
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Política para usuarios normales (solo pueden ver/editar su propio perfil)
DROP POLICY IF EXISTS profiles_user_policy ON public.profiles;
CREATE POLICY profiles_user_policy ON public.profiles
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ================== POLÍTICAS PARA BOOTCAMPS ==================

-- Política para administradores (acceso completo a bootcamps)
DROP POLICY IF EXISTS bootcamps_admin_policy ON public.bootcamps;
CREATE POLICY bootcamps_admin_policy ON public.bootcamps
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Política para usuarios normales (solo pueden ver bootcamps)
DROP POLICY IF EXISTS bootcamps_user_policy ON public.bootcamps;
CREATE POLICY bootcamps_user_policy ON public.bootcamps
  FOR SELECT
  USING (true);

-- ================== POLÍTICAS PARA INSCRIPCIONES ==================

-- Política para administradores (acceso completo a inscripciones)
DROP POLICY IF EXISTS enrollments_admin_policy ON public.enrollments;
CREATE POLICY enrollments_admin_policy ON public.enrollments
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Política para usuarios normales (solo pueden ver/editar sus propias inscripciones)
DROP POLICY IF EXISTS enrollments_user_policy ON public.enrollments;
CREATE POLICY enrollments_user_policy ON public.enrollments
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ================== POLÍTICAS PARA PAGOS ==================

-- Política para administradores (acceso completo a pagos)
DROP POLICY IF EXISTS payments_admin_policy ON public.payments;
CREATE POLICY payments_admin_policy ON public.payments
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Política para usuarios normales (solo pueden ver sus propios pagos)
DROP POLICY IF EXISTS payments_user_policy ON public.payments;
CREATE POLICY payments_user_policy ON public.payments
  FOR SELECT
  USING (enrollment_id IN (SELECT id FROM public.enrollments WHERE user_id = auth.uid()));

-- ================== POLÍTICAS PARA INTERACCIONES ==================

-- Política para administradores (acceso completo a interacciones)
DROP POLICY IF EXISTS bootcamp_interactions_admin_policy ON public.bootcamp_interactions;
CREATE POLICY bootcamp_interactions_admin_policy ON public.bootcamp_interactions
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Política para usuarios normales (solo pueden ver/editar sus propias interacciones)
DROP POLICY IF EXISTS bootcamp_interactions_user_policy ON public.bootcamp_interactions;
CREATE POLICY bootcamp_interactions_user_policy ON public.bootcamp_interactions
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ================== FUNCIONES PARA ESTADÍSTICAS (ADMIN) ==================

-- Función para obtener estadísticas de inscripciones por bootcamp
CREATE OR REPLACE FUNCTION public.get_enrollment_stats()
RETURNS TABLE (
  bootcamp_id UUID,
  bootcamp_name TEXT,
  total_enrollments BIGINT,
  paid_enrollments BIGINT,
  pending_enrollments BIGINT
) AS $$
BEGIN
  -- Verificar que el usuario es admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Solo administradores pueden acceder a estas estadísticas';
  END IF;
  
  RETURN QUERY
  SELECT 
    b.id as bootcamp_id,
    b.name as bootcamp_name,
    COUNT(e.id) as total_enrollments,
    COUNT(e.id) FILTER (WHERE e.payment_status = 'completed') as paid_enrollments,
    COUNT(e.id) FILTER (WHERE e.payment_status = 'pending') as pending_enrollments
  FROM bootcamps b
  LEFT JOIN enrollments e ON b.id = e.bootcamp_id
  GROUP BY b.id, b.name
  ORDER BY total_enrollments DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para contar bootcamps activos
CREATE OR REPLACE FUNCTION public.count_active_bootcamps()
RETURNS BIGINT AS $$
BEGIN
  -- Verificar que el usuario es admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Solo administradores pueden acceder a estas estadísticas';
  END IF;
  
  RETURN (SELECT COUNT(*) FROM bootcamps);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para calcular ingresos totales
CREATE OR REPLACE FUNCTION public.calculate_total_revenue()
RETURNS DECIMAL AS $$
DECLARE
  total DECIMAL(10,2);
BEGIN
  -- Verificar que el usuario es admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Solo administradores pueden acceder a estas estadísticas';
  END IF;
  
  SELECT COALESCE(SUM(amount), 0) INTO total
  FROM payments
  WHERE status = 'completed';
  
  RETURN total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================== DATOS DE EJEMPLO ==================

-- Insertar algunos bootcamps de ejemplo (si no existen)
INSERT INTO public.bootcamps (name, description, category, price, duration_weeks, difficulty_level, cover_image_url, featured)
SELECT 
  'Desarrollo Web Full Stack', 
  'Aprende las tecnologías más demandadas para convertirte en desarrollador web Full Stack.', 
  'Desarrollo Web', 
  1299.99, 
  12, 
  'Intermedio',
  'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  true
WHERE NOT EXISTS (SELECT 1 FROM public.bootcamps WHERE name = 'Desarrollo Web Full Stack');

INSERT INTO public.bootcamps (name, description, category, price, duration_weeks, difficulty_level, cover_image_url)
SELECT 
  'Data Science y Machine Learning', 
  'Domina las técnicas de análisis de datos y machine learning con Python.', 
  'Data Science', 
  1499.99, 
  16, 
  'Avanzado',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.bootcamps WHERE name = 'Data Science y Machine Learning');

INSERT INTO public.bootcamps (name, description, category, price, duration_weeks, difficulty_level, cover_image_url, featured)
SELECT 
  'Desarrollo de Aplicaciones Móviles', 
  'Crea aplicaciones nativas para iOS y Android con React Native.', 
  'Desarrollo Móvil', 
  1199.99, 
  10, 
  'Intermedio',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
  true
WHERE NOT EXISTS (SELECT 1 FROM public.bootcamps WHERE name = 'Desarrollo de Aplicaciones Móviles');
