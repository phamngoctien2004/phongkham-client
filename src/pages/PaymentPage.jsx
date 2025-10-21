import Header from '../components/Header';
import PaymentPageContent from '../components/Appointment/PaymentPage';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

const PaymentPage = () => {
    return (
        <ProtectedRoute>
            <div className="index-page">
                <Header />
                <main className="main">
                    <PaymentPageContent />
                </main>
                <Footer />
            </div>
        </ProtectedRoute>
    );
};

export default PaymentPage;
