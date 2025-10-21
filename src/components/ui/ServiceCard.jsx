/**
 * ServiceCard Component - Card cho Services section
 * 
 * Props:
 * - icon: icon class
 * - title: tiêu đề service
 * - description: mô tả
 * - className: class tùy chỉnh
 * - aos: animation (mặc định: 'fade-up')
 * - aosDelay: độ trễ animation
 * - onClick: hàm xử lý khi click
 */

const ServiceCard = ({
  icon,
  title,
  description,
  className = '',
  aos = 'fade-up',
  aosDelay = '100',
  onClick,
}) => {
  return (
    <div
      className={`col-lg-4 col-md-6 ${className}`}
      data-aos={aos}
      data-aos-delay={aosDelay}
    >
      <div className="service-item position-relative">
        {icon && (
          <div className="icon">
            <i className={icon}></i>
          </div>
        )}
        <a href="#" className="stretched-link" onClick={onClick}>
          {title && <h3>{title}</h3>}
        </a>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
};

export default ServiceCard;
