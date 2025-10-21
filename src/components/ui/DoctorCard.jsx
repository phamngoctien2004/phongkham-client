/**
 * DoctorCard Component - Card cho Doctors section
 * 
 * Props:
 * - image: URL của hình ảnh
 * - name: tên bác sĩ
 * - position: vị trí/chuyên khoa
 * - description: mô tả
 * - socialLinks: mảng các link mạng xã hội
 * - className: class tùy chỉnh
 * - aos: animation (mặc định: 'fade-up')
 * - aosDelay: độ trễ animation
 */

const DoctorCard = ({
  image,
  name,
  position,
  description,
  socialLinks = [
    { icon: 'bi bi-twitter-x', url: '#' },
    { icon: 'bi bi-facebook', url: '#' },
    { icon: 'bi bi-instagram', url: '#' },
    { icon: 'bi bi-linkedin', url: '#' },
  ],
  className = '',
  aos = 'fade-up',
  aosDelay = '100',
}) => {
  return (
    <div
      className={`col-lg-6 ${className}`}
      data-aos={aos}
      data-aos-delay={aosDelay}
    >
      <div className="team-member d-flex align-items-start">
        {image && (
          <div className="pic">
            <img src={image} className="img-fluid" alt={name} />
          </div>
        )}
        <div className="member-info">
          {name && <h4>{name}</h4>}
          {position && <span>{position}</span>}
          {description && <p>{description}</p>}
          {socialLinks && socialLinks.length > 0 && (
            <div className="social">
              {socialLinks.map((link, index) => (
                <a key={index} href={link.url}>
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
