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
    <header id="header" className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-top-wrapper">
        <div className="container header-top-inner">
          <div className="header-top-left">
            <Link to="/" className="header-logo">
              <img src="/logo_header.png" alt="Phòng khám đa khoa Thái Hà" />
            </Link>
            <div className="header-search d-none d-md-flex">
              <input type="text" placeholder="Tìm kiếm" aria-label="Tìm kiếm" />
              <button type="button" aria-label="Tìm kiếm">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>

          <div className="header-top-right">
            <div className="header-info-group d-none d-lg-flex">
              <div className="header-info-item">
                <div className="info-icon">
                  <i className="bi bi-telephone"></i>
                </div>
                <div className="info-content">
                  <span className="info-label">Đường dây nóng</span>
                  <a href="tel:1900565656" className="info-value">1900565656</a>
                </div>
              </div>
              <div className="header-info-item">
                <div className="info-icon" onClick={() => {
                  // Toggle chat khi click vào icon
                  document.querySelector('.chat-icon-btn')?.click();
                }} style={{ cursor: 'pointer' }}>
                  <i className="bi bi-chat-dots"></i>
                </div>
                <div className="info-content">
                  <span className="info-label">Liên hệ</span>
                  <span className="info-value">Hỗ trợ khách hàng</span>
                </div>
              </div>
            </div>

            <div className="header-action-group">


              {isAuthenticated ? (
                <div className="auth-actions">
                  {/* Chat icon ẩn để giữ functionality nhưng không hiển thị */}
                  <div style={{ display: 'none' }}>
                    <ChatIcon />
                  </div>
                  <NotificationBell />

                  <div className="user-dropdown-container">
                    <button
                      className="user-info-btn"
                      onClick={toggleUserDropdown}
                      onMouseEnter={(e) => e.currentTarget.classList.add('hovered')}
                      onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}
                    >
                      <i className="bi bi-person-circle"></i>
                      <span>{user?.name || user?.username}</span>
                      <i className={`bi bi-chevron-${showUserDropdown ? 'up' : 'down'}`}></i>
                    </button>

                    {showUserDropdown && (
                      <div className="user-dropdown">
                        <Link to="/profile" onClick={() => setShowUserDropdown(false)}>
                          <i className="bi bi-person-circle"></i>
                          <span>Thông tin tài khoản</span>
                        </Link>
                        <button onClick={handleLogout}>
                          <i className="bi bi-box-arrow-right"></i>
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="auth-links">
                  <Link to="/register">Đăng ký</Link>
                  <span className="divider">|</span>
                  <Link to="/login">Đăng nhập</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container header-search-mobile d-md-none">
          <div className="header-search">
            <input type="text" placeholder="Tìm kiếm" aria-label="Tìm kiếm" />
            <button type="button" aria-label="Tìm kiếm">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="header-bottom">
        <div className="container header-bottom-inner">
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
                  Dịch vụ y tế
                </Link>
              </li>
              <li>
                <Link to="/doctors" onClick={closeMobileNav}>
                  Đội ngũ Bác sĩ
                </Link>
              </li>
              <li>
                <Link to="/news" onClick={closeMobileNav}>
                  Tin tức y tế
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={closeMobileNav}>
                  Liên hệ
                </Link>
              </li>

              {isAuthenticated && (
                <li>
                  <Link to="/dat-lich" onClick={closeMobileNav}>
                    Đặt lịch
                  </Link>
                </li>
              )}
            </ul>
            <i
              className={`mobile-nav-toggle d-xl-none ${mobileNavActive ? 'bi-x' : 'bi-list'}`}
              onClick={toggleMobileNav}
            ></i>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
