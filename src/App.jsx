import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider, useChat } from './contexts/ChatContext';
import { useAuth } from './contexts/AuthContext';
import { ChatButton } from './components/ui';
import ChatPopup from './components/Chat/ChatPopup';
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
import ChatPage from './pages/ChatPage';

// Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'aos/dist/aos.css';
import './assets/css/main.css';

// Import AOS
import AOS from 'aos';

function ChatButtonWrapper() {
  const { isAuthenticated } = useAuth();
  const { isChatOpen, isChatPopupOpen, toggleChatPopup, conversations } = useChat();

  // Tính có tin nhắn mới ở bất kỳ conversation nào
  const hasUnread = conversations.some((conv) => conv.newMessage);
  // Đếm số conversation có tin nhắn mới
  const unreadCount = conversations.filter((conv) => conv.newMessage).length;

  console.log('[ChatButtonWrapper] conversations:', conversations);
  console.log('[ChatButtonWrapper] hasUnread:', hasUnread, 'unreadCount:', unreadCount);

  // Hiển thị khi đã đăng nhập và không ở phòng chat page
  if (!isAuthenticated || isChatOpen) return null;
  return <ChatButton hasUnread={hasUnread} unreadCount={unreadCount} onClick={toggleChatPopup} isOpen={isChatPopupOpen} />;
}

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
        <ChatProvider>
          <Toaster position="top-right" richColors />
          <ChatButtonWrapper />
          <ChatPopup />
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

            {/* Chat */}
            <Route path="/chat" element={<ChatPage />} />

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
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
}

export default App
