import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import appointmentService from '../services/appointmentService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/profile.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('account'); // account, history, password, services
    const [appointments, setAppointments] = useState([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(false);

    // Filters and Pagination
    const [filters, setFilters] = useState({
        date: '',
        status: '',
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalElements: 0,
        pageSize: 10,
    });

    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {
        if (activeTab === 'history') {
            loadAppointments();
        }
    }, [activeTab, filters, pagination.currentPage]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await appointmentService.getMyProfile();
            setProfile(response.data);
        } catch (error) {
            toast.error('Không thể tải thông tin tài khoản');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadAppointments = async () => {
        try {
            setAppointmentsLoading(true);
            const params = {
                limit: pagination.pageSize,
                page: pagination.currentPage,
            };

            if (filters.date) {
                params.date = filters.date;
            }
            if (filters.status) {
                params.status = filters.status;
            }

            const response = await appointmentService.getMyAppointments(params);
            setAppointments(response.data.content || []);
            setPagination(prev => ({
                ...prev,
                totalPages: response.data.totalPages || 1,
                totalElements: response.data.totalElements || 0,
            }));
        } catch (error) {
            toast.error('Không thể tải lịch sử đặt lịch');
            console.error(error);
        } finally {
            setAppointmentsLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to page 1 when filter changes
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        toast.success('Đăng xuất thành công');
        navigate('/login');
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="profile-loading">
                    <i className="bi bi-hourglass-split"></i>
                    <p>Đang tải thông tin...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (!profile) {
        return (
            <>
                <Header />
                <div className="profile-error">
                    <i className="bi bi-exclamation-triangle"></i>
                    <h3>Không tìm thấy thông tin tài khoản</h3>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Về trang chủ
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="profile-page">
                <div className="container" style={{ maxWidth: '1500px' }}>
                    <div className="row">
                        {/* Sidebar */}
                        <div className="col-lg-3">
                            <div className="profile-sidebar">
                                {/* User Info */}
                                <div className="profile-user-info">
                                    <div className="profile-avatar">
                                        {profile.profileImage ? (
                                            <img src={profile.profileImage} alt={profile.fullName} />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                <i className="bi bi-person-circle"></i>
                                            </div>
                                        )}
                                        <button className="avatar-edit-btn">
                                            <i className="bi bi-camera"></i>
                                        </button>
                                    </div>
                                    <div className="profile-user-email">
                                        <i className="bi bi-envelope"></i>
                                        <span>{profile.email || profile.phone}</span>
                                    </div>
                                    <button className="btn btn-light btn-sid">Nhập SID</button>
                                </div>

                                {/* Menu */}
                                <nav className="profile-menu">
                                    <button
                                        className={`menu-item ${activeTab === 'account' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('account')}
                                    >
                                        <i className="bi bi-person"></i>
                                        <span>Tổng quan tài khoản</span>
                                    </button>
                                    <button
                                        className={`menu-item ${activeTab === 'history' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('history')}
                                    >
                                        <i className="bi bi-clock-history"></i>
                                        <span>Lịch sử đặt lịch</span>
                                    </button>
                                    <button
                                        className={`menu-item ${activeTab === 'password' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('password')}
                                    >
                                        <i className="bi bi-shield-lock"></i>
                                        <span>Quản lý tài khoản</span>
                                    </button>
                                    <button
                                        className={`menu-item ${activeTab === 'services' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('services')}
                                    >
                                        <i className="bi bi-lightbulb"></i>
                                        <span>Góp ý dịch vụ</span>
                                    </button>
                                    <button className="menu-item logout" onClick={handleLogout}>
                                        <i className="bi bi-box-arrow-right"></i>
                                        <span>Đăng Xuất</span>
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-lg-9">
                            <div className="profile-content">
                                {activeTab === 'account' && (
                                    <div className="content-section">
                                        <h2 className="section-title">Quản lý tài khoản</h2>

                                        {/* Đăng nhập */}
                                        <div className="info-card">
                                            <div className="card-header">
                                                <i className="bi bi-box-arrow-in-right"></i>
                                                <h3>Đăng nhập</h3>
                                            </div>
                                            <div className="card-body">
                                                <div className="info-row">
                                                    <label>Email đăng nhập</label>
                                                    <span className="info-value">{profile.email || '--'}</span>
                                                </div>
                                                <div className="info-row">
                                                    <label>Mật khẩu đăng nhập</label>
                                                    <div className="password-field">
                                                        <span>*********</span>
                                                        <a href="#" className="link-primary">Đổi mật khẩu</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Thông tin cá nhân */}
                                        <div className="info-card">
                                            <div className="card-header">
                                                <i className="bi bi-person-circle"></i>
                                                <h3>Thông tin cá nhân</h3>
                                            </div>
                                            <div className="card-body">
                                                <div className="info-grid">
                                                    <div className="info-item">
                                                        <label>Mã bệnh nhân</label>
                                                        <span>{profile.code}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Họ và tên</label>
                                                        <span>{profile.fullName}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Ngày sinh</label>
                                                        <span>{profile.birth ? new Date(profile.birth).toLocaleDateString('vi-VN') : '--'}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Giới tính</label>
                                                        <span>{profile.gender === 'NAM' ? 'Nam' : profile.gender === 'NU' ? 'Nữ' : '--'}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Số điện thoại</label>
                                                        <span>{profile.phone || '--'}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Email</label>
                                                        <span>{profile.email || '--'}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>CMND / CCCD</label>
                                                        <span>{profile.cccd || '--'}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Nhóm máu</label>
                                                        <span>{profile.bloodType || '--'}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Cân nặng</label>
                                                        <span>{profile.weight ? `${profile.weight} kg` : '--'}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Chiều cao</label>
                                                        <span>{profile.height ? `${profile.height} cm` : '--'}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Ngày đăng ký</label>
                                                        <span>{profile.registrationDate ? new Date(profile.registrationDate).toLocaleDateString('vi-VN') : '--'}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Trạng thái xác thực</label>
                                                        <span className={profile.verified ? 'badge-success' : 'badge-warning'}>
                                                            {profile.verified ? 'Đã xác thực' : 'Chưa xác thực'}
                                                        </span>
                                                    </div>
                                                    <div className="info-item full-width">
                                                        <label>Địa chỉ</label>
                                                        <span>{profile.address || '--'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'history' && (
                                    <div className="content-section">
                                        <h2 className="section-title">Lịch sử đặt lịch</h2>

                                        {/* Filters */}
                                        <div className="filters-section">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="filter-group">
                                                        <label>Lọc theo ngày</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={filters.date}
                                                            onChange={(e) => handleFilterChange('date', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="filter-group">
                                                        <label>Lọc theo trạng thái</label>
                                                        <select
                                                            className="form-control"
                                                            value={filters.status}
                                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                                        >
                                                            <option value="">Tất cả</option>
                                                            <option value="CHO_THANH_TOAN">Chờ thanh toán</option>
                                                            <option value="DA_XAC_NHAN">Đã xác nhận</option>
                                                            <option value="HOAN_THANH">Hoàn thành</option>
                                                            <option value="HUY">Đã hủy</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="filter-group">
                                                        <label>&nbsp;</label>
                                                        <button
                                                            className="btn btn-secondary w-100"
                                                            onClick={() => {
                                                                setFilters({ date: '', status: '' });
                                                                setPagination(prev => ({ ...prev, currentPage: 1 }));
                                                            }}
                                                        >
                                                            <i className="bi bi-arrow-clockwise"></i>
                                                            Đặt lại bộ lọc
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {appointmentsLoading ? (
                                            <div className="appointments-loading">
                                                <i className="bi bi-hourglass-split"></i>
                                                <p>Đang tải lịch sử...</p>
                                            </div>
                                        ) : appointments.length === 0 ? (
                                            <div className="appointments-empty">
                                                <i className="bi bi-calendar-x"></i>
                                                <p>Chưa có lịch hẹn nào</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="appointments-table-container">
                                                    <table className="appointments-table">
                                                        <thead>
                                                            <tr>
                                                                <th>Mã LH</th>
                                                                <th>Ngày khám</th>
                                                                <th>Giờ</th>
                                                                <th>Bác sĩ / Dịch vụ</th>
                                                                <th>Triệu chứng</th>
                                                                <th>Mã hóa đơn</th>
                                                                <th>Trạng thái</th>
                                                                <th>Thao tác</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {appointments.map((appointment) => (
                                                                <tr key={appointment.id}>
                                                                    <td className="td-id">#{appointment.id}</td>
                                                                    <td className="td-date">{new Date(appointment.date).toLocaleDateString('vi-VN')}</td>
                                                                    <td className="td-time">{appointment.time.substring(0, 5)}</td>
                                                                    <td className="td-doctor">
                                                                        {appointment.doctorResponse ?
                                                                            appointment.doctorResponse.position :
                                                                            appointment.healthPlanResponse ?
                                                                                appointment.healthPlanResponse.name :
                                                                                '--'}
                                                                    </td>
                                                                    <td className="td-symptoms">
                                                                        <span className="symptoms-text" title={appointment.symptoms}>
                                                                            {appointment.symptoms || '--'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="td-invoice">{appointment.invoiceCode || '--'}</td>
                                                                    <td className="td-status">
                                                                        <span className={`status-badge status-${appointment.status}`}>
                                                                            {appointment.status === 'CHO_THANH_TOAN' ? 'Chờ thanh toán' :
                                                                                appointment.status === 'DA_THANH_TOAN' ? 'Đã thanh toán' :
                                                                                    appointment.status === 'DA_XAC_NHAN' ? 'Đã xác nhận' :
                                                                                        appointment.status === 'DANG_KHAM' ? 'Đang khám' :
                                                                                            appointment.status === 'HOAN_THANH' ? 'Hoàn thành' :
                                                                                                appointment.status === 'HUY' ? 'Đã hủy' :
                                                                                                    appointment.status}
                                                                        </span>
                                                                    </td>
                                                                    <td className="td-actions">
                                                                        <button
                                                                            className="btn-view-detail"
                                                                            onClick={() => navigate(`/dat-lich/thanh-toan/${appointment.id}`)}
                                                                            title="Xem chi tiết"
                                                                        >
                                                                            <i className="bi bi-eye"></i> Chi tiết
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Pagination */}
                                                {pagination.totalPages > 1 && (
                                                    <div className="pagination-section">
                                                        <div className="pagination-info">
                                                            Trang {pagination.currentPage} / {pagination.totalPages}
                                                            <span className="mx-2">•</span>
                                                            Tổng {pagination.totalElements} lịch hẹn
                                                        </div>
                                                        <div className="pagination-controls">
                                                            <button
                                                                className="btn btn-pagination"
                                                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                                                disabled={pagination.currentPage === 1}
                                                            >
                                                                <i className="bi bi-chevron-left"></i>
                                                                Trước
                                                            </button>

                                                            <div className="pagination-numbers">
                                                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                                                    let pageNum;
                                                                    if (pagination.totalPages <= 5) {
                                                                        pageNum = i + 1;
                                                                    } else if (pagination.currentPage <= 3) {
                                                                        pageNum = i + 1;
                                                                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                                                                        pageNum = pagination.totalPages - 4 + i;
                                                                    } else {
                                                                        pageNum = pagination.currentPage - 2 + i;
                                                                    }

                                                                    return (
                                                                        <button
                                                                            key={pageNum}
                                                                            className={`btn btn-page-number ${pageNum === pagination.currentPage ? 'active' : ''}`}
                                                                            onClick={() => handlePageChange(pageNum)}
                                                                        >
                                                                            {pageNum}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>

                                                            <button
                                                                className="btn btn-pagination"
                                                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                                                disabled={pagination.currentPage === pagination.totalPages}
                                                            >
                                                                Sau
                                                                <i className="bi bi-chevron-right"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'password' && (
                                    <div className="content-section">
                                        <h2 className="section-title">Quản lý tài khoản</h2>
                                        <div className="info-card">
                                            <div className="card-body">
                                                <p className="text-muted">Chức năng đang được phát triển...</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'services' && (
                                    <div className="content-section">
                                        <h2 className="section-title">Góp ý dịch vụ</h2>
                                        <div className="info-card">
                                            <div className="card-body">
                                                <p className="text-muted">Chức năng đang được phát triển...</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProfilePage;
