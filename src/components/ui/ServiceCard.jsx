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
        {/* Image Section */}
        <div className="service-card-image">
          {image ? (
            <img src={image} alt={title} />
          ) : (
            <div className="service-card-placeholder">
              <i className={icon || 'fas fa-hospital'}></i>
            </div>
          )}

          {/* Discount Badge */}
          {discount && (
            <div className="service-card-discount">
              - {discount}
            </div>
          )}

          {/* Detail Link */}
          <div className="service-card-overlay">
            <button className="btn-detail" onClick={onDetail}>
              Xem chi tiết <i className="fas fa-arrow-right ms-2"></i>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="service-card-body">
          {/* Price */}
          {/* <div className="service-card-price">
            {formatPrice(price)}
          </div> */}

          {/* Title */}
          <h4 className="service-card-title">
            {title}
          </h4>

          {/* Footer Icons */}
          <div className="service-card-footer">
            {gender && (
              <div className="service-card-info">
                <i className="fas fa-venus-mars text-primary"></i>
                <span>{gender}</span>
              </div>
            )}
            <div className="service-card-info">
              <i className="fas fa-clock text-primary"></i>
              <span>Đặt lịch</span>
            </div>
            <div className="service-card-info">
              <i className="fas fa-map-marker-alt text-primary"></i>
              <span>{roomName || 'Phòng khám'}</span>
            </div>
            <div className="service-card-info">
              <i className="fas text-primary"></i>
              <span>{formatPrice(price) || 'Giá'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
