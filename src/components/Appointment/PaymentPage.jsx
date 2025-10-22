import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import appointmentService from '../../services/appointmentService';
import websocketService from '../../services/websocketService';
import './Appointment.css';

const PaymentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState(null);
    const subscriptionRef = useRef(null);
    const wsConnectedRef = useRef(false);

    useEffect(() => {
        loadAppointmentDetail();

        // Kiểm tra xem có pending appointment trong localStorage không
        checkPendingAppointment();

        // Kết nối WebSocket và subscribe đến thông báo thanh toán
        connectWebSocket();

        // Cleanup khi component unmount
        return () => {
            if (subscriptionRef.current) {
                websocketService.unsubscribeFromAppointment(id);
                subscriptionRef.current = null;
            }
        };
    }, [id]);

    const checkPendingAppointment = () => {
        try {
            const pendingAppointments = JSON.parse(localStorage.getItem('pendingAppointments') || '[]');

            // Xóa các appointment cũ hơn 24 giờ
            const now = new Date();
            const validAppointments = pendingAppointments.filter(apt => {
                const timestamp = new Date(apt.timestamp);
                const hoursDiff = (now - timestamp) / (1000 * 60 * 60);
                return hoursDiff < 24; // Chỉ giữ lại appointment trong vòng 24 giờ
            });

            // Cập nhật lại localStorage nếu có thay đổi
            if (validAppointments.length !== pendingAppointments.length) {
                localStorage.setItem('pendingAppointments', JSON.stringify(validAppointments));
            }

            const currentAppointment = validAppointments.find(
                apt => apt.id === parseInt(id)
            );

            if (currentAppointment) {
                console.log('Found pending appointment in localStorage:', currentAppointment);
                // Appointment vẫn đang chờ thanh toán, sẽ subscribe để nhận thông báo
            }
        } catch (error) {
            console.error('Error checking pending appointment:', error);
        }
    };

    const connectWebSocket = () => {
        // Kết nối WebSocket
        websocketService.connect(
            () => {
                console.log('[PaymentPage] ✅ WebSocket connected successfully');
                wsConnectedRef.current = true;

                console.log('[PaymentPage] Subscribing to appointment:', id);

                // Subscribe đến topic nhận thông báo thanh toán
                const subscription = websocketService.subscribeToAppointmentPayment(
                    id,
                    handlePaymentNotification
                );
                subscriptionRef.current = subscription;

                console.log('[PaymentPage] Subscription created:', subscription ? 'SUCCESS' : 'FAILED');
            },
            (error) => {
                console.error('[PaymentPage] ❌ WebSocket connection error:', error);
                wsConnectedRef.current = false;

                // Thử kết nối lại sau 5 giây
                setTimeout(() => {
                    if (!wsConnectedRef.current) {
                        console.log('[PaymentPage] Attempting to reconnect...');
                        connectWebSocket();
                    }
                }, 5000);
            }
        );
    };

    const handlePaymentNotification = (event) => {
        console.log('[PaymentPage] 🎉 Payment notification received!');
        console.log('[PaymentPage] Event object:', event);
        console.log('[PaymentPage] Event type:', event.event);
        console.log('[PaymentPage] Message:', event.message);
        console.log('[PaymentPage] AppointmentId:', event.appointmentId);

        // Kiểm tra event type - Backend gửi event: "SUCCESS"
        if (event.event === 'SUCCESS' || event.event === 'PAYMENT_SUCCESS' || event.eventType === 'PAYMENT_SUCCESS') {
            console.log('[PaymentPage] ✅ Payment SUCCESS detected!');
            toast.success('Thanh toán thành công!');

            // Xóa appointment khỏi localStorage
            removePendingAppointment(id);

            // Đợi 3 giây để user thấy toast, sau đó reload lại trang để cập nhật trạng thái
            setTimeout(() => {
                console.log('[PaymentPage] Reloading appointment detail...');
                loadAppointmentDetail();

                // Unsubscribe khỏi WebSocket vì đã thanh toán xong
                if (subscriptionRef.current) {
                    websocketService.unsubscribeFromAppointment(id);
                    subscriptionRef.current = null;
                }
            }, 3000);
        } else {
            console.log('[PaymentPage] ⚠️ Unknown event type:', event.event);
        }
    };

    const removePendingAppointment = (appointmentId) => {
        try {
            const pendingAppointments = JSON.parse(localStorage.getItem('pendingAppointments') || '[]');
            const updatedAppointments = pendingAppointments.filter(
                apt => apt.id !== parseInt(appointmentId)
            );
            localStorage.setItem('pendingAppointments', JSON.stringify(updatedAppointments));
        } catch (error) {
            console.error('Error removing pending appointment:', error);
        }
    };

    const loadAppointmentDetail = async () => {
        try {
            setLoading(true);
            const response = await appointmentService.getAppointmentDetail(id);
            setAppointment(response.data);

            // Kiểm tra và xóa khỏi localStorage nếu đã thanh toán hoặc bị hủy
            const status = response.data?.status;
            if (status === 'DA_THANH_TOAN' || status === 'HUY' || status === 'DA_HUY' || status === 'HOAN_THANH') {
                removePendingAppointment(id);

                // Nếu đã thanh toán, có thể hiển thị thông báo
                if (status === 'DA_THANH_TOAN') {
                    // Không toast ở đây vì có thể đã toast từ WebSocket
                    console.log('Appointment already paid');
                }
            }

            // Payment đã được tạo ở bước đặt lịch, chỉ cần hiển thị thông tin
            // Nếu có invoiceCode trong response thì đã có payment
        } catch (error) {
            toast.error('Không thể tải thông tin lịch hẹn');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="payment-page">
                <div className="container">
                    <div className="loading-spinner">
                        <i className="bi bi-hourglass-split"></i>
                        <p>Đang tải thông tin...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="payment-page">
                <div className="container">
                    <div className="error-message">
                        <i className="bi bi-exclamation-triangle"></i>
                        <h3>Không tìm thấy thông tin lịch hẹn</h3>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>
                            Về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const { patientResponse, doctorResponse, healthPlanResponse, date, time, symptoms, totalAmount, status, qr, invoiceCode } = appointment;

    // Kiểm tra xem có hiển thị QR code không (chỉ hiển thị khi trạng thái là CHO_THANH_TOAN)
    const shouldShowQR = status === 'CHO_THANH_TOAN';

    return (
        <div className="payment-page">
            <div className="container">
                <div className="payment-header">
                    <h1>{shouldShowQR ? 'Thanh toán' : 'Thông tin lịch hẹn'}</h1>
                    <p>
                        {shouldShowQR
                            ? 'Quét mã QR để thanh toán lịch khám của bạn'
                            : 'Thông tin chi tiết lịch hẹn của bạn'}
                    </p>
                </div>

                <div className="payment-container">
                    <div className="row">
                        {/* QR Code Section - Chỉ hiển thị khi trạng thái CHO_THANH_TOAN */}
                        {shouldShowQR && (
                            <div className="col-lg-5">
                                <div className="qr-section">
                                    <div className="qr-header">
                                        <i className="bi bi-qr-code"></i>
                                        <h3>Quét mã QR để thanh toán</h3>
                                    </div>

                                    {qr ? (
                                        <div className="qr-code-container">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`}
                                                alt="QR Code"
                                                className="qr-code-image"
                                            />
                                            <div className="qr-instructions">
                                                <p><i className="bi bi-1-circle-fill"></i> Mở ứng dụng ngân hàng</p>
                                                <p><i className="bi bi-2-circle-fill"></i> Chọn quét mã QR</p>
                                                <p><i className="bi bi-3-circle-fill"></i> Xác nhận thanh toán</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="qr-loading">
                                            <i className="bi bi-hourglass-split"></i>
                                            <p>Đang tạo mã QR...</p>
                                        </div>
                                    )}

                                    {invoiceCode && (
                                        <div className="payment-info-box">
                                            <div className="info-row">
                                                <span>Mã hóa đơn:</span>
                                                <strong>{invoiceCode}</strong>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Appointment Details Section */}
                        <div className={shouldShowQR ? "col-lg-7" : "col-lg-12"}>
                            <div className="appointment-details">
                                <div className="details-header">
                                    <i className="bi bi-file-text"></i>
                                    <h3>Thông tin lịch khám</h3>
                                </div>

                                <div className="details-content">
                                    {/* Bệnh nhân */}
                                    <div className="detail-section">
                                        <h4><i className="bi bi-person-circle"></i> Thông tin bệnh nhân</h4>
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <label>Họ và tên:</label>
                                                <span>{patientResponse.fullName}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Mã bệnh nhân:</label>
                                                <span>{patientResponse.code}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Giới tính:</label>
                                                <span>{patientResponse.gender === 'NAM' ? 'Nam' : 'Nữ'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Ngày sinh:</label>
                                                <span>{new Date(patientResponse.birth).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Số điện thoại:</label>
                                                <span>{patientResponse.phone || 'Chưa cập nhật'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Địa chỉ:</label>
                                                <span>{patientResponse.address}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thông tin khám */}
                                    <div className="detail-section">
                                        <h4><i className="bi bi-calendar-check"></i> Thông tin khám</h4>
                                        <div className="detail-grid">
                                            {doctorResponse && (
                                                <>
                                                    <div className="detail-item">
                                                        <label>Loại khám:</label>
                                                        <span>Khám với bác sĩ</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <label>Bác sĩ:</label>
                                                        <span>{doctorResponse.fullName}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <label>Chức vụ:</label>
                                                        <span>{doctorResponse.position}</span>
                                                    </div>
                                                </>
                                            )}
                                            {healthPlanResponse && (
                                                <>
                                                    <div className="detail-item">
                                                        <label>Loại khám:</label>
                                                        <span>Gói khám/Dịch vụ</span>
                                                    </div>
                                                    <div className="detail-item full-width">
                                                        <label>Tên gói:</label>
                                                        <span>{healthPlanResponse.name}</span>
                                                    </div>
                                                </>
                                            )}
                                            <div className="detail-item">
                                                <label>Ngày khám:</label>
                                                <span>{new Date(date).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Giờ khám:</label>
                                                <span>{time.substring(0, 5)}</span>
                                            </div>
                                            {symptoms && (
                                                <div className="detail-item full-width">
                                                    <label>Triệu chứng:</label>
                                                    <span>{symptoms}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Thanh toán */}
                                    <div className="detail-section payment-summary">
                                        <h4><i className="bi bi-cash-coin"></i> Thanh toán</h4>
                                        <div className="total-amount">
                                            <span>Tổng tiền:</span>
                                            <strong>{totalAmount.toLocaleString('vi-VN')}đ</strong>
                                        </div>
                                        <div className="payment-status">
                                            <span>Trạng thái:</span>
                                            <span className={`status-badge ${status}`}>
                                                {status === 'CHO_THANH_TOAN' ? 'Chờ thanh toán' :
                                                    status === 'DA_THANH_TOAN' ? 'Đã thanh toán' :
                                                        status === 'HUY' || status === 'DA_HUY' ? 'Đã hủy' :
                                                            status === 'HOAN_THANH' ? 'Hoàn thành' :
                                                                status}
                                            </span>
                                        </div>
                                        {(status === 'HUY' || status === 'DA_HUY') && (
                                            <div className="cancelled-notice" style={{
                                                marginTop: '15px',
                                                padding: '12px',
                                                background: '#fff3cd',
                                                border: '1px solid #ffc107',
                                                borderRadius: '8px',
                                                color: '#856404'
                                            }}>
                                                <i className="bi bi-exclamation-triangle-fill" style={{ marginRight: '8px' }}></i>
                                                Lịch hẹn này đã bị hủy. Vui lòng đặt lịch mới nếu bạn muốn khám.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
