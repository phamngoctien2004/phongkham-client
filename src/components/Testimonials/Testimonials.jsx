import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            name: 'Chị Tố Diệp',
            position: 'Nhân viên văn phòng',
            image: '/testimonials.png',
            rating: 5,
            quote: 'Chất lượng tuyệt vời',
            content: 'Mình ấn tượng vì chưa từng khám bệnh ở đâu có sự chuyên nghiệp như phòng khám đa khoa Thái Hà. Đội ngũ bác sĩ tận tâm, trang thiết bị hiện đại. Cảm ơn phòng khám!'
        },
        {
            id: 2,
            name: 'Cô Hoàng T. Nga',
            position: 'Nội trợ, hưu trí',
            image: '/testimonials.png',
            rating: 5,
            quote: 'Chất lượng tuyệt vời',
            content: 'Chất lượng khám tại phòng khám rất tốt, tôi theo dõi bệnh lý mạn tính và khám sức khỏe tổng quát định kỳ thường xuyên. Mọi quy trình đều nhanh gọn, hơn nữa còn rất tiết kiệm chi phí.'
        },
        {
            id: 3,
            name: 'Long Nguyễn',
            position: 'Nhân viên lập trình',
            image: '/testimonials.png',
            rating: 5,
            quote: 'Chất lượng tuyệt vời',
            content: 'Dịch vụ đặt lịch online thật sự tiện lợi, giúp tôi và gia đình tiết kiệm thời gian. Tiện ích đặt lịch nhanh chóng qua website, theo dõi lịch hẹn online rất thuận tiện.'
        }
    ];

    return (
        <section id="testimonials" className="testimonials section">
            <div className="container">
                <div className="section-header">
                    <h2>Khách hàng nói gì về <span style={{ color: '#1d93e3' }}>Phòng khám đa khoa Thái Hà</span></h2>
                </div>

                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        768: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    className="testimonials-slider"
                >
                    {testimonials.map((testimonial) => (
                        <SwiperSlide key={testimonial.id}>
                            <div className="testimonial-item">
                                <div className="testimonial-header">
                                    <div className="logo-badge">
                                        <span>PHÒNG KHÁM THÁI HÀ</span>
                                    </div>
                                    <div className="pause-icon">
                                        <i className="fas fa-pause"></i>
                                    </div>
                                </div>

                                <div className="testimonial-divider"></div>

                                <div className="testimonial-profile">
                                    <img
                                        src={testimonial.image}
                                        className="testimonial-img"
                                        alt={testimonial.name}
                                    />
                                    <div className="testimonial-info">
                                        <h3>{testimonial.name}</h3>
                                        <h4>{testimonial.position}</h4>
                                    </div>
                                    <div className="quote-badge">
                                        <span>{testimonial.quote}</span>
                                    </div>
                                </div>

                                <div className="stars">
                                    {[...Array(testimonial.rating)].map((_, index) => (
                                        <i key={index} className="fas fa-star"></i>
                                    ))}
                                </div>

                                <p>{testimonial.content}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Testimonials;
