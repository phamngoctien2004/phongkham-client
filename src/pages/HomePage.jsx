import Header from '../components/Header';
import Carousel from '../components/Carousel';
import CustomerServices from '../components/CustomerServices';
import Hero from '../components/Hero';
import News from '../components/News';
import Services from '../components/Services';
import Departments from '../components/Departments';
import Membership from '../components/Membership';
import Testimonials from '../components/Testimonials';
import Doctors from '../components/Doctors';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage = () => {
    return (
        <div className="index-page">
            <Header />
            <main className="main">
                <Carousel />
                <CustomerServices />
                <News isHomePage={true} />
                <Doctors isHomePage={true} />
                <Services isHomePage={true} />
                <Departments />
                <Membership />
                <Testimonials />
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
