import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Doctors from '../components/Doctors';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage = () => {
    return (
        <div className="index-page">
            <Header />
            <main className="main">
                <Hero />
                <About isHomePage={true} />
                <Services isHomePage={true} />
                <Doctors isHomePage={true} />
                <Contact isHomePage={true} />
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

export default HomePage;
