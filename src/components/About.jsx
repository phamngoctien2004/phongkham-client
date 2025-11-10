import { PageBanner } from './ui';
import './About.css';

const About = ({ isHomePage = false }) => {
  const departments = [
    {
      id: 1,
      icon: 'fas fa-user-md',
      title: 'NAM KHOA',
      description: 'Khám và điều trị các bệnh viêm nhiễm đường sinh dục nam giới, viêm đường tiết niệu, rối loạn chức năng sinh dục như xuất tinh sớm, liệt dương, cắt bao quy đầu,...',
      color: '#60B6E8'
    },
    {
      id: 2,
      icon: 'fas fa-female',
      title: 'PHỤ KHOA',
      description: 'Khám và điều trị các bệnh viêm phụ khoa như viêm âm đạo, viêm lộ tuyến cổ tử cung, viêm với trứng, u xơ tử vấn và thực hiện kế hoạch hóa gia đình.',
      color: '#F47C87'
    },
    {
      id: 3,
      icon: 'fas fa-bacteria',
      title: 'BỆNH XÃ HỘI',
      description: 'Kiểm tra, xét nghiệm, phát hiện các bệnh xã hội như sùi mào gà, bệnh lậu, giang mai, mụn rộp sinh dục.',
      color: '#FFA85C'
    },
    {
      id: 4,
      icon: 'fas fa-seedling',
      title: 'HẬU MÔN TRỰC TRÀNG',
      description: 'Kiểm tra và điều trị bệnh hậu môn như trĩ nội, trĩ ngoại, trĩ hỗn hợp, apxe hậu môn, Polyp hậu môn,...',
      color: '#8BC898'
    }
  ];

  const treatments = [
    {
      id: 1,
      image: '/toa_nha_thai_ha.jpg',
      title: 'Phương pháp điều trị bằng thuốc',
      description: 'Là phương pháp điều trị phổ biến với những trường hợp nhiễm ở mức độ nhẹ. Phòng khám Thái Hà kết hợp điều trị bằng thuốc Đông- Tây y kết hợp với liệu lượng hợp lý, giảm thiểu kháng sinh.'
    },
    {
      id: 2,
      image: '/banner_1.png',
      title: 'Điều trị bằng xâm lấn tối thiểu',
      description: 'Những cuộc tiểu phẫu thở ít xâm lấn, thời gian tiểu phẫu ngắn như cắt bao quy đầu công nghệ cao, kỹ thuật dao Leep trị viêm lộ tuyến cổ tử cung,... là phương pháp mang lại hiệu quả cao hiện nay.'
    },
    {
      id: 3,
      image: '/banner_2.png',
      title: 'Điều trị bằng liệu pháp miễn dịch',
      description: 'Với các bệnh xã hội có nguyen nhân do vi khuẩn, virus khó tiêu diệt, phòng khám Thái Hà áp dụng liệu pháp tự miễn dịch. Một lượng thuốc nhỏ truyền vào cơ thể, được các máy quang dẫn kích hoạt giúp cơ thể đẩ có sự hoạt động của vi khuẩn.'
    },
    {
      id: 4,
      image: '/banner_3.png',
      title: 'Điều trị bằng quang sinh học',
      description: 'Các tia bức xạ được chiếu vào các vị trí bệnh như nốt sùi, vết lở loét,... với thông số cho phép cô tác dụng làm rụng các nốt sùi, tiểu diệt vi khuẩn tại chỗ, giúp tổn thương nhanh lành.'
    }
  ];

  const activities = [
    {
      id: 1,
      icon: 'fas fa-comments',
      title: 'Hoạt động hội thảo chuyên giao công nghệ, chia sẻ kinh nghiệm y học.',
      color: '#D1F0F4'
    },
    {
      id: 2,
      icon: 'fas fa-gift',
      title: 'Hoạt động ưu đãi, hỗ trợ về chi phí khám cũng như điều trị cho người bệnh.',
      color: '#FFE6E6'
    },
    {
      id: 3,
      icon: 'fas fa-hand-holding-heart',
      title: 'Thường xuyên thực hiện những hoạt động thiện nguyện giúp đỡ hoàn cảnh khó khăn.',
      color: '#E8F5E9'
    }
  ];

  const facilities = [
    '/about_1.jpg',
    '/banner_1.png',
    '/banner_2.png',
    '/banner_3.png',
    '/banner_new_1.webp'
  ];

  return (
    <div className="about-page">
      {!isHomePage && (
        <PageBanner
          title="GIỚI THIỆU"
          breadcrumbs={[
            { label: 'Trang chủ', link: '/' },
            { label: 'Giới thiệu' }
          ]}
        />
      )}

      {/* Giới thiệu về phòng khám */}
      <section className="about-intro-section">
        <div className="container">
          <div className="about-intro-content">
            <p className="intro-text">
              Phòng khám đa khoa Thái Hà được thành lập dựa trên ý tưởng xây dựng một phòng khám với phong cách hiện đại, dịch vụ chất lượng cao. Khám và điều trị tại đây, bệnh nhân luôn được đảm bảo về quyền lợi, hướng dịch vụ y tế an toàn, tiện ích, chi phí hợp lý. Hiện phòng khám hoạt động với 4 chuyên khoa nội bật:
            </p>

            <div className="departments-grid">
              {departments.map(dept => (
                <div key={dept.id} className="department-card">
                  <div className="dept-icon" style={{ backgroundColor: dept.color }}>
                    <i className={dept.icon}></i>
                  </div>
                  <h3 className="dept-title">{dept.title}</h3>
                  <p className="dept-description">{dept.description}</p>
                  <button className="dept-btn">XEM THÊM</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Phương pháp điều trị nổi bật */}
      <section className="treatment-methods-section">
        <div className="container">
          <div className="section-icon">
            <i className="fas fa-stethoscope"></i>
          </div>
          <h2 className="section-title">PHƯƠNG PHÁP ĐIỀU TRỊ NỔI BẬT</h2>

          <div className="treatments-grid">
            {treatments.map(treatment => (
              <div key={treatment.id} className="treatment-card">
                <div className="treatment-image">
                  <img src={treatment.image} alt={treatment.title} />
                </div>
                <div className="treatment-content">
                  <h3 className="treatment-title">{treatment.title}</h3>
                  <div className="treatment-divider"></div>
                  <p className="treatment-description">{treatment.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hoạt động nổi bật */}
      <section className="activities-section">
        <div className="container">
          <div className="section-icon">
            <i className="fas fa-award"></i>
          </div>
          <h2 className="section-title">HOẠT ĐỘNG NỔI BẬT CỦA PHÒNG KHÁM</h2>

          <div className="activities-grid">
            {activities.map(activity => (
              <div key={activity.id} className="activity-card" style={{ backgroundColor: activity.color }}>
                <div className="activity-icon">
                  <i className={activity.icon}></i>
                </div>
                <div className="activity-divider"></div>
                <p className="activity-text">{activity.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Không gian điều trị */}
      <section className="facilities-section">
        <div className="container">
          <div className="section-icon">
            <i className="fas fa-images"></i>
          </div>
          <h2 className="section-title">KHÔNG GIAN ĐIỀU TRỊ SẠCH - XANH - TRONG LÀNH</h2>

          <div className="facilities-gallery">
            <div className="facility-main">
              <img src={facilities[0]} alt="Phòng khám Thái Hà" />
            </div>
            <div className="facility-grid">
              {facilities.slice(1).map((image, index) => (
                <div key={index} className="facility-item">
                  <img src={image} alt={`Không gian ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
