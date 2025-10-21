import Header from '../components/Header';
import Footer from '../components/Footer';

const NewsPage = () => {
    return (
        <div className="index-page">
            <Header />
            <main className="main">
                <section id="news" className="news section">
                    <div className="container">
                        <div className="section-title">
                            <h2>Tin tức</h2>
                            <p>Cập nhật tin tức y tế mới nhất</p>
                        </div>

                        <div className="row gy-4">
                            <div className="col-lg-4 col-md-6">
                                <div className="card">
                                    <img src="https://via.placeholder.com/400x300" className="card-img-top" alt="News" />
                                    <div className="card-body">
                                        <h5 className="card-title">Tin tức sức khỏe</h5>
                                        <p className="card-text">Thông tin y tế hữu ích cho bạn và gia đình.</p>
                                        <small className="text-muted">01/01/2025</small>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="card">
                                    <img src="https://via.placeholder.com/400x300" className="card-img-top" alt="News" />
                                    <div className="card-body">
                                        <h5 className="card-title">Chăm sóc sức khỏe</h5>
                                        <p className="card-text">Hướng dẫn chăm sóc sức khỏe hiệu quả.</p>
                                        <small className="text-muted">02/01/2025</small>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="card">
                                    <img src="https://via.placeholder.com/400x300" className="card-img-top" alt="News" />
                                    <div className="card-body">
                                        <h5 className="card-title">Khám phá y học</h5>
                                        <p className="card-text">Những tiến bộ mới trong y học hiện đại.</p>
                                        <small className="text-muted">03/01/2025</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            <a
                href="#"
                className="scroll-top d-flex align-items-center justify-content-center active"
                onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            >
                <i className="bi bi-arrow-up-short"></i>
            </a>
        </div>
    );
};

export default NewsPage;
