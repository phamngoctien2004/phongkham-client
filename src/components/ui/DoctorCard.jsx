/**
 * DoctorCard Component - Card cho Doctors section
 * 
 * Props:
 * - image: URL của hình ảnh
 * - name: tên bác sĩ
 * - position: vị trí/chuyên khoa
 * - examinationFee: phí khám (số)
 * - description: mô tả (optional, backward compatible)
 * - socialLinks: mảng các link mạng xã hội (optional)
 * - onDetail: callback khi click "Xem chi tiết"
 * - className: class tùy chỉnh
 * - aos: animation (mặc định: 'fade-up')
 * - aosDelay: độ trễ animation
 * - disableAnimation: tắt animation (mặc định: false)
 */

const DoctorCard = ({
  image,
  name,
  position,
  examinationFee,
  description,
  socialLinks,
  onDetail,
  className = '',
  aos = 'fade-up',
  aosDelay = '100',
  disableAnimation = false,
}) => {
  const dataAttrs = {};

  if (!disableAnimation) {
    dataAttrs['data-aos'] = aos;
    dataAttrs['data-aos-delay'] = aosDelay;
  }

  // Format examination fee
  const formatFee = (fee) => {
    if (!fee) return '';
    return new Intl.NumberFormat('vi-VN').format(fee) + ' đ';
  };

  const handleDetailClick = () => {
    if (onDetail) {
      onDetail();
    }
  };

  return (
    <div
      className={`col-lg-4 ${className}`}
      {...dataAttrs}
    >
      <div className="team-member">
        {/* Overlay for entire card */}
        <div className="doctor-card-overlay" onClick={handleDetailClick}>
          <button className="btn-doctor-detail">
            Đặt lịch ngay
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>

        {image && (
          <div className="pic">
            <img src={image} className="img-fluid" alt={name} />
          </div>
        )}
        <div className="member-info">
          {name && <h4>{name}</h4>}
          {position && <span>{position}</span>}

          {/* Button đặt lịch ngay */}
          <button className="btn-appointment-now" onClick={handleDetailClick}>
            Đặt lịch ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
