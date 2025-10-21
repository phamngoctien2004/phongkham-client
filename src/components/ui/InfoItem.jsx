/**
 * InfoItem Component - Thông tin item có thể tái sử dụng
 * 
 * Props:
 * - icon: icon class (ví dụ: 'bi bi-envelope')
 * - title: tiêu đề
 * - description: mô tả
 * - className: class tùy chỉnh
 * - aos: animation (mặc định: 'fade-up')
 * - aosDelay: độ trễ animation
 */

const InfoItem = ({
  icon,
  title,
  description,
  className = '',
  aos = 'fade-up',
  aosDelay,
}) => {
  const dataAttrs = {
    'data-aos': aos,
  };

  if (aosDelay) {
    dataAttrs['data-aos-delay'] = aosDelay;
  }

  return (
    <div
      className={`info-item d-flex ${className}`}
      {...dataAttrs}
    >
      {icon && <i className={`${icon} flex-shrink-0`}></i>}
      <div>
        {title && <h3>{title}</h3>}
        {description && <p>{description}</p>}
      </div>
    </div>
  );
};

export default InfoItem;
