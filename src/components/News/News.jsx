import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './News.css';

const News = ({ isHomePage = false }) => {
    const [newsArticles, setNewsArticles] = useState([
        {
            id: 1,
            title: 'Nhiều khách hàng bất ngờ về giá trị thật của thẻ khám bệnh tại phòng khám',
            description: 'Với mức phí ưu đãi, thẻ khám bệnh đang mang đến những quyền lợi vượt xa kỳ vọng, giúp khách hàng tiết kiệm chi phí khám chữa bệnh...',
            image: '/news_1.png',
            link: '#',
            category: 'Thẻ khám bệnh'
        },
        {
            id: 2,
            title: 'Chăm sóc sức khỏe toàn diện với đội ngũ bác sĩ chuyên môn cao',
            description: 'Phòng khám đa khoa Thái Hà tự hào với đội ngũ bác sĩ giàu kinh nghiệm, tận tâm chăm sóc sức khỏe cho bệnh nhân...',
            image: '/news_2.jpg',
            link: '#',
            category: 'Đội ngũ y tế'
        },
        {
            id: 3,
            title: 'Trang thiết bị y tế hiện đại, đảm bảo chẩn đoán chính xác',
            description: 'Được trang bị các máy móc y tế tiên tiến, phòng khám cam kết mang đến kết quả chẩn đoán chính xác và điều trị hiệu quả...',
            image: '/news_3.png',
            link: '#',
            category: 'Công nghệ y tế'
        },
        {
            id: 4,
            title: 'Dịch vụ khám chữa bệnh chất lượng cao với mức giá hợp lý',
            description: 'Phòng khám đa khoa Thái Hà cung cấp các dịch vụ y tế chất lượng cao với mức chi phí hợp lý, phù hợp với mọi gia đình...',
            image: '/new_4.png',
            link: '#',
            category: 'Dịch vụ'
        }
    ]);

    const limitedNews = isHomePage ? newsArticles.slice(0, 4) : newsArticles;

    return (
        <section className="news section">
            <div className="container">
                <div className="section-header">
                    <h2>TIN TỨC Y KHOA</h2>
                </div>

                <div className="news-grid">
                    {limitedNews.map((article) => (
                        <div key={article.id} className="news-card">
                            <div className="news-image">
                                <img src={article.image} alt={article.title} />
                                <div className="news-category">{article.category}</div>
                            </div>
                            <div className="news-content">
                                <h3>{article.title}</h3>
                                <p>{article.description}</p>
                                <a href={article.link} target="_blank" rel="noopener noreferrer" className="news-link">
                                    Xem chi tiết <i className="bi bi-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {isHomePage && (
                    <div className="news-footer">
                        <Link to="/news" className="btn-view-more">
                            Xem thêm
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default News;
