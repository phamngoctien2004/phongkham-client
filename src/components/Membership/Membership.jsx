import { useState } from 'react';
import { toast } from 'sonner';
import './Membership.css';

const Membership = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const benefits = [
        {
            id: 1,
            text: 'Theo dõi lịch sử khám chữa bệnh'
        },
        {
            id: 2,
            text: 'Được đăng ký khám và tái khám với chuyên gia'
        },
        {
            id: 3,
            text: 'Tra cứu kết quả nhanh chóng và chi tiết'
        },
        {
            id: 4,
            text: 'Nhận thông báo quan trọng và video mới'
        },
        {
            id: 5,
            text: 'Được đăng ký các gói khám độc quyền'
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Vui lòng nhập email của bạn');
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Email không hợp lệ');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            toast.success('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
            setEmail('');
            setIsSubmitting(false);
        }, 1000);
    };

    const handleContactClick = () => {
        // Navigate to contact page or open contact form
        window.location.href = '/lien-he';
    };

    return (
        <section className="membership-section">
            <div className="container">
                <div className="section-header">
                    <h2>ƯU ĐÃI THÀNH VIÊN CỦA <span style={{ color: '#1977cc' }}>PHÒNG KHÁM ĐA KHOA THÁI HÀ</span></h2>
                </div>

                <div className="membership-content">
                    {/* Left side - Images */}
                    <div className="membership-images">
                        <div className="image-main">
                            <img
                                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=700&fit=crop"
                                alt="Bác sĩ khám bệnh"
                            />
                        </div>
                        <div className="image-secondary">
                            <img
                                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=500&fit=crop"
                                alt="Chăm sóc sức khỏe"
                            />
                        </div>
                    </div>

                    {/* Right side - Benefits and Form */}
                    <div className="membership-benefits">
                        <div className="benefits-list">
                            {benefits.map((benefit) => (
                                <div key={benefit.id} className="benefit-item">
                                    <div className="benefit-icon">
                                        <i className="fas fa-check"></i>
                                    </div>
                                    <p className="benefit-text">{benefit.text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="membership-form">
                            <p className="form-title">Đăng ký email để nhận tin tức sức khỏe</p>

                            <form onSubmit={handleSubmit}>
                                <input
                                    type="email"
                                    className="email-input"
                                    placeholder="Nhập email của bạn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isSubmitting}
                                />

                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="btn-register"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Đang xử lý...' : 'Đăng ký thành viên'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-contact"
                                        onClick={handleContactClick}
                                    >
                                        Liên hệ chúng tôi
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Membership;
