import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/Toaster';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const BootcampsPage = lazy(() => import('./pages/BootcampsPage'));
const BootcampPage = lazy(() => import('./pages/BootcampPage'));
const EnrollmentPage = lazy(() => import('./pages/EnrollmentPage'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminBootcamps = lazy(() => import('./pages/admin/Bootcamps'));
const AdminEnrollments = lazy(() => import('./pages/admin/Enrollments'));
const AdminPayments = lazy(() => import('./pages/admin/Payments'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const EditProfilePage = lazy(() => import('./pages/EditProfilePage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

function App() {
  return (
    <AuthProvider>
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
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="bootcamps" element={<AdminBootcamps />} />
              <Route path="enrollments" element={<AdminEnrollments />} />
              <Route path="payments" element={<AdminPayments />} />
            </Route>
          </Routes>
        </Suspense>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;