import Header from '../components/Header';
import Services from '../components/Services';
import Footer from '../components/Footer';

const ServicesPage = () => {
    return (
        <div className="index-page">
            <Header />
            <main className="main">
                <Services isHomePage={false} />
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
                <i className="bi bi-arrow-up-short dđ"></i>
            </a>
        </div>
    );
};

export default ServicesPage;
