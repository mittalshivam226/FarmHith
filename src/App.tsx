import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NavigationProvider } from './context/NavigationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import { useAuth } from './context/AuthContext';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import BookTest from './pages/BookTest';
import Reports from './pages/Reports';
import Education from './pages/Education';
import Blog from './pages/Blog';
import Partners from './pages/Partners';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import Login from './pages/Login';
import Profile from './pages/Profile';
import FarmerDashboard from './pages/dashboard/FarmerDashboard';
import LabDashboard from './pages/dashboard/LabDashboard';
import BuyerDashboard from './pages/dashboard/BuyerDashboard';
import ProtectedRoute from './router/ProtectedRoute';

function DashboardRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen visible />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'farmer') return <Navigate to="/dashboard/farmer" replace />;
  if (user.role === 'lab') return <Navigate to="/dashboard/lab" replace />;
  if (user.role === 'buyer') return <Navigate to="/dashboard/buyer" replace />;
  return <Navigate to="/" replace />;
}

function AppShell() {
  return (
    <NavigationProvider>
      <Header />
      <main className="page-enter">
        <div className="page-shell">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/book-test" element={<BookTest />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/education" element={<Education />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<Legal type="privacy" />} />
            <Route path="/terms" element={<Legal type="terms" />} />
            <Route path="/refund" element={<Legal type="refund" />} />

            {/* Auth-protected routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Role-based dashboards */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/farmer"
              element={
                <ProtectedRoute roles={['farmer', 'admin']}>
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/lab"
              element={
                <ProtectedRoute roles={['lab', 'admin']}>
                  <LabDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/buyer"
              element={
                <ProtectedRoute roles={['buyer', 'admin']}>
                  <BuyerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </NavigationProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
