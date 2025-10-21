/**
 * Button Component - Có thể tái sử dụng
 * 
 * Props:
 * - children: nội dung button
 * - variant: 'primary', 'secondary', 'danger', 'light' (mặc định: 'primary')
 * - size: 'sm', 'md', 'lg' (mặc định: 'md')
 * - className: class tùy chỉnh thêm
 * - onClick: hàm xử lý khi click
 * - type: 'button', 'submit', 'reset' (mặc định: 'button')
 * - disabled: boolean (mặc định: false)
 * - fullWidth: boolean (mặc định: false)
 */

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  ...rest
}) => {
  const variantClasses = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    danger: 'btn btn-danger',
    light: 'btn btn-light',
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  const baseClass = variantClasses[variant] || variantClasses.primary;
  const sizeClass = sizeClasses[size] || '';
  const widthClass = fullWidth ? 'w-100' : '';

  return (
    <button
      type={type}
      className={`${baseClass} ${sizeClass} ${widthClass} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
