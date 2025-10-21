# Medilab React - Dự án Y tế

Dự án Medilab được chuyển đổi từ HTML tĩnh sang React.js

## 🚀 Tính năng

- ✅ Responsive Design với Bootstrap 5
- ✅ Animations với AOS (Animate On Scroll)
- ✅ React Router cho navigation
- ✅ Component-based architecture
- ✅ Modern React Hooks
- ✅ FontAwesome & Bootstrap Icons
- ✅ Smooth scroll và scroll-to-top button

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm build

# Preview production build
npm run preview
```

## 🏗️ Cấu trúc dự án

```
medilab-react/
├── src/
│   ├── components/
│   │   ├── Header.jsx       # Header với navigation
│   │   ├── Hero.jsx         # Hero section
│   │   ├── About.jsx        # About section
│   │   ├── Services.jsx     # Services section
│   │   ├── Doctors.jsx      # Doctors section
│   │   ├── Contact.jsx      # Contact form
│   │   └── Footer.jsx       # Footer
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css     # CSS chính
│   │   └── images/          # Hình ảnh
│   ├── App.jsx              # Component chính
│   └── main.jsx             # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## 🛠️ Technologies

- **React 19** - UI Library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Bootstrap 5** - CSS Framework
- **AOS** - Scroll animations
- **Bootstrap Icons** - Icon library
- **FontAwesome** - Additional icons
- **Swiper** - Carousel/slider
- **GLightbox** - Lightbox gallery

## 📝 Components

### Header
- Sticky navigation
- Mobile responsive menu
- Social links
- Contact information

### Hero
- Welcome banner
- Feature boxes với animations
- Call-to-action buttons

### About
- Company information
- Video player (GLightbox)
- Feature list

### Services
- Grid layout của các dịch vụ
- Icons và descriptions
- Hover effects

### Doctors
- Team member profiles
- Social links
- Responsive grid

### Contact
- Contact form
- Google Maps integration
- Contact information

### Footer
- Multi-column layout
- Links và navigation
- Social media links

## 🎨 Customization

### Thay đổi màu sắc
Chỉnh sửa CSS variables trong `src/assets/css/main.css`:

```css
:root {
  --background-color: #ffffff;
  --default-color: #444444;
  --heading-color: #2c4964;
  --accent-color: #1977cc;
}
```

### Thêm/sửa nội dung
Chỉnh sửa data trong các component tương ứng.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

Template từ [BootstrapMade](https://bootstrapmade.com/)

## 👨‍💻 Development

Dự án sử dụng Vite cho hot module replacement (HMR) và fast refresh.

Server dev: http://localhost:5173/

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## ✨ Features to Add

- [ ] Blog section
- [ ] Appointment booking system
- [ ] Patient portal
- [ ] Search functionality
- [ ] Multi-language support
- [ ] Dark mode

---

Được chuyển đổi sang React.js với ❤️
