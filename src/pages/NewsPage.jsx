import Header from '../components/Header';
import News from '../components/News';
import Footer from '../components/Footer';
import { PageBanner } from '../components/ui';

const NewsPage = () => {
    return (
        <div className="news-page">
            <Header />
            <main className="main">
                <PageBanner
                    breadcrumbs={[
                        { label: 'Trang chủ', link: '/' },
                        { label: 'Tin tức y khoa', link: '/news' }
                    ]}
                    title="TIN TỨC Y KHOA"
                />
                <News isHomePage={false} />
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
