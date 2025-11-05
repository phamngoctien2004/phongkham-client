/**
 * ServiceCard Component - Card cho Services section
 * 
 * Props:
 * - image: ảnh dịch vụ
 * - icon: icon class (fallback nếu không có ảnh)
 * - title: tiêu đề service
 * - description: mô tả
 * - price: giá dịch vụ
 * - discount: phần trăm giảm giá (optional)
 * - gender: giới tính (Nam/Nữ) (optional)
 * - roomName: tên phòng khám
 * - className: class tùy chỉnh
 * - aos: animation (mặc định: 'fade-up')
 * - aosDelay: độ trễ animation
 * - disableAnimation: tắt animation (mặc định: false)
 * - onDetail: hàm xử lý khi click "Xem chi tiết"
 */

const ServiceCard = ({
  image,
  icon,
  title,
  description,
  price,
  discount,
  gender,
  roomName,
  className = '',
  aos = 'fade-up',
  aosDelay = '100',
  disableAnimation = false,
  onDetail,
}) => {
  const dataAttrs = {};

  if (!disableAnimation) {
    dataAttrs['data-aos'] = aos;
    dataAttrs['data-aos-delay'] = aosDelay;
  }

  // Format giá tiền
  const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  return (
    <div
      className={`col-lg-4 col-md-6 mb-4 ${className}`}
      {...dataAttrs}
    >
      <div className="service-card-modern">
        {/* Logo Badge */}
        <div className="service-card-logo">
          <i className="fas fa-hospital"></i>
        </div>

        {/* Image Section with Icon */}
        <div className="service-card-image">
          {image ? (
            <img src={image} alt={title} />
          ) : (
            <div className="service-card-icon-wrapper">
              <div className="service-card-icon">
                <i className={icon || 'fas fa-hospital'}></i>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="service-card-body">
          {/* Title */}
          <h4 className="service-card-title">
            {title}
          </h4>

          {/* Description */}
          <p className="service-card-description">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="service-card-actions">
            <button className="btn-service-book" onClick={onDetail}>
              <i className="fas fa-calendar-alt"></i>
              Đặt lịch
            </button>
            <button className="btn-service-detail" onClick={onDetail}>
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
