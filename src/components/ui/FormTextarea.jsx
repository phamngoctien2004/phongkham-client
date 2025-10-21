/**
 * FormTextarea Component - Textarea field có thể tái sử dụng
 * 
 * Props:
 * - label: tiêu đề textarea
 * - placeholder: placeholder text
 * - name: tên của textarea
 * - value: giá trị hiện tại
 * - onChange: hàm xử lý khi thay đổi
 * - rows: số dòng (mặc định: 3)
 * - error: message lỗi
 * - required: boolean (mặc định: false)
 * - className: class tùy chỉnh
 * - disabled: boolean (mặc định: false)
 */

const FormTextarea = ({
  label,
  placeholder,
  name,
  value,
  onChange,
  rows = 3,
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
      <textarea
        className={`form-control ${error ? 'is-invalid' : ''}`}
        name={name}
        id={name}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...rest}
      ></textarea>
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default FormTextarea;
