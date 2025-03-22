import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/Toaster';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const BootcampsPage = lazy(() => import('./pages/BootcampsPage'));
const BootcampPage = lazy(() => import('./pages/BootcampPage'));
const EnrollmentPage = lazy(() => import('./pages/EnrollmentPage'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const EditProfilePage = lazy(() => import('./pages/EditProfilePage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const SupabaseTestSimple = lazy(() => import('./pages/SupabaseTestSimple'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminBootcamps = lazy(() => import('./pages/admin/Bootcamps'));
const AdminEnrollments = lazy(() => import('./pages/admin/Enrollments'));
const AdminPayments = lazy(() => import('./pages/admin/Payments'));

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Router>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#1A0B2E]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B20FF]" />
          </div>
        }>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="bootcamps" element={<ProtectedRoute><BootcampsPage /></ProtectedRoute>} />
              <Route path="bootcamp/:id" element={<ProtectedRoute><BootcampPage /></ProtectedRoute>} />
              <Route path="enroll/:bootcampId" element={<ProtectedRoute><EnrollmentPage /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="supabase-test" element={<SupabaseTestSimple />} />
            </Route>

            {/* Admin routes - Completamente separadas del Layout general */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="bootcamps" element={<AdminBootcamps />} />
              <Route path="enrollments" element={<AdminEnrollments />} />
              <Route path="payments" element={<AdminPayments />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;