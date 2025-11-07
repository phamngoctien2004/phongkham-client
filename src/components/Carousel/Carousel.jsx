import { useState, useEffect } from 'react';
import './Carousel.css';

const Carousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    const slides = [
        {
            id: 1,
            title: 'Phòng khám đa khoa Thái Hà',
            subtitle: 'Chăm sóc sức khỏe toàn diện cho gia đình',
            description: 'Đội ngũ bác sĩ chuyên môn cao, tận tâm với trang thiết bị hiện đại',
            image: '/banner_new_1.webp',
        },
        {
            id: 2,
            title: 'Đặt lịch khám nhanh chóng',
            subtitle: 'Hệ thống đặt lịch trực tuyến 24/7',
            description: 'Không cần chờ đợi, đặt lịch khám chỉ trong vài phút',
            image: '/banner_new_2.jpg',
        },
        {
            id: 3,
            title: 'Trang thiết bị y tế hiện đại',
            subtitle: 'Công nghệ chẩn đoán tiên tiến',
            description: 'Đảm bảo kết quả chính xác và điều trị hiệu quả',
            image: '/banner_new_3.jpg',
        },
    ];

    useEffect(() => {
        if (!isAutoPlay) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length, isAutoPlay]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlay(false);
        setTimeout(() => setIsAutoPlay(true), 10000);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAutoPlay(false);
        setTimeout(() => setIsAutoPlay(true), 10000);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlay(false);
        setTimeout(() => setIsAutoPlay(true), 10000);
    };

    return (
        <section className="carousel-section">
            <div className="carousel-container">
                <div className="carousel-slides">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button className="carousel-control prev" onClick={prevSlide} aria-label="Previous slide">
                    <i className="bi bi-chevron-left"></i>
                </button>
                <button className="carousel-control next" onClick={nextSlide} aria-label="Next slide">
                    <i className="bi bi-chevron-right"></i>
                </button>

                {/* Indicators */}
                <div className="carousel-indicators">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        ></button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Carousel;
