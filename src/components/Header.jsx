import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { NotificationBell } from './Notification';
import { ChatIcon } from './Chat';

const Header = () => {
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeMobileNav();
    setShowUserDropdown(false);
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown]);

  return (
    <header id="header" className={`header sticky-top ${scrolled ? 'scrolled' : ''}`}>
      <div className="topbar d-flex align-items-center">
        <div className="container d-flex justify-content-center justify-content-md-between">
          <div className="contact-info d-flex align-items-center">
            <i className="bi bi-envelope d-flex align-items-center">
              <a href="mailto:contact@medilab.vn">contact@medilab.vn</a>
            </i>
            <i className="bi bi-phone d-flex align-items-center ms-4">
              <span>+84 28 3824 5678</span>
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
        <div className="container position-relative d-flex align-items-center justify-content-between bx">
          <Link to="/" className="logo d-flex align-items-center me-auto2">
            <h1 className="sitename">Medilab</h1>
          </Link>

          <nav id="navmenu" className={`navmenu ${mobileNavActive ? 'mobile-nav-active' : ''}`}>
            <ul>
              <li>
                <Link to="/" onClick={closeMobileNav}>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={closeMobileNav}>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/services" onClick={closeMobileNav}>
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link to="/doctors" onClick={closeMobileNav}>
                  Đội ngũ Bác sĩ
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={closeMobileNav}>
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/news" onClick={closeMobileNav}>
                  Tin tức
                </Link>
              </li>
              {isAuthenticated && (
                <li className="d-xl-none">
                  <Link to="/dat-lich" onClick={closeMobileNav}>
                    Đặt lịch ngay
                  </Link>
                </li>
              )}
              {isAuthenticated && (
                <li className="d-xl-none">
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}>
                    Đăng xuất
                  </a>
                </li>
              )}
            </ul>
            <i
              className={`mobile-nav-toggle d-xl-none ${mobileNavActive ? 'bi-x' : 'bi-list'}`}
              onClick={toggleMobileNav}
            ></i>
          </nav>

          {isAuthenticated ? (
            <div className="d-none d-sm-flex align-items-center" style={{ gap: '10px' }}>
              <ChatIcon />
              <NotificationBell />

              <div className="user-dropdown-container" style={{ position: 'relative' }}>
                <button
                  className="user-info-btn"
                  onClick={toggleUserDropdown}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--heading-color)',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    transition: 'background-color 0.3s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <i className="bi bi-person-circle" style={{ fontSize: '18px' }}></i>
                  <span>{user?.name || user?.username}</span>
                  <i className={`bi bi-chevron-${showUserDropdown ? 'up' : 'down'}`} style={{ fontSize: '12px' }}></i>
                </button>

                {showUserDropdown && (
                  <div
                    className="user-dropdown"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: '0',
                      marginTop: '8px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      minWidth: '200px',
                      zIndex: 1000,
                      overflow: 'hidden'
                    }}
                  >
                    <Link
                      to="/profile"
                      onClick={() => setShowUserDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        color: 'var(--heading-color)',
                        textDecoration: 'none',
                        transition: 'background-color 0.3s',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <i className="bi bi-person-circle"></i>
                      <span>Thông tin tài khoản</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        color: '#dc3545',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="d-none d-sm-flex align-items-center" style={{ gap: '10px' }}>
              <Link to="/login" className="cta-btn">
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
