import heroImg from '../assets/images/hero-bg.jpg';
import { Link } from 'react-router-dom';

const Hero = ({ showContent = false }) => {
  return (
    <section id="hero" className="hero section light-background">
      <img src={heroImg} alt="" data-aos="fade-in" />

      <div className="container position-relative">
        <div className="welcome position-relative" data-aos="fade-down" data-aos-delay="100">
          <h2>CHÀO MỪNG BẠN ĐÊN VỚI MEDILAB</h2>
          <p>Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe chuyên nghiệp và tận tâm</p>
        </div>

        {showContent && (
          <div className="content row gy-4">
            <div className="col-lg-4 d-flex align-items-stretch">
              <div className="why-box" data-aos="zoom-out" data-aos-delay="200">
                <h3>Tại sao chọn Medilab?</h3>
                <p>
                  Với đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị y tế hiện đại và quy trình
                  khám chữa bệnh chuyên nghiệp, Medilab luôn đặt sức khỏe của bạn lên hàng đầu.
                  Chúng tôi cung cấp dịch vụ chăm sóc sức khỏe toàn diện với chi phí hợp lý,
                  thời gian linh hoạt và quy trình đặt lịch nhanh chóng, tiện lợi.
                </p>
                <div className="text-center">
                  <Link to="/dat-lich" className="more-btn">
                    <span>Đặt lịch ngay</span> <i className="bi bi-chevron-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-8 d-flex align-items-stretch">
              <div className="d-flex flex-column justify-content-center">
                <div className="row gy-4">
                  <div className="col-xl-4 d-flex align-items-stretch">
                    <div className="icon-box" data-aos="zoom-out" data-aos-delay="300">
                      <i className="bi bi-clipboard-data"></i>
                      <h4>Hồ sơ bệnh án điện tử</h4>
                      <p>
                        Quản lý hồ sơ sức khỏe dễ dàng với hệ thống lưu trữ điện tử an toàn và
                        tiện lợi
                      </p>
                    </div>
                  </div>

                  <div className="col-xl-4 d-flex align-items-stretch">
                    <div className="icon-box" data-aos="zoom-out" data-aos-delay="400">
                      <i className="bi bi-gem"></i>
                      <h4>Dịch vụ chất lượng cao</h4>
                      <p>
                        Đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm, tận tâm và chuyên nghiệp
                        trong từng dịch vụ
                      </p>
                    </div>
                  </div>

                  <div className="col-xl-4 d-flex align-items-stretch">
                    <div className="icon-box" data-aos="zoom-out" data-aos-delay="500">
                      <i className="bi bi-inboxes"></i>
                      <h4>Đặt lịch trực tuyến nhanh chóng</h4>
                      <p>
                        Đặt lịch khám dễ dàng qua hệ thống online, tiết kiệm thời gian và
                        thuận tiện
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
