import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './News.css';

const News = ({ isHomePage = false }) => {
    const [newsArticles, setNewsArticles] = useState([
        {
            id: 1,
            title: 'Nhiều khách hàng bất ngờ về giá trị thật của thẻ khám bệnh 555 của MEDLATEC',
            description: 'Với mức phí chỉ 555.000 đồng/năm, Thẻ 555 của Hệ thống Y tế MEDLATEC đang mang đến những quyền lợi vượt xa kỳ vọng, giúp...',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
            link: 'https://medlatec.vn/tin-tuc/nhieu-khach-hang-bat-ngo-ve-gia-tri-that-cua-the-kham-benh-555-cua-medlatec',
            category: 'Thẻ khám bệnh'
        },
        {
            id: 2,
            title: 'Người phụ nữ thực hiện phẫu thuật điều trị tai do đau, hiệu nghe kém kéo dài',
            description: 'Người phụ nữ đến Bệnh viện Đa khoa MEDLATEC kiểm tra sức khỏe do u tai, nghẹt kém thì phát hiện xơ vữa tai và phải phẫu...',
            image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop',
            link: 'https://medlatec.vn/tin-tuc/nguoi-phu-nu-thuc-hien-phau-thuat-dieu-tri-tai-do-dau-hieu-nghe-kem-keo-dai',
            category: 'Phẫu thuật'
        },
        {
            id: 3,
            title: 'Tưởng đau bụng thông thường, đến MEDLATEC khám phát hiện hoại tử ruột non',
            description: 'Tưởng đau bụng thông thường do ăn uống, người đàn ông đến Bệnh viện Đa khoa MEDLATEC thăm khám. Tại đây, các bác sĩ...',
            image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
            link: 'https://medlatec.vn/tin-tuc/tuong-dau-bung-thong-thuong-den-medlatec-kham-phat-hien-hoai-tu-ruot-non',
            category: 'Chẩn đoán'
        },
        {
            id: 4,
            title: 'Thời điểm giao mùa, cha mẹ cần cảnh giác trẻ mắc cúm A',
            description: 'Sự thay đổi đột ngột của thời tiết trong giai đoạn giao mùa thu - đông khiến nhiệt độ, độ ẩm không khí thay đổi thất thường, tạo...',
            image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=300&fit=crop',
            link: 'https://medlatec.vn/tin-tuc/thoi-diem-giao-mua-cha-me-can-canh-giac-tre-mac-cum-a',
            category: 'Sức khỏe trẻ em'
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
