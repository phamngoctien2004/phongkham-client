import Header from '../components/Header';
import Doctors from '../components/Doctors';
import Footer from '../components/Footer';

const DoctorsPage = () => {
    return (
        <div className="index-page">
            <Header />
            <main className="main">
                <Doctors isHomePage={false} />
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
    );
};

export default DoctorsPage;
