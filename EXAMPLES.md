/**
 * ===== EXAMPLE: Cách tạo component mới sử dụng UI Components =====
 * 
 * File: src/components/Newsletter.jsx
 * Ví dụ component đăng ký newsletter sử dụng các UI components có sẵn
 */

import { useState } from 'react';
import { Button, FormInput, SectionTitle } from './ui';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email
    if (!email.trim()) {
      setError('Email không được để trống');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email không hợp lệ');
      return;
    }

    // API call would go here
    console.log('Subscribe:', email);
    setSuccess(true);
    setEmail('');
    setError('');

    // Reset success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  return (
    <section id="newsletter" className="newsletter section">
      <div className="container">
        <SectionTitle
          title="Đăng ký Newsletter"
          subtitle="Nhận các tin tức mới nhất từ chúng tôi"
        />

        <div className="row align-items-center">
          <div className="col-lg-6">
            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="row gy-3">
                <div className="col-md-8">
                  <FormInput
                    type="email"
                    name="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={handleEmailChange}
                    error={error}
                  />
                </div>

                <div className="col-md-4">
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth={true}
                  >
                    Đăng ký
                  </Button>
                </div>
              </div>

              {success && (
                <div className="alert alert-success mt-3" role="alert">
                  ✅ Cảm ơn bạn đã đăng ký!
                </div>
              )}
            </form>
          </div>

          <div className="col-lg-6">
            <p className="text-muted">
              Hãy đăng ký nhận thông báo về các dịch vụ mới,
              ưu đãi và thông tin sức khỏe từ Medilab.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

/**
 * ===== EXAMPLE 2: Appointment Form Component =====
 * 
 * File: src/components/AppointmentForm.jsx
 */

// import { useState } from 'react';
// import { Button, FormInput, FormTextarea, SectionTitle } from './ui';

// const AppointmentForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     date: '',
//     department: '',
//     doctor: '',
//     message: '',
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Validate form...
//     console.log('Appointment:', formData);
//   };

//   return (
//     <section id="appointment" className="appointment section">
//       <div className="container">
//         <SectionTitle
//           title="Đặt lịch hẹn"
//           subtitle="Đặt lịch khám với bác sĩ của chúng tôi"
//         />

//         <form onSubmit={handleSubmit} className="appointment-form">
//           <div className="row">
//             <div className="col-md-6">
//               <FormInput
//                 label="Tên"
//                 name="name"
//                 placeholder="Tên của bạn"
//                 value={formData.name}
//                 onChange={handleChange}
//                 error={errors.name}
//                 required
//               />
//             </div>

//             <div className="col-md-6">
//               <FormInput
//                 label="Email"
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 error={errors.email}
//                 required
//               />
//             </div>

//             <div className="col-md-6">
//               <FormInput
//                 label="Điện thoại"
//                 type="tel"
//                 name="phone"
//                 placeholder="Số điện thoại"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="col-md-6">
//               <FormInput
//                 label="Ngày hẹn"
//                 type="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="col-md-12">
//               <FormTextarea
//                 label="Ghi chú (tùy chọn)"
//                 name="message"
//                 placeholder="Mô tả tình trạng sức khỏe..."
//                 rows={4}
//                 value={formData.message}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-12">
//               <Button type="submit" variant="primary" fullWidth={true}>
//                 Đặt lịch hẹn
//               </Button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default AppointmentForm;

/**
 * ===== EXAMPLE 3: Testimonial Card Component =====
 */

// import { Card } from './ui';

// const TestimonialCard = ({ text, author, position, image, rating }) => {
//   return (
//     <Card className="testimonial-card text-center" aos="fade-up">
//       <div className="rating mb-3">
//         {[...Array(rating)].map((_, i) => (
//           <i key={i} className="fas fa-star text-warning"></i>
//         ))}
//       </div>

//       <p className="text-muted mb-4">"{text}"</p>

//       <div className="d-flex align-items-center justify-content-center">
//         {image && (
//           <img
//             src={image}
//             alt={author}
//             className="rounded-circle me-3"
//             width="50"
//             height="50"
//           />
//         )}
//         <div>
//           <strong>{author}</strong>
//           <p className="text-muted small mb-0">{position}</p>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default TestimonialCard;
