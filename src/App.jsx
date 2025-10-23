import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import DoctorsPage from './pages/DoctorsPage';
import ContactPage from './pages/ContactPage';
import NewsPage from './pages/NewsPage';
import AppointmentPage from './pages/AppointmentPage';
import PaymentPage from './pages/PaymentPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProfilePage from './pages/ProfilePage';
import MedicalRecordDetailPage from './pages/MedicalRecordDetailPage';

// Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'aos/dist/aos.css';
import './assets/css/main.css';

// Import AOS
import AOS from 'aos';

function App() {
  // Initialize AOS for all pages
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });

    // Refresh AOS on route change
    AOS.refresh();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public Routes - Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/news" element={<NewsPage />} />

          {/* Protected Routes - Appointment */}
          <Route path="/dat-lich" element={<AppointmentPage />} />
          <Route path="/dat-lich/thanh-toan/:id" element={<PaymentPage />} />

          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Medical Record Detail */}
          <Route path="/ho-so/:id" element={<MedicalRecordDetailPage />} />

          {/* Protected Routes - Add your protected pages here */}
          {/* Example:
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App
