import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import appointmentService from '../services/appointmentService';
import './AppointmentSuccessPage.css';

const AppointmentSuccessPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointmentDetails();
    }, [id]);

    const loadAppointmentDetails = async () => {
        try {
            setLoading(true);
            const response = await appointmentService.getAppointmentById(id);
            setAppointment(response.data);
        } catch (error) {
            // Không hiển thị toast khi load dữ liệu thất bại
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'DA_XAC_NHAN': { label: 'Đã xác nhận', class: 'success' },
            'CHO_XAC_NHAN': { label: 'Chờ xác nhận', class: 'warning' },
            'HOAN_THANH': { label: 'Hoàn thành', class: 'info' },
            'DA_HUY': { label: 'Đã hủy', class: 'danger' }
        };
        const statusInfo = statusMap[status] || { label: status, class: 'secondary' };
        return (
            <span className={`status-badge status-${statusInfo.class}`}>
                {statusInfo.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="success-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Đang tải thông tin...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="success-page">
            <div className="container">
                <div className="success-content">
                    {/* Success Icon */}
                    <div className="success-icon">
                        <i className="bi bi-check-circle-fill"></i>
                    </div>

                    {/* Success Message */}
                    <h1 className="success-title">Đặt lịch thành công!</h1>
                    <p className="success-message">
                        Cảm ơn bạn đã đặt lịch khám tại Phòng khám đa khoa Thái Hà.
                        Vui lòng đến phòng khám đúng giờ hẹn.
                    </p>

                    {/* Appointment Details Card */}
                    {appointment && (
                        <div className="appointment-details-card">
                            <div className="card-header">
                                <h2>
                                    <i className="bi bi-calendar-check"></i>
                                    Thông tin lịch hẹn
                                </h2>
                                {getStatusBadge(appointment.status)}
                            </div>

                            <div className="card-body">
                                <div className="info-grid">
                                    {/* Mã lịch hẹn */}
                                    <div className="info-item">
                                        <div className="info-label">
                                            <i className="bi bi-hash"></i>
                                            Mã lịch hẹn
                                        </div>
                                        <div className="info-value">#{appointment.id}</div>
                                    </div>

                                    {/* Bệnh nhân */}
                                    <div className="info-item">
                                        <div className="info-label">
                                            <i className="bi bi-person-fill"></i>
                                            Bệnh nhân
                                        </div>
                                        <div className="info-value">{appointment.patientName || 'N/A'}</div>
                                    </div>

                                    {/* Ngày khám */}
                                    <div className="info-item">
                                        <div className="info-label">
                                            <i className="bi bi-calendar3"></i>
                                            Ngày khám
                                        </div>
                                        <div className="info-value highlight">{formatDate(appointment.date)}</div>
                                    </div>

                                    {/* Giờ khám */}
                                    <div className="info-item">
                                        <div className="info-label">
                                            <i className="bi bi-clock-fill"></i>
                                            Giờ khám
                                        </div>
                                        <div className="info-value highlight">{appointment.time}</div>
                                    </div>

                                    {/* Bác sĩ */}
                                    {appointment.doctorName && (
                                        <div className="info-item">
                                            <div className="info-label">
                                                <i className="bi bi-person-badge"></i>
                                                Bác sĩ
                                            </div>
                                            <div className="info-value">{appointment.doctorName}</div>
                                        </div>
                                    )}

                                    {/* Gói khám */}
                                    {appointment.healthPlanName && (
                                        <div className="info-item">
                                            <div className="info-label">
                                                <i className="bi bi-box-seam"></i>
                                                Gói khám
                                            </div>
                                            <div className="info-value">{appointment.healthPlanName}</div>
                                        </div>
                                    )}

                                    {/* Triệu chứng */}
                                    {appointment.symptoms && (
                                        <div className="info-item full-width">
                                            <div className="info-label">
                                                <i className="bi bi-file-medical"></i>
                                                Triệu chứng
                                            </div>
                                            <div className="info-value">{appointment.symptoms}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Important Notes */}
                    <div className="notes-card">
                        <h3>
                            <i className="bi bi-exclamation-circle"></i>
                            Lưu ý quan trọng
                        </h3>
                        <ul>
                            <li>Vui lòng đến phòng khám trước giờ hẹn 15 phút để làm thủ tục</li>
                            <li>Mang theo CMND/CCCD và sổ khám bệnh (nếu có)</li>
                            <li>Nếu cần hủy hoặc thay đổi lịch hẹn, vui lòng liên hệ trước 24 giờ</li>
                            <li>Hotline: <strong>1900-xxxx</strong></li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/profile')}
                        >
                            <i className="bi bi-person-circle"></i>
                            Xem hồ sơ bệnh án
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => navigate('/')}
                        >
                            <i className="bi bi-house-fill"></i>
                            Về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentSuccessPage;
