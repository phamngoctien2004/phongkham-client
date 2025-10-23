<!-- README: UI Components Reusable Guide -->
# UI Components - Hướng dẫn sử dụng

## 📁 Cấu trúc thư mục

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx           # Component nút bấm
│   │   ├── FormInput.jsx        # Component input field
│   │   ├── FormTextarea.jsx     # Component textarea
│   │   ├── SectionTitle.jsx     # Component tiêu đề section
│   │   ├── Card.jsx             # Component card container
│   │   ├── InfoItem.jsx         # Component thông tin item
│   │   ├── ServiceCard.jsx      # Component card dịch vụ
│   │   ├── DoctorCard.jsx       # Component card bác sĩ
│   │   └── index.js             # Export tất cả components
│   ├── Services.jsx
│   ├── Doctors.jsx
│   ├── Contact.jsx
│   └── ...
```

## 🎯 Các component có sẵn

### 1. **Button** - Nút bấm có thể tái sử dụng

```jsx
import { Button } from './ui';

// Cách sử dụng cơ bản
<Button>Click me</Button>

// Với các props
<Button 
  variant="primary"      // primary, secondary, danger, light
  size="lg"              // sm, md, lg
  onClick={() => console.log('clicked')}
  disabled={false}
  fullWidth={true}
>
  Send
</Button>

// Props:
- children: nội dung button
- variant: 'primary' | 'secondary' | 'danger' | 'light' (default: 'primary')
- size: 'sm' | 'md' | 'lg' (default: 'md')
- type: 'button' | 'submit' | 'reset' (default: 'button')
- disabled: boolean (default: false)
- fullWidth: boolean (default: false)
- className: custom CSS classes
- onClick: event handler
```

### 2. **FormInput** - Input field

```jsx
import { FormInput } from './ui';

// Cách sử dụng
<FormInput
  label="Tên của bạn"
  name="name"
  type="text"
  placeholder="Nhập tên..."
  value={formData.name}
  onChange={handleChange}
  error={errors.name}
  required
/>

// Props:
- label: string - tiêu đề input
- name: string - tên attribute
- type: 'text' | 'email' | 'password' | ... (default: 'text')
- placeholder: string
- value: string
- onChange: function
- error: string - message lỗi
- required: boolean (default: false)
- disabled: boolean (default: false)
- className: custom CSS classes
```

### 3. **FormTextarea** - Textarea field

```jsx
import { FormTextarea } from './ui';

<FormTextarea
  label="Thông điệp"
  name="message"
  placeholder="Nhập thông điệp..."
  rows={5}
  value={formData.message}
  onChange={handleChange}
  error={errors.message}
  required
/>

// Props:
- label: string
- name: string
- placeholder: string
- value: string
- onChange: function
- rows: number (default: 3)
- error: string
- required: boolean (default: false)
- disabled: boolean (default: false)
- className: custom CSS classes
```

### 4. **SectionTitle** - Tiêu đề section

```jsx
import { SectionTitle } from './ui';

<SectionTitle
  title="Dịch vụ"
  subtitle="Mô tả về dịch vụ..."
  centered={true}
  aos="fade-up"
/>

// Props:
- title: string - tiêu đề chính
- subtitle: string - mô tả
- centered: boolean (default: true)
- aos: string - animation type (default: 'fade-up')
- className: custom CSS classes
```

### 5. **Card** - Generic card container

```jsx
import { Card } from './ui';

<Card
  className="custom-class"
  aos="fade-up"
  aosDelay="100"
  onClick={() => console.log('card clicked')}
>
  <h3>Card Title</h3>
  <p>Card content...</p>
</Card>

// Props:
- children: React elements
- className: custom CSS classes
- aos: string (default: 'fade-up')
- aosDelay: string
- onClick: function
```

### 6. **InfoItem** - Thông tin item

```jsx
import { InfoItem } from './ui';

<InfoItem
  icon="bi bi-phone"
  title="Gọi cho chúng tôi"
  description="+1 5589 55488 55"
  aos="fade-up"
  aosDelay="200"
/>

// Props:
- icon: string - icon class (bootstrap-icons)
- title: string
- description: string
- className: custom CSS classes
- aos: string (default: 'fade-up')
- aosDelay: string
```

### 7. **ServiceCard** - Card cho services

```jsx
import { ServiceCard } from './ui';

<ServiceCard
  icon="fas fa-heartbeat"
  title="Dịch vụ sức khỏe"
  description="Mô tả dịch vụ..."
  aosDelay="100"
/>

// Props:
- icon: string - icon class
- title: string
- description: string
- className: custom CSS classes
- aos: string (default: 'fade-up')
- aosDelay: string (default: '100')
- onClick: function
```

### 8. **DoctorCard** - Card cho doctors

```jsx
import { DoctorCard } from './ui';

<DoctorCard
  image={doctorImage}
  name="Dr. John Doe"
  position="Cardiologist"
  description="Giới thiệu bác sĩ..."
  socialLinks={[
    { icon: 'bi bi-twitter-x', url: '#' },
    { icon: 'bi bi-facebook', url: '#' },
  ]}
  aosDelay="100"
/>

// Props:
- image: string - URL hình ảnh
- name: string
- position: string - chuyên khoa
- description: string
- socialLinks: array - { icon, url }
- className: custom CSS classes
- aos: string (default: 'fade-up')
- aosDelay: string (default: '100')
```

## 💡 Cách import đơn giản

```jsx
// Thay vì import từng component
import Button from './components/ui/Button';
import FormInput from './components/ui/FormInput';

// Có thể import từ index.js
import { Button, FormInput, FormTextarea, SectionTitle } from './components/ui';
```

## 🎨 Ví dụ sử dụng complete

```jsx
import { useState } from 'react';
import {
  Button,
  FormInput,
  FormTextarea,
  SectionTitle,
  InfoItem,
} from './ui';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <section>
      <SectionTitle
        title="Liên hệ"
        subtitle="Gửi thông điệp cho chúng tôi"
      />

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Tên"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <FormTextarea
          label="Thông điệp"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          required
        />

        <Button type="submit" variant="primary">
          Gửi
        </Button>
      </form>

      <InfoItem
        icon="bi bi-telephone"
        title="Điện thoại"
        description="+1 5589 55488 55"
      />
    </section>
  );
}

export default ContactForm;
```

## 🔧 Tinh chỉnh CSS Bootstrap

Các components sử dụng Bootstrap CSS classes. Để tùy chỉnh:

```jsx
// Thêm custom classes
<Button className="custom-color">Custom Button</Button>

// Hoặc chỉnh sửa trong CSS files
.custom-color {
  background-color: #your-color;
  color: #white;
}
```

## 📋 Checklist cập nhật

✅ Button - Hoàn thành  
✅ FormInput - Hoàn thành  
✅ FormTextarea - Hoàn thành  
✅ SectionTitle - Hoàn thành  
✅ Card - Hoàn thành  
✅ InfoItem - Hoàn thành  
✅ ServiceCard - Hoàn thành  
✅ DoctorCard - Hoàn thành  

## 🚀 Tiếp theo

- [ ] Tạo component Form wrapper
- [ ] Tạo component Modal
- [ ] Tạo component Alert/Toast
- [ ] Tạo component Pagination
- [ ] Tạo component Navbar
