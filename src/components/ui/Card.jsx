/**
 * Card Component - Card container có thể tái sử dụng
 * 
 * Props:
 * - children: nội dung card
 * - className: class tùy chỉnh
 * - aos: animation (mặc định: 'fade-up')
 * - aosDelay: độ trễ animation
 * - onClick: hàm xử lý khi click
 */

const Card = ({
  children,
  className = '',
  aos = 'fade-up',
  aosDelay,
  onClick,
}) => {
  const dataAttrs = {
    'data-aos': aos,
  };

  if (aosDelay) {
    dataAttrs['data-aos-delay'] = aosDelay;
  }

  return (
    <div className={`card ${className}`} onClick={onClick} {...dataAttrs}>
      {children}
    </div>
  );
};

export default Card;
