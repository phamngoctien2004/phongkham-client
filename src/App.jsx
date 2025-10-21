import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Doctors from './components/Doctors';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/css/main.css';

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Router>
      <div className="index-page">
        <Header />
        <main className="main">
          <Hero />
          <About />
          <Services />
          <Doctors />
          <Contact />
        </main>
        <Footer />

        {/* Scroll Top Button */}
        {showScrollTop && (
          <a
            href="#"
            id="scroll-top"
            className="scroll-top d-flex align-items-center justify-content-center"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
          >
            <i className="bi bi-arrow-up-short"></i>
          </a>
        )}
      </div>
    </Router>
  );
}

export default App
