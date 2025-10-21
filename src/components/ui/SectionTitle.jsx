/**
 * SectionTitle Component - Tiêu đề section có thể tái sử dụng
 * 
 * Props:
 * - title: tiêu đề chính
 * - subtitle: mô tả/tiêu đề phụ
 * - centered: boolean (mặc định: true)
 * - className: class tùy chỉnh
 * - aos: animation (mặc định: 'fade-up')
 */

const SectionTitle = ({
  title,
  subtitle,
  centered = true,
  className = '',
  aos = 'fade-up',
}) => {
  return (
    <div className={`section-title ${className}`} data-aos={aos}>
      {centered && <h2>{title}</h2>}
      {!centered && <h2>{title}</h2>}
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
