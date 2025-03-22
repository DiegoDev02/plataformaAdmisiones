// Datos simulados para desarrollo local
import { v4 as uuidv4 } from 'uuid';

// Bootcamps de ejemplo
export const mockBootcamps = [
  {
    id: uuidv4(),
    name: 'Desarrollo Web Full Stack',
    description: 'Aprende las tecnologías más demandadas para convertirte en desarrollador web Full Stack.',
    category: 'Desarrollo Web',
    price: 1299.99,
    duration_weeks: 12,
    difficulty_level: 'Intermedio',
    cover_image_url: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Data Science y Machine Learning',
    description: 'Domina las técnicas de análisis de datos y machine learning con Python.',
    category: 'Data Science',
    price: 1499.99,
    duration_weeks: 16,
    difficulty_level: 'Avanzado',
    cover_image_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Desarrollo de Aplicaciones Móviles',
    description: 'Crea aplicaciones nativas para iOS y Android con React Native.',
    category: 'Desarrollo Móvil',
    price: 1199.99,
    duration_weeks: 10,
    difficulty_level: 'Intermedio',
    cover_image_url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Perfiles de usuario de ejemplo
export const mockProfiles = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'usuario1@example.com',
    full_name: 'Usuario Ejemplo 1',
    avatar_url: 'https://i.pravatar.cc/150?img=1',
    bio: 'Estudiante de programación',
    role: 'user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '223e4567-e89b-12d3-a456-426614174001',
    email: 'usuario2@example.com',
    full_name: 'Usuario Ejemplo 2',
    avatar_url: 'https://i.pravatar.cc/150?img=2',
    bio: 'Diseñador UX/UI',
    role: 'user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '323e4567-e89b-12d3-a456-426614174002',
    email: 'admin@example.com',
    full_name: 'Administrador',
    avatar_url: 'https://i.pravatar.cc/150?img=3',
    bio: 'Administrador de la plataforma',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Inscripciones de ejemplo
export const mockEnrollments = [
  {
    id: uuidv4(),
    user_id: '123e4567-e89b-12d3-a456-426614174000',
    bootcamp_id: mockBootcamps[0].id,
    status: 'active',
    payment_status: 'completed',
    technical_test_status: 'approved',
    enrollment_date: new Date().toISOString(),
    completion_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    user_id: '223e4567-e89b-12d3-a456-426614174001',
    bootcamp_id: mockBootcamps[1].id,
    status: 'pending',
    payment_status: 'pending',
    technical_test_status: 'not_submitted',
    enrollment_date: new Date().toISOString(),
    completion_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Pagos de ejemplo
export const mockPayments = [
  {
    id: uuidv4(),
    enrollment_id: mockEnrollments[0].id,
    amount: 1299.99,
    status: 'completed',
    payment_method: 'credit_card',
    transaction_id: 'tx_123456789',
    payment_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    enrollment_id: mockEnrollments[1].id,
    amount: 1499.99,
    status: 'pending',
    payment_method: null,
    transaction_id: null,
    payment_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Estadísticas simuladas para el panel de administrador
export const mockAdminStats = {
  totalBootcamps: mockBootcamps.length,
  totalUsers: mockProfiles.length,
  totalEnrollments: mockEnrollments.length,
  totalRevenue: mockPayments
    .filter(payment => payment.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0),
  enrollmentsByBootcamp: mockBootcamps.map(bootcamp => ({
    bootcamp_id: bootcamp.id,
    bootcamp_name: bootcamp.name,
    total_enrollments: mockEnrollments.filter(e => e.bootcamp_id === bootcamp.id).length,
    paid_enrollments: mockEnrollments.filter(e => e.bootcamp_id === bootcamp.id && e.payment_status === 'completed').length,
    pending_enrollments: mockEnrollments.filter(e => e.bootcamp_id === bootcamp.id && e.payment_status === 'pending').length,
  }))
};

// Funciones de simulación para operaciones CRUD

// Bootcamps
export const mockGetBootcamps = () => Promise.resolve({ data: mockBootcamps, error: null });
export const mockGetBootcampById = (id: string) => {
  const bootcamp = mockBootcamps.find(b => b.id === id);
  return Promise.resolve({ 
    data: bootcamp ? [bootcamp] : [], 
    error: bootcamp ? null : 'Bootcamp no encontrado' 
  });
};
export const mockCreateBootcamp = (bootcampData: any) => {
  const newBootcamp = {
    id: uuidv4(),
    ...bootcampData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  return Promise.resolve({ data: [newBootcamp], error: null });
};
export const mockUpdateBootcamp = (id: string, bootcampData: any) => {
  const bootcamp = mockBootcamps.find(b => b.id === id);
  if (!bootcamp) return Promise.resolve({ data: null, error: 'Bootcamp no encontrado' });
  
  const updatedBootcamp = { ...bootcamp, ...bootcampData, updated_at: new Date().toISOString() };
  return Promise.resolve({ data: [updatedBootcamp], error: null });
};
export const mockDeleteBootcamp = (id: string) => {
  const bootcamp = mockBootcamps.find(b => b.id === id);
  if (!bootcamp) return Promise.resolve({ data: null, error: 'Bootcamp no encontrado' });
  
  return Promise.resolve({ data: [], error: null });
};

// Usuarios/Perfiles
export const mockGetProfiles = () => Promise.resolve({ data: mockProfiles, error: null });
export const mockGetProfileById = (id: string) => {
  const profile = mockProfiles.find(p => p.id === id);
  return Promise.resolve({ 
    data: profile ? [profile] : [], 
    error: profile ? null : 'Perfil no encontrado' 
  });
};

// Inscripciones
export const mockGetEnrollments = () => Promise.resolve({ data: mockEnrollments, error: null });
export const mockGetEnrollmentById = (id: string) => {
  const enrollment = mockEnrollments.find(e => e.id === id);
  return Promise.resolve({ 
    data: enrollment ? [enrollment] : [], 
    error: enrollment ? null : 'Inscripción no encontrada' 
  });
};
export const mockUpdateEnrollment = (id: string, enrollmentData: any) => {
  const enrollment = mockEnrollments.find(e => e.id === id);
  if (!enrollment) return Promise.resolve({ data: null, error: 'Inscripción no encontrada' });
  
  const updatedEnrollment = { ...enrollment, ...enrollmentData, updated_at: new Date().toISOString() };
  return Promise.resolve({ data: [updatedEnrollment], error: null });
};

// Pagos
export const mockGetPayments = () => Promise.resolve({ data: mockPayments, error: null });
export const mockGetPaymentById = (id: string) => {
  const payment = mockPayments.find(p => p.id === id);
  return Promise.resolve({ 
    data: payment ? [payment] : [], 
    error: payment ? null : 'Pago no encontrado' 
  });
};
export const mockUpdatePayment = (id: string, paymentData: any) => {
  const payment = mockPayments.find(p => p.id === id);
  if (!payment) return Promise.resolve({ data: null, error: 'Pago no encontrado' });
  
  const updatedPayment = { ...payment, ...paymentData, updated_at: new Date().toISOString() };
  return Promise.resolve({ data: [updatedPayment], error: null });
};

// Estadísticas
export const mockGetAdminStats = () => Promise.resolve({ data: mockAdminStats, error: null });
