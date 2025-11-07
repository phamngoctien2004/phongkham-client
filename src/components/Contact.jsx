import { useState } from 'react';
import { toast } from 'sonner';
import { SectionTitle, Button, FormInput, FormTextarea, InfoItem, PageBanner } from './ui';
import contactService from '../services/contactService';

const Contact = ({ isHomePage = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      // Gửi email liên hệ qua API
      const response = await contactService.sendContactEmail(formData);

      // Hiển thị thông báo thành công
      toast.success(response.message || 'Gửi thông điệp thành công! Chúng tôi sẽ liên hệ với bạn sớm.');

      // Reset form sau khi gửi thành công
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error sending contact email:', error);
      toast.error(error.message || 'Không thể gửi thông điệp. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className={`contact section ${!isHomePage ? 'has-page-banner' : ''}`}>
      {!isHomePage && (
        <PageBanner
          title="LIÊN HỆ VỚI CHÚNG TÔI"
          breadcrumbs={[
            { label: 'Trang chủ', link: '/' },
            { label: 'Liên hệ' }
          ]}
        />
      )}

      <div className="contact-wrapper">
        {/* Left side - Form with background image */}
        <div className="contact-form-section">
          <div className="contact-overlay">
            <div className="contact-form-container">
              <h2 className="contact-title">Liên hệ với chúng tôi</h2>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <FormInput
                    name="name"
                    placeholder="Họ & tên"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                  />
                  <FormInput
                    name="subject"
                    placeholder="SĐT"
                    value={formData.subject}
                    onChange={handleChange}
                    error={errors.subject}
                    required
                  />
                </div>

                <FormInput
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />

                <FormTextarea
                  name="message"
                  placeholder="Nội dung"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  error={errors.message}
                  required
                />

                <Button type="submit" variant="primary" disabled={loading} className="btn-submit-contact">
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi yêu cầu'
                  )}
                </Button>
              </form>

              <p className="contact-footer-text">
                Bằng việc nhấn nút Gửi yêu cầu ngay bạn đã đồng ý với{' '}
                <a href="/quy-che-hoat-dong" className="contact-link">Quy chế hoạt động</a> và{' '}
                <a href="/chinh-sach-bao-ve-thong-tin" className="contact-link">Chính sách bảo vệ thông tin</a> của Phòng khám đa khoa Thái Hà
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Google Maps */}
        <div className="contact-map-section">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6266890505273!2d105.83490831533383!3d21.00747938600291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab8dfedb141f%3A0xd8b6d33ccf5522bd!2zxJAuIEzDqm5nLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1635000000000!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Phòng khám đa khoa Thái Hà Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;
