/**
 * FormInput Component - Input field có thể tái sử dụng
 * 
 * Props:
 * - label: tiêu đề input
 * - type: 'text', 'email', 'password', 'number', etc. (mặc định: 'text')
 * - placeholder: placeholder text
 * - name: tên của input
 * - value: giá trị hiện tại
 * - onChange: hàm xử lý khi thay đổi
 * - error: message lỗi
 * - required: boolean (mặc định: false)
 * - className: class tùy chỉnh
 * - disabled: boolean (mặc định: false)
 */

const FormInput = ({
  label,
  type = 'text',
  placeholder,
  name,
  value,
  onChange,
  error,
  required = false,
  className = '',
  disabled = false,
  ...rest
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        name={name}
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...rest}
      />
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default FormInput;
