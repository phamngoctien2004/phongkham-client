import { useState } from 'react';
import { SectionTitle, Button, FormInput, FormTextarea, InfoItem } from './ui';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên không được để trống';
    if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.subject.trim()) newErrors.subject = 'Tiêu đề không được để trống';
    if (!formData.message.trim()) newErrors.message = 'Thông điệp không được để trống';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Form data:', formData);
    // TODO: Gửi dữ liệu đến server
    alert('Thông điệp đã được gửi!');

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <section id="contact" className="contact section">
      <div className="container">
        <SectionTitle
          title="Contact"
          subtitle="Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit"
        />
      </div>

      <div className="mb-5" data-aos="fade-up" data-aos-delay="200">
        <iframe
          style={{ border: 0, width: '100%', height: '270px' }}
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d48389.78314118045!2d-74.006138!3d40.710059!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Conference%20Center!5e0!3m2!1sen!2sus!4v1676961268712!5m2!1sen!2sus"
          frameBorder="0"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row gy-4">
          <div className="col-lg-4">
            <InfoItem
              icon="bi bi-geo-alt"
              title="Địa chỉ"
              description="A108 Adam Street, New York, NY 535022"
              aosDelay="300"
            />

            <InfoItem
              icon="bi bi-telephone"
              title="Gọi cho chúng tôi"
              description="+1 5589 55488 55"
              aosDelay="400"
            />

            <InfoItem
              icon="bi bi-envelope"
              title="Gửi email"
              description="info@example.com"
              aosDelay="500"
            />
          </div>

          <div className="col-lg-8">
            <form onSubmit={handleSubmit} className="php-email-form" data-aos="fade-up" data-aos-delay="200">
              <div className="row gy-4">
                <div className="col-md-6">
                  <FormInput
                    name="name"
                    placeholder="Tên của bạn"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <FormInput
                    type="email"
                    name="email"
                    placeholder="Email của bạn"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />
                </div>

                <div className="col-md-12">
                  <FormInput
                    name="subject"
                    placeholder="Tiêu đề"
                    value={formData.subject}
                    onChange={handleChange}
                    error={errors.subject}
                    required
                  />
                </div>

                <div className="col-md-12">
                  <FormTextarea
                    name="message"
                    placeholder="Thông điệp"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    error={errors.message}
                    required
                  />
                </div>

                <div className="col-md-12 text-center">
                  <Button type="submit" variant="primary">
                    Gửi thông điệp
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
