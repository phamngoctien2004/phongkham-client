import { useState } from 'react';
import { Link } from 'react-router-dom';
import './CustomerServices.css';

const CustomerServices = () => {
    const [activeService, setActiveService] = useState(0);

    const services = [
        {
            id: 0,
            icon: 'bi bi-calendar-plus',
            title: 'Đặt lịch khám, lấy mẫu tại nhà',
            description:
                'Quy khách hàng sử dụng tiện ích này để đặt lịch lấy mẫu tại nhà hoặc đặt lịch khám chữa bệnh tại các cơ sở của MEDLATEC',
            buttonText: 'Đặt lịch',
            buttonLink: '/dat-lich',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
            color: '#3b82f6',
            borderColor: '#1d93e3',
        },
        {
            id: 1,
            icon: 'bi bi-search',
            title: 'Tra cứu kết quả',
            description:
                'Quy khách hàng sử dụng tiện ích này để tra cứu kết quả sau khi sử dụng dịch vụ y tế tại Hệ thống Y tế MEDLATEC',
            buttonText: 'Tra cứu',
            buttonLink: '/profile',
            image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
            color: '#4ade80',
            borderColor: '#57a892',
        },
        {
            id: 2,
            icon: 'bi bi-currency-dollar',
            title: 'Bảng giá dịch vụ',
            description:
                'Quy khách hàng sử dụng tiện ích này để tra cứu giá dịch vụ y tế tại Hệ thống Y tế MEDLATEC',
            buttonText: 'Xem bảng giá',
            buttonLink: '/services',
            image: 'https://images.unsplash.com/photo-1554224311-beee460c201a?w=800&h=600&fit=crop',
            color: '#f97316',
            borderColor: '#ef9169',
        },
        {
            id: 3,
            icon: 'bi bi-question-circle',
            title: 'Hỏi đáp tư vấn',
            description:
                'Quy khách hàng sử dụng tiện ích này để đặt câu hỏi và nhận hướng dẫn, giải đáp thắc mắc từ trợ lý ảo',
            buttonText: 'Đặt câu hỏi',
            buttonLink: '/ai-chat',
            image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop',
            color: '#f59e0b',
            borderColor: '#f2b868',
        },
    ];

    return (
        <section className="customer-services section">
            <div className="container">
                <div className="section-header">
                    <h2>TIỆN ÍCH CHO KHÁCH HÀNG</h2>
                </div>

                <div className="services-wrapper">
                    <div className="services-grid">
                        {services.map((service, index) => (
                            <div
                                key={service.id}
                                className={`service-card ${activeService === index ? 'active' : ''}`}
                                onMouseEnter={() => setActiveService(index)}
                            >
                                <div className="service-icon" style={{ color: service.color }}>
                                    <i className={service.icon}></i>
                                </div>
                                <div className="service-content">
                                    <h3>{service.title}</h3>
                                    <p>{service.description}</p>
                                    <Link
                                        to={service.buttonLink}
                                        className="service-btn"
                                        style={{ color: service.color }}
                                    >
                                        {service.buttonText} <i className="bi bi-arrow-right"></i>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="services-preview">
                        <div
                            className="preview-header"
                            style={{ borderLeftColor: services[activeService].borderColor }}
                        >
                            <h3 style={{ color: services[activeService].borderColor }}>
                                {services[activeService].title}
                            </h3>
                        </div>
                        <div
                            className="preview-image-container"
                        >
                            {services.map((service, index) => (
                                <div
                                    key={service.id}
                                    className={`preview-image ${activeService === index ? 'active' : ''}`}
                                    style={{
                                        backgroundImage: `url(${service.image})`,
                                        zIndex: activeService === index ? 2 : 1
                                    }}
                                >
                                    <div className="preview-overlay"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomerServices;
