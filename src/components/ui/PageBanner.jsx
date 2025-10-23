/**
 * PageBanner Component - Banner đầu trang với breadcrumb
 * 
 * Props:
 * - title: tiêu đề chính
 * - breadcrumbs: mảng breadcrumb items [{ label, link }]
 * - backgroundImage: URL ảnh background (optional)
 * - className: class tùy chỉnh
 */

const PageBanner = ({
    title,
    breadcrumbs = [],
    backgroundImage,
    className = '',
}) => {
    return (
        <div className={`page-banner ${className}`}>
            <div
                className="container mb-5" style={{ maxWidth: '1500px' }}
            >
                <div className="">
                    <div className="page-banner-content">
                        {breadcrumbs.length > 0 && (
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    {breadcrumbs.map((item, index) => (
                                        <li
                                            key={index}
                                            className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                                            aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                                        >
                                            {index === breadcrumbs.length - 1 ? (
                                                item.label
                                            ) : (
                                                <a href={item.link || '#'}>{item.label}</a>
                                            )}
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        )}
                        <h1 className="page-banner-title text-center fw-semibold">{title}</h1>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageBanner;
