<!-- BEST PRACTICES: Hướng dẫn viết component tốt -->
# 🎯 Best Practices - Hướng dẫn viết Component Tốt

## 1. 📝 Cấu trúc Component

### ✅ Good (Cách tốt)
```jsx
/**
 * Button Component - Nút bấm có thể tái sử dụng
 * 
 * Props:
 * - children: nội dung button
 * - variant: 'primary', 'secondary' (default: 'primary')
 * - size: 'sm', 'md', 'lg' (default: 'md')
 * - onClick: hàm xử lý
 */

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  ...rest
}) => {
  // ... implementation
};

export default Button;
```

### ❌ Bad (Cách không tốt)
```jsx
const Btn = (props) => {
  return <button onClick={props.onClick}>{props.children}</button>;
};

export default Btn;
```

**Lý do:**
- Tên component không rõ ràng
- Không có documentation
- Không có default props
- Không có props destructuring

---

## 2. 🎨 Props Design

### ✅ Good
```jsx
// Sử dụng descriptive prop names
const Card = ({
  title,
  description,
  imageUrl,
  onClick,
  className,
}) => {
  // ...
};

// Sử dụng trong component
<Card
  title="My Card"
  description="Description"
  imageUrl="/img.jpg"
  onClick={() => {}}
/>
```

### ❌ Bad
```jsx
// Props names không rõ ràng
const Card = ({
  t,  // title là gì?
  d,  // description?
  img, // imageUrl?
  fn, // function nào?
}) => {
  // ...
};
```

---

## 3. 🔍 Default Props

### ✅ Good
```jsx
const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
  ...rest
}) => {
  // ...
};
```

### ❌ Bad
```jsx
const Button = (props) => {
  const variant = props.variant || 'primary'; // Kiểu cũ
  const size = props.size || 'md';
  // ...
};
```

---

## 4. 📚 Documentation

### ✅ Good
```jsx
/**
 * FormInput Component - Input field có thể tái sử dụng
 * 
 * @component
 * @example
 * const props = {
 *   label: "Email",
 *   type: "email",
 *   placeholder: "your@email.com"
 * }
 * return <FormInput {...props} />
 * 
 * Props:
 * - label (string): Tiêu đề input
 * - type (string): 'text', 'email', 'password' (default: 'text')
 * - placeholder (string): Placeholder text
 * - name (string): Attribute name
 * - value (string): Giá trị hiện tại
 * - onChange (function): Handler thay đổi
 * - error (string): Message lỗi
 * - required (boolean): Bắt buộc nhập (default: false)
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
  ...rest
}) => {
  // ...
};
```

### ❌ Bad
```jsx
const FormInput = (props) => {
  // Không có documentation
  // ...
};
```

---

## 5. ✨ Styling Patterns

### ✅ Good
```jsx
// Sử dụng className concatenation
const Button = ({ variant = 'primary', size = 'md', className = '' }) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  
  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`.trim()}
    >
      {/* content */}
    </button>
  );
};
```

### ❌ Bad
```jsx
// Hardcoded styles
const Button = ({ variant, size }) => {
  return (
    <button
      style={{
        backgroundColor: variant === 'primary' ? '#007bff' : '#6c757d',
        padding: size === 'lg' ? '20px' : '10px',
      }}
    >
      {/* content */}
    </button>
  );
};
```

---

## 6. 🎯 Single Responsibility

### ✅ Good
```jsx
// FormInput chỉ quản lý input
const FormInput = ({ name, value, onChange, error }) => {
  return (
    <>
      <input
        name={name}
        value={value}
        onChange={onChange}
      />
      {error && <span className="error">{error}</span>}
    </>
  );
};

// FormGroup quản lý layout
const FormGroup = ({ label, children, error }) => {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      {children}
      {error && <span className="error">{error}</span>}
    </div>
  );
};

// Sử dụng cùng nhau
<FormGroup label="Email" error={errors.email}>
  <FormInput
    name="email"
    value={formData.email}
    onChange={handleChange}
  />
</FormGroup>
```

### ❌ Bad
```jsx
// Làm quá nhiều việc trong một component
const FormInput = ({
  label,
  name,
  value,
  onChange,
  error,
  validate,
  onBlur,
  tooltip,
  icon,
  // ... quá nhiều props
}) => {
  // Quá phức tạp
};
```

---

## 7. 🔄 Composition

### ✅ Good
```jsx
// Sử dụng composition thay vì props drilling
const Card = ({ children, className, onClick }) => {
  return (
    <div className={`card ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

// Sử dụng
<Card>
  <h3>Title</h3>
  <p>Content</p>
  <button>Action</button>
</Card>
```

### ❌ Bad
```jsx
// Props quá nhiều
const Card = ({
  title,
  content,
  actionText,
  onAction,
  icon,
  subtitle,
  // ... quá nhiều
}) => {
  return (
    <div>
      {icon && <i className={icon}></i>}
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
      <p>{content}</p>
      <button onClick={onAction}>{actionText}</button>
    </div>
  );
};
```

---

## 8. 🚫 Avoid Props Drilling

### ✅ Good
```jsx
// Sử dụng Context hoặc composition
const ThemeContext = React.createContext();

const Button = () => {
  const { theme } = useContext(ThemeContext);
  return <button className={`btn-${theme}`}>Button</button>;
};
```

### ❌ Bad
```jsx
// Props drilling - truyền props qua nhiều layer
const App = () => {
  const theme = 'dark';
  return <Level1 theme={theme} />;
};

const Level1 = ({ theme }) => <Level2 theme={theme} />;
const Level2 = ({ theme }) => <Level3 theme={theme} />;
const Level3 = ({ theme }) => <Button theme={theme} />;
const Button = ({ theme }) => <button className={`btn-${theme}`} />;
```

---

## 9. 💾 Reusability Checklist

### Trước khi tạo component mới, hỏi:

- [ ] Component này có thể được sử dụng ở nhiều nơi?
- [ ] Props có thể cover các use cases khác nhau?
- [ ] Có thể thêm props mới mà không break existing code?
- [ ] Documentation có rõ ràng?
- [ ] Có test cases?

---

## 10. 🧪 Testing

### ✅ Good
```jsx
// Viết tests cho component
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  test('renders with correct variant', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  test('calls onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

---

## 11. 📋 Performance Tips

### ✅ Good
```jsx
// Sử dụng React.memo cho pure components
const ServiceCard = React.memo(({
  icon,
  title,
  description,
}) => {
  return (
    <div className="service-card">
      <i className={icon}></i>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
});

export default ServiceCard;
```

### ❌ Bad
```jsx
// Không optimize, re-render mỗi lần
const ServiceCard = ({ icon, title, description }) => {
  // ... implements
};

export default ServiceCard;
```

---

## 12. 🎓 Naming Conventions

### ✅ Good
```jsx
// Dùng PascalCase cho components
export const Button = () => {};
export const FormInput = () => {};
export const ServiceCard = () => {};

// Dùng camelCase cho functions
const handleSubmit = () => {};
const validateForm = () => {};
const calculateTotal = () => {};

// Dùng UPPER_CASE cho constants
const MAX_ITEMS = 10;
const DEFAULT_VARIANT = 'primary';
```

### ❌ Bad
```jsx
// lowercase component names
export const button = () => {};

// PascalCase functions
const HandleSubmit = () => {};

// Mixed case constants
const maxItems = 10;
```

---

## 13. 📚 Common Patterns

### Pattern 1: Compound Components
```jsx
// Card.jsx
const Card = ({ children }) => <div className="card">{children}</div>;

// Card.Header.jsx
Card.Header = ({ children }) => <div className="card-header">{children}</div>;

// Card.Body.jsx
Card.Body = ({ children }) => <div className="card-body">{children}</div>;

// Card.Footer.jsx
Card.Footer = ({ children }) => <div className="card-footer">{children}</div>;

// Sử dụng
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card>
```

### Pattern 2: Controlled Components
```jsx
const FormInput = ({ value, onChange, error }) => (
  <input
    value={value}
    onChange={onChange}
    className={error ? 'is-invalid' : ''}
  />
);
```

### Pattern 3: Flexible Props
```jsx
// Receiver props khác
const Button = ({ variant, size, className = '', ...rest }) => (
  <button className={`btn btn-${variant} btn-${size} ${className}`} {...rest}>
    {rest.children}
  </button>
);

// Sử dụng
<Button variant="primary" size="lg" disabled title="Tooltip">
  Click me
</Button>
```

---

## 🎯 Summary

### Khi viết component, nhớ:

1. ✅ **Tên rõ ràng** - Dùng descriptive names
2. ✅ **Documented** - Viết comment/JSDoc
3. ✅ **Single Responsibility** - Một component, một việc
4. ✅ **Reusable** - Có thể dùng ở nhiều nơi
5. ✅ **Flexible** - Props cover nhiều use cases
6. ✅ **Performant** - Optimize khi cần
7. ✅ **Testable** - Dễ test
8. ✅ **Default Props** - Giá trị mặc định hợp lý
9. ✅ **Error Handling** - Xử lý lỗi
10. ✅ **Consistent** - Theo style guide

---

**Last Updated:** October 21, 2025
