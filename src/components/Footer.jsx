import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="footer" className="footer light-background">
      <div className="container footer-top">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6 footer-about">
            <Link to="/" className="logo d-flex align-items-center">
              <span className="sitename">Phòng khám đa khoa Thái Hà</span>
            </Link>
            <div className="footer-contact pt-3">
              <p>Thái Hà, Đống Đa</p>
              <p>Hà Nội</p>
              <p className="mt-3">
                <strong>Điện thoại:</strong> <span>+84 28 3824 5678</span>
              </p>
              <p>
                <strong>Email:</strong> <span>contact@dakhoathaiha.vn</span>
              </p>
            </div>
            <div className="social-links d-flex mt-4">
              <a href="">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Liên kết nhanh</h4>
            <ul>
              <li>
                <Link to="/">Trang chủ</Link>
              </li>
              <li>
                <Link to="/about">Giới thiệu</Link>
              </li>
              <li>
                <Link to="/services">Dịch vụ</Link>
              </li>
              <li>
                <Link to="/doctors">Đội ngũ bác sĩ</Link>
              </li>
              <li>
                <Link to="/contact">Liên hệ</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Dịch vụ</h4>
            <ul>
              <li>
                <Link to="/services">Khám tổng quát</Link>
              </li>
              <li>
                <Link to="/services">Khám chuyên khoa</Link>
              </li>
              <li>
                <Link to="/services">Xét nghiệm</Link>
              </li>
              <li>
                <Link to="/services">Chẩn đoán hình ảnh</Link>
              </li>
              <li>
                <Link to="/services">Tư vấn sức khỏe</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Chuyên khoa</h4>
            <ul>
              <li>
                <a href="#">Nội khoa</a>
              </li>
              <li>
                <a href="#">Ngoại khoa</a>
              </li>
              <li>
                <a href="#">Sản phụ khoa</a>
              </li>
              <li>
                <a href="#">Nhi khoa</a>
              </li>
              <li>
                <a href="#">Tim mạch</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Tiện ích</h4>
            <ul>
              <li>
                <Link to="/dat-lich">Đặt lịch khám</Link>
              </li>
              <li>
                <Link to="/news">Tin tức</Link>
              </li>
              <li>
                <a href="#">Hỏi đáp</a>
              </li>
              <li>
                <a href="#">Hướng dẫn</a>
              </li>
              <li>
                <a href="#">Chính sách bảo mật</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
