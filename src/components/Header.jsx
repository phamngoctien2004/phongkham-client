import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileNav = () => {
    setMobileNavActive(!mobileNavActive);
  };

  const closeMobileNav = () => {
    setMobileNavActive(false);
  };

  return (
    <header id="header" className={`header sticky-top ${scrolled ? 'scrolled' : ''}`}>
      <div className="topbar d-flex align-items-center">
        <div className="container d-flex justify-content-center justify-content-md-between">
          <div className="contact-info d-flex align-items-center">
            <i className="bi bi-envelope d-flex align-items-center">
              <a href="mailto:contact@example.com">contact@example.com</a>
            </i>
            <i className="bi bi-phone d-flex align-items-center ms-4">
              <span>+1 5589 55488 55</span>
            </i>
          </div>
          <div className="social-links d-none d-md-flex align-items-center">
            <a href="#" className="twitter">
              <i className="bi bi-twitter-x"></i>
            </a>
            <a href="#" className="facebook">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="instagram">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" className="linkedin">
              <i className="bi bi-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="branding d-flex align-items-center">
        <div className="container position-relative d-flex align-items-center justify-content-between">
          <Link to="/" className="logo d-flex align-items-center me-auto">
            <h1 className="sitename">Medilab</h1>
          </Link>

          <nav id="navmenu" className={`navmenu ${mobileNavActive ? 'mobile-nav-active' : ''}`}>
            <ul>
              <li>
                <a href="#hero" className="active" onClick={closeMobileNav}>
                  Home
                </a>
              </li>
              <li>
                <a href="#about" onClick={closeMobileNav}>
                  About
                </a>
              </li>
              <li>
                <a href="#services" onClick={closeMobileNav}>
                  Services
                </a>
              </li>
              <li>
                <a href="#departments" onClick={closeMobileNav}>
                  Departments
                </a>
              </li>
              <li>
                <a href="#doctors" onClick={closeMobileNav}>
                  Doctors
                </a>
              </li>
              <li>
                <a href="#contact" onClick={closeMobileNav}>
                  Contact
                </a>
              </li>
            </ul>
            <i
              className={`mobile-nav-toggle d-xl-none ${mobileNavActive ? 'bi-x' : 'bi-list'}`}
              onClick={toggleMobileNav}
            ></i>
          </nav>

          <a className="cta-btn d-none d-sm-block" href="#appointment">
            Make an Appointment
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
