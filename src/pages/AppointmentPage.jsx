import Header from '../components/Header';
import AppointmentForm from '../components/Appointment/AppointmentForm';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

const AppointmentPage = () => {
    return (
        <ProtectedRoute>
            <div className="index-page">
                <Header />
                <main className="main">
                    <AppointmentForm />
                </main>
                <Footer />
                <a
                    href="#"
                    className="scroll-top d-flex align-items-center justify-content-center active"
                    onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    <i className="bi bi-arrow-up-short"></i>
                </a>
            </div>
        </ProtectedRoute>
    );
};

export default AppointmentPage;
