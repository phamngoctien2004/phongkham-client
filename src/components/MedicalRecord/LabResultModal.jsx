import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';
import appointmentService from '../../services/appointmentService';
import './LabResultModal.css';

const LabResultModal = ({ isOpen, onClose, labOrderId }) => {
    const [loading, setLoading] = useState(false);
    const [labOrder, setLabOrder] = useState(null);

    useEffect(() => {
        if (isOpen && labOrderId) {
            loadLabOrderDetail();
        }
    }, [isOpen, labOrderId]);

    const loadLabOrderDetail = async () => {
        try {
            setLoading(true);
            const response = await appointmentService.getLabOrderDetail(labOrderId);
            setLabOrder(response.data);
        } catch (error) {
            toast.error('Không thể tải kết quả xét nghiệm');
            console.error(error);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '--';
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '--';
        return amount.toLocaleString('vi-VN') + ' đ';
    };

    const getStatusText = (status) => {
        const statusMap = {
            'CHO_THUC_HIEN': 'Chờ thực hiện',
            'DANG_THUC_HIEN': 'Đang thực hiện',
            'HOAN_THANH': 'Hoàn thành',
            'HUY': 'Đã hủy',
        };
        return statusMap[status] || status;
    };

    const getRangeStatusClass = (rangeStatus) => {
        const statusMap = {
            'THAP': 'low',
            'TRUNG_BINH': 'normal',
            'CAO': 'high',
            'CHUA_XAC_DINH': 'undefined',
        };
        return statusMap[rangeStatus] || '';
    };

    const getRangeStatusText = (rangeStatus) => {
        const statusMap = {
            'THAP': 'Thấp',
            'TRUNG_BINH': 'Bình thường',
            'CAO': 'Cao',
            'CHUA_XAC_DINH': 'Chưa xác định',
        };
        return statusMap[rangeStatus] || rangeStatus;
    };

    if (!isOpen) return null;

    return (
        <div className="lab-result-modal-overlay" onClick={onClose}>
            <div className="lab-result-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <i className="bi bi-file-earmark-medical"></i>
                        Kết quả xét nghiệm
                    </h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div className="modal-loading">
                            <i className="bi bi-hourglass-split"></i>
                            <p>Đang tải kết quả...</p>
                        </div>
                    ) : labOrder ? (
                        <>
                            {/* Thông tin xét nghiệm */}
                            <div className="lab-info-section">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>Mã phiếu:</label>
                                        <span>{labOrder.code}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Tên xét nghiệm:</label>
                                        <span>{labOrder.healthPlanName}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Phòng:</label>
                                        <span>{labOrder.room || '--'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Bác sĩ thực hiện:</label>
                                        <span>{labOrder.doctorPerformed || '--'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Ngày thực hiện:</label>
                                        <span>{formatDate(labOrder.orderDate)}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Ngày dự kiến có kết quả:</label>
                                        <span>{formatDate(labOrder.expectedResultDate)}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Trạng thái:</label>
                                        <span className={`status-badge status-${labOrder.status}`}>
                                            {getStatusText(labOrder.status)}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <label>Giá:</label>
                                        <span className="price">{formatCurrency(labOrder.price)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Kết quả xét nghiệm */}
                            {labOrder.labResultResponse && (
                                <>
                                    <div className="result-section">
                                        <h3>
                                            <i className="bi bi-clipboard-data"></i>
                                            Kết quả chi tiết
                                        </h3>

                                        <div className="result-info">
                                            <div className="result-item">
                                                <label>Ngày có kết quả:</label>
                                                <span>{formatDate(labOrder.labResultResponse.date)}</span>
                                            </div>
                                            {labOrder.labResultResponse.summary && (
                                                <div className="result-item full-width">
                                                    <label>Tóm tắt:</label>
                                                    <span>{labOrder.labResultResponse.summary}</span>
                                                </div>
                                            )}
                                            {labOrder.labResultResponse.resultDetails && (
                                                <div className="result-item full-width">
                                                    <label>Chi tiết kết quả:</label>
                                                    <span>{labOrder.labResultResponse.resultDetails}</span>
                                                </div>
                                            )}
                                            {labOrder.labResultResponse.explanation && (
                                                <div className="result-item full-width">
                                                    <label>Giải thích:</label>
                                                    <span>{labOrder.labResultResponse.explanation}</span>
                                                </div>
                                            )}
                                            {labOrder.labResultResponse.note && (
                                                <div className="result-item full-width">
                                                    <label>Ghi chú:</label>
                                                    <span>{labOrder.labResultResponse.note}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bảng các chỉ số */}
                                    {labOrder.labResultResponse.paramResults && labOrder.labResultResponse.paramResults.length > 0 && (
                                        <div className="params-section">
                                            <h3>
                                                <i className="bi bi-bar-chart-line"></i>
                                                Các chỉ số xét nghiệm
                                            </h3>
                                            <div className="params-table-container">
                                                <table className="params-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Chỉ số</th>
                                                            <th>Giá trị</th>
                                                            <th>Đơn vị</th>
                                                            <th>Giá trị tham chiếu</th>
                                                            <th>Đánh giá</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {labOrder.labResultResponse.paramResults.map((param) => (
                                                            <tr key={param.id} className={`param-row ${getRangeStatusClass(param.rangeStatus)}`}>
                                                                <td className="param-name">{param.name}</td>
                                                                <td className="param-value">{param.value}</td>
                                                                <td className="param-unit">{param.unit || '--'}</td>
                                                                <td className="param-range">{param.range || '--'}</td>
                                                                <td className="param-status">
                                                                    <span className={`range-badge ${getRangeStatusClass(param.rangeStatus)}`}>
                                                                        {getRangeStatusText(param.rangeStatus)}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Chẩn đoán */}
                            {labOrder.diagnosis && (
                                <div className="diagnosis-section">
                                    <h3>
                                        <i className="bi bi-stethoscope"></i>
                                        Chẩn đoán
                                    </h3>
                                    <p>{labOrder.diagnosis}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="modal-error">
                            <i className="bi bi-exclamation-circle"></i>
                            <p>Không tìm thấy kết quả xét nghiệm</p>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Đóng
                    </button>
                    {labOrder && (
                        <button className="btn btn-primary" onClick={() => window.print()}>
                            <i className="bi bi-printer"></i>
                            In kết quả
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

LabResultModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    labOrderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default LabResultModal;
