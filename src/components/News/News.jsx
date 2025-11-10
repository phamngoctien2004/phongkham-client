import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './News.css';

const News = ({ isHomePage = false }) => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [newsArticles] = useState([
        {
            id: 1,
            title: 'Nam thanh niên đầu vai đi khám phát hiện đột quỵ',
            description: 'Đột quỵ không còn là bệnh lý chỉ gặp ở người lớn tuổi, thực tế cho thấy, ngày càng có nhiều trường hợp người trẻ gặp phải tình trạng nguy hiểm này, thậm chí...',
            image: '/news-1.1.jpg',
            date: 'Thứ Hai, 10 tháng 11, 2025',
            category: 'noi-khoa',
            categoryName: 'Nội khoa',
            isFeatured: true
        },
        {
            id: 2,
            title: 'Trẻ bị nóng đầu, chân tay nóng: Nguyên nhân và cách chăm sóc hiệu quả',
            description: 'Nhiều bậc phụ huynh lo lắng khi thấy trẻ bị nóng đầu, chân tay nóng, đi kèm các biểu hiện khó chịu như quấy khóc, mệt mỏi hay mất ngủ. Đây có thể là dấu hiệu phản ánh cơ thể trẻ đang gặp vấn đề về nhiệt độ, tuần hoàn hoặc một số rối loạn sức khỏe khác...',
            image: '/news-2.1.jpg',
            date: 'Thứ Bảy, 7 tháng 11, 2025',
            category: 'nhi-khoa',
            categoryName: 'Nhi khoa'
        },
        {
            id: 3,
            title: 'Trẻ bị ngã đập đầu phía trước có sao không? Hướng dẫn xử trí an toàn',
            description: 'Ngã là tai nạn thường gặp ở trẻ nhỏ, đặc biệt trong giai đoạn tập bò, tập đi hay vui chơi hiếu động. Tuy nhiên, trẻ bị ngã đập đầu phía trước luôn khiến cha mẹ hoang mang, lo sợ vì đầu là vị trí chứa não bộ - cơ quan trung ương điều khiển toàn bộ hoạt động của cơ thể...',
            image: '/news-3.1.jpg',
            date: 'Chủ Nhật, 9 tháng 11, 2025',
            category: 'nhi-khoa',
            categoryName: 'Nhi khoa'
        },
        {
            id: 4,
            title: 'Phổi bò có ăn được không? Giá trị dinh dưỡng và những lưu ý khi sử dụng',
            description: 'Phổi bò là một loại nội tạng động vật quen thuộc, thường xuất hiện trong nhiều món ăn dân dã của người Việt. Với kết cấu xốp, mềm và dễ thấm gia vị, phổi của bò có thể được chế biến thành nhiều món ngon như xào, hấp hay nướng...',
            image: '/news-4.1.png',
            date: 'Thứ Năm, 7 tháng 11, 2025',
            category: 'dinh-duong',
            categoryName: 'Dinh dưỡng'
        }
    ]);

    const categories = [
        { value: 'all', label: 'Tất cả chuyên khoa' },
        { value: 'noi-khoa', label: 'Nội khoa' },
        { value: 'ngoai-khoa', label: 'Ngoại khoa' },
        { value: 'nhi-khoa', label: 'Nhi khoa' },
        { value: 'san-phu-khoa', label: 'Sản phụ khoa' },
        { value: 'dinh-duong', label: 'Dinh dưỡng' }
    ];

    const filteredNews = selectedCategory === 'all'
        ? newsArticles
        : newsArticles.filter(article => article.category === selectedCategory);

    const featuredArticle = filteredNews.find(article => article.isFeatured) || filteredNews[0];
    const sideArticles = filteredNews.filter(article => article.id !== featuredArticle?.id);

    const limitedNews = isHomePage ? newsArticles.slice(0, 4) : filteredNews;

    // Nếu là trang home, hiển thị theo grid cũ
    if (isHomePage) {
        return (
            <section className="news section">
                <div className="container">
                    <div className="section-header">
                        <h2>TIN TỨC Y KHOA</h2>
                    </div>

                    <div className="news-grid">
                        {limitedNews.map((article) => (
                            <div key={article.id} className="news-card" onClick={() => navigate(`/news/${article.id}`)}>
                                <div className="news-image">
                                    <img src={article.image} alt={article.title} />
                                    <div className="news-category">{article.categoryName}</div>
                                </div>
                                <div className="news-content">
                                    <h3>{article.title}</h3>
                                    <p>{article.description}</p>
                                    <div className="news-link">
                                        Xem chi tiết <i className="bi bi-arrow-right"></i>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="news-footer">
                        <Link to="/news" className="btn-view-more">
                            Xem thêm
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    // Layout mới cho trang News
    return (
        <section className="news section">
            <div className="container">
                {/* Category Filter Buttons */}
                <div className="news-filter">
                    <div className="filter-buttons">
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat.value)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* News Layout: Featured + Side Articles */}
                <div className="news-layout">
                    {/* Featured Article */}
                    {featuredArticle && (
                        <div className="featured-article" onClick={() => navigate(`/news/${featuredArticle.id}`)}>
                            <div className="featured-image">
                                <img src={featuredArticle.image} alt={featuredArticle.title} />
                            </div>
                            <div className="featured-content">
                                <span className="featured-badge">TIN TỨC HOT NHẤT</span>
                                <h2>{featuredArticle.title}</h2>
                                <p>{featuredArticle.description}</p>
                                <div className="article-meta">
                                    <i className="bi bi-clock"></i>
                                    <span>{featuredArticle.date}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Side Articles List */}
                    <div className="side-articles">
                        {sideArticles.map((article) => (
                            <div key={article.id} className="side-article" onClick={() => navigate(`/news/${article.id}`)}>
                                <div className="side-article-image">
                                    <img src={article.image} alt={article.title} />
                                </div>
                                <div className="side-article-content">
                                    <div className="article-meta">
                                        <i className="bi bi-clock"></i>
                                        <span>{article.date}</span>
                                    </div>
                                    <h3>{article.title}</h3>
                                    <p>{article.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default News;
