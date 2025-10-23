import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import appointmentService from '../services/appointmentService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PageBanner } from '../components/ui';
import departmentImg from '../assets/images/departments-1.jpg';

const ServiceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [service, setService] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadServiceDetail();
    }, [id]);

    const loadServiceDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await appointmentService.getServiceDetail(id);
            setService(response.data);
        } catch (error) {
            console.error('Error loading service detail:', error);
            setError('Không thể tải thông tin dịch vụ. Vui lòng thử lại sau.');
            toast.error('Không thể tải thông tin dịch vụ');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return 'Liên hệ';
        return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
    };

    const getServiceTypeLabel = (type) => {
        const typeMap = {
            'DICH_VU': 'Dịch vụ khám',
            'XET_NGHIEM': 'Xét nghiệm',
            'CHUYEN_KHOA': 'Chuyên khoa',
        };
        return typeMap[type] || type;
    };

    const handleBookAppointment = () => {
        navigate('/dat-lich', { state: { selectedService: service } });
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="container py-5" style={{ minHeight: '60vh' }}>
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                        <p className="mt-3 text-muted fs-5">Đang tải thông tin dịch vụ...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !service) {
        return (
            <>
                <Header />
                <div className="container py-5" style={{ minHeight: '60vh' }}>
                    <div className="alert alert-danger text-center" role="alert">
                        <i className="fas fa-exclamation-circle me-2 fs-3"></i>
                        <p className="mb-3">{error || 'Không tìm thấy thông tin dịch vụ'}</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/services')}
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            Quay lại danh sách dịch vụ
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <div className="index-page">
            <Header />
            <main className="main">
                <section className="service-detail-section section">
                    {/* Page Banner with Breadcrumb */}
                    <PageBanner
                        breadcrumbs={[
                            { label: 'Trang chủ', link: '/' },
                            { label: 'Dịch vụ y tế', link: '/services' },
                            { label: 'Chi tiết' }
                        ]}
                        title={service.name}
                    />

                    <div className="container" style={{ maxWidth: '1500px' }}>
                        <div className="row gy-4">
                            {/* Left Column - Image and Quick Info */}
                            <div className="col-lg-4">
                                <div className="card mb-4" style={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                                    <div style={{ overflow: 'hidden', height: '300px', border: 'none' }}>
                                        <img
                                            src={departmentImg}
                                            className="card-img-top"
                                            alt={service.name}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.3s ease',
                                                cursor: 'pointer'
                                            }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        />
                                    </div>
                                    <div className="card-body">


                                    </div>
                                </div>

                                {/* Quick Info Card */}
                                <div className="card" style={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)', borderRadius: '12px', overflow: 'hidden', border: 'none' }}>
                                    <div className="card-body">
                                        <h5 className="card-title mb-3"
                                            style={{ fontWeight: '600' }}>
                                            <i className="fas fa-info-circle text-primary me-2"></i>
                                            Thông tin dịch vụ
                                        </h5>
                                        <ul className="list-unstyled mb-0">
                                            <li className="mb-2">
                                                <i className="fas fa-tag text-muted me-2"></i>
                                                <strong>Mã dịch vụ:</strong> {service.code}
                                            </li>
                                            <li className="mb-2">
                                                <i className="fas fa-money-bill-wave text-muted me-2"></i>
                                                <strong>Giá:</strong> {formatCurrency(service.price)}
                                            </li>
                                            <li className="mb-2">
                                                <i className="fas fa-clipboard-list text-muted me-2"></i>
                                                <strong>Loại:</strong> {getServiceTypeLabel(service.type)}
                                            </li>
                                        </ul>
                                        <button
                                            className="btn btn-primary w-100 btn-lg"
                                            onClick={handleBookAppointment}
                                        >
                                            <i className="fas fa-calendar-check me-2"></i>
                                            Đặt lịch khám
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Detailed Information */}
                            <div className="col-lg-8">
                                {/* Service Description */}
                                <div className="card mb-4" style={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)', borderRadius: '12px', overflow: 'hidden', border: 'none' }}>
                                    <div className="card-body p-4">
                                        <h4 className="card-title mb-3"
                                            style={{ fontWeight: '600' }}>
                                            <i className="fas fa-file-medical text-primary me-2"></i>
                                            Mô tả dịch vụ
                                        </h4>
                                        <div className="service-description" style={{ lineHeight: '2', textAlign: 'justify' }}>
                                            {service.description ? (
                                                service.description.split(/\.\s+/).filter(sentence => sentence.trim()).map((sentence, index) => (
                                                    <p key={index} className="mb-2">- {sentence.trim()}{sentence.endsWith('.') ? '' : '.'}</p>
                                                ))
                                            ) : (
                                                <p className="text-muted mb-0">Chưa có mô tả chi tiết cho dịch vụ này.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Sub Plans Table - Only show if subPlans exists and has items */}
                                {service.subPlans && service.subPlans.length > 0 && (
                                    <div className="card" style={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)', borderRadius: '12px', overflow: 'hidden', border: 'none' }}>
                                        <div className="card-body">
                                            <h4 className="card-title mb-3" style={{ fontWeight: '600' }}>
                                                <i className="fas fa-list-ul text-primary me-2"></i>
                                                Danh sách các xét nghiệm
                                            </h4>
                                            <div className="table-responsive">
                                                <table className="table table-hover">
                                                    <thead className="table-light" style={{ '--bs-table-bg': 'white' }}>
                                                        <tr style={{ backgroundColor: 'var(--accent-color)' }}>
                                                            <th style={{ width: '80px', color: 'var(--accent-color)' }} className="text-center">STT</th>
                                                            <th style={{ color: 'var(--accent-color)' }}>Tên xét nghiệm</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {service.subPlans.map((subPlan, index) => (
                                                            <tr key={subPlan.id}>
                                                                <td className="text-center">{index + 1}</td>
                                                                <td>{subPlan.name}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Action Bar */}
                        {/* <div className="row mt-4">
                            <div className="col-12">
                                <div className="card shadow-sm bg-light">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                            <div>
                                                <h5 className="mb-1">{service.name}</h5>
                                                <p className="text-muted mb-0">
                                                    <i className="fas fa-tag me-2"></i>
                                                    Giá: <strong className="text-primary">{formatCurrency(service.price)}</strong>
                                                </p>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => navigate('/services')}
                                                >
                                                    <i className="fas fa-arrow-left me-2"></i>
                                                    Quay lại
                                                </button>
                                                <button 
                                                    className="btn btn-primary btn-lg"
                                                    onClick={handleBookAppointment}
                                                >
                                                    <i className="fas fa-calendar-check me-2"></i>
                                                    Đặt lịch ngay
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
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

export default ServiceDetailPage;
