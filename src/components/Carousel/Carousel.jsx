import { useState, useEffect } from 'react';
import './Carousel.css';

const Carousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    const slides = [
        {
            id: 1,
            title: 'Chăm sóc sức khỏe toàn diện',
            subtitle: 'Đội ngũ bác sĩ chuyên môn cao, tận tâm',
            description: 'Hệ thống phòng khám hiện đại với đầy đủ chuyên khoa',
            image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920&h=600&fit=crop',
        },
        {
            id: 2,
            title: 'Đặt lịch nhanh chóng, tiện lợi',
            subtitle: 'Hệ thống đặt lịch trực tuyến 24/7',
            description: 'Không cần chờ đợi, đặt lịch chỉ trong vài phút',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=600&fit=crop',
        },
        {
            id: 3,
            title: 'Trang thiết bị y tế hiện đại',
            subtitle: 'Công nghệ chẩn đoán tiên tiến',
            description: 'Đảm bảo kết quả chính xác và điều trị hiệu quả',
            image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1920&h=600&fit=crop',
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
                            <div className="carousel-overlay"></div>
                            <div className="carousel-content">
                                <h1 className="carousel-title" data-aos="fade-up">
                                    {slide.title}
                                </h1>
                                <h3 className="carousel-subtitle" data-aos="fade-up" data-aos-delay="100">
                                    {slide.subtitle}
                                </h3>
                                <p className="carousel-description" data-aos="fade-up" data-aos-delay="200">
                                    {slide.description}
                                </p>
                            </div>
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
