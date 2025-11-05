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
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
            rating: 5,
            quote: 'Chất lượng tuyệt vời',
            content: 'Mình ấn tượng vì chưa từng khám bệnh ở đâu có sự chuyên nghiệp như MEDLATEC. Trường hợp của mình còn được hội chẩn từ xa với các Bác sĩ chuyên gia tại Hà Nội để đưa ra phác đồ tốt nhất. Cảm ơn MEDLATEC'
        },
        {
            id: 2,
            name: 'Cô Hoàng T. Nga',
            position: 'Nội trợ, hưu trí',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
            rating: 5,
            quote: 'Chất lượng tuyệt vời',
            content: 'Chất lượng khám tại Bệnh viện rất tốt, tôi theo dõi bệnh lý mạn tính và khám sức khỏe tổng quát định kỳ thường xuyên. Mọi quy trình đều nhanh gọn, hơn nữa còn rất tiết kiệm chi phí. Tôi đã sử dụng dịch vụ của MEDLATEC hơn 10 năm.'
        },
        {
            id: 3,
            name: 'Long Nguyễn',
            position: 'Nhân viên lập trình',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
            rating: 5,
            quote: 'Chất lượng tuyệt vời',
            content: 'Dịch vụ tận nơi thật sự đã giúp tôi và gia đình tiết kiệm thời gian chăm sóc sức khỏe cũng như chi phí, chi mất 10.000 đồng chi phí đi lại. Tiện ích đặt lịch nhanh chóng qua app và website, theo dõi sức khỏe online và báo mật tốt.'
        }
    ];

    return (
        <section id="testimonials" className="testimonials section">
            <div className="container">
                <div className="section-header">
                    <h2>Khách hàng nói gì về <span style={{ color: '#1d93e3' }}>MEDLATEC</span></h2>
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
                                        <span>MEDLATEC</span>
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
