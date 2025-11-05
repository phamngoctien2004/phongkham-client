import { PageBanner, SectionTitle } from './ui';
import aboutImg from '../assets/images/about.jpg';

const About = ({ isHomePage = false }) => {
  return (
    <section id="about" className="about section">
      {!isHomePage && (
        <PageBanner
          title="GIỚI THIỆU VỀ CHÚNG TÔI"
          breadcrumbs={[
            { label: 'Trang chủ', link: '/' },
            { label: 'Giới thiệu' }
          ]}
        />
      )}
      <div className="container">
        <div className="row gy-4 gx-5">
          <div
            className="col-lg-6 position-relative align-self-start"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <img src={aboutImg} className="img-fluid" alt="" />
            <a
              href="https://www.youtube.com/watch?v=Y7f98aduVJ8"
              className="glightbox pulsating-play-btn"
            ></a>
          </div>

          <div className="col-lg-6 content" data-aos="fade-up" data-aos-delay="100">
            <h3>Về chúng tôi</h3>
            <p>
              Medilab là phòng khám đa khoa uy tín với nhiều năm kinh nghiệm trong lĩnh vực chăm sóc
              sức khỏe. Chúng tôi tự hào mang đến dịch vụ y tế chất lượng cao với đội ngũ bác sĩ
              chuyên môn giỏi, trang thiết bị hiện đại và quy trình khám chữa bệnh chuyên nghiệp.
            </p>
            <ul>
              <li>
                <i className="fa-solid fa-vial-circle-check"></i>
                <div>
                  <h5>Trang thiết bị y tế hiện đại</h5>
                  <p>
                    Đầu tư các thiết bị y tế tiên tiến, đảm bảo chẩn đoán chính xác và điều trị
                    hiệu quả
                  </p>
                </div>
              </li>
              <li>
                <i className="fa-solid fa-pump-medical"></i>
                <div>
                  <h5>Đội ngũ bác sĩ giàu kinh nghiệm</h5>
                  <p>
                    Bác sĩ chuyên khoa với trình độ cao, tận tâm và nhiệt tình trong công tác
                    khám chữa bệnh
                  </p>
                </div>
              </li>
              <li>
                <i className="fa-solid fa-heart-circle-check"></i>
                <div>
                  <h5>Dịch vụ chăm sóc toàn diện</h5>
                  <p>
                    Cung cấp đầy đủ các dịch vụ y tế từ khám tổng quát đến chuyên khoa,
                    xét nghiệm và điều trị
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
