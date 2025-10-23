import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import appointmentService from '../../services/appointmentService';
import Modal from '../ui/Modal';
import './InvoiceModal.css';

const InvoiceModal = ({ isOpen, onClose, medicalRecordId }) => {
    const [loading, setLoading] = useState(false);
    const [invoice, setInvoice] = useState(null);

    useEffect(() => {
        if (isOpen && medicalRecordId) {
            loadInvoice();
        }
    }, [isOpen, medicalRecordId]);

    const loadInvoice = async () => {
        try {
            setLoading(true);
            const response = await appointmentService.getInvoiceByMedicalRecord(medicalRecordId);
            setInvoice(response.data);
        } catch (error) {
            toast.error('Không thể tải thông tin hóa đơn');
            console.error(error);
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
            'DA_THANH_TOAN': 'Đã thanh toán',
            'CHUA_THANH_TOAN': 'Chưa thanh toán',
        };
        return statusMap[status] || status;
    };

    const getPaymentMethodText = (method) => {
        const methodMap = {
            'TIEN_MAT': 'Tiền mặt',
            'CHUYEN_KHOAN': 'Chuyển khoản',
            'THE': 'Thẻ',
        };
        return methodMap[method] || method || '--';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Thông tin hóa đơn">
            <div className="invoice-modal">
                {loading ? (
                    <div className="invoice-loading">
                        <i className="bi bi-hourglass-split"></i>
                        <p>Đang tải hóa đơn...</p>
                    </div>
                ) : !invoice ? (
                    <div className="invoice-empty">
                        <i className="bi bi-receipt"></i>
                        <p>Không tìm thấy thông tin hóa đơn</p>
                    </div>
                ) : (
                    <div className="invoice-content">
                        {/* Invoice Header */}
                        <div className="invoice-header-section">

                            <h3>HÓA ĐƠN THANH TOÁN</h3>
                            <div className="invoice-code">Mã: {invoice.code}</div>
                        </div>

                        {/* Invoice Details */}
                        <div className="invoice-details">
                            <div className="invoice-row">
                                <span className="invoice-label">Ngày lập:</span>
                                <span className="invoice-value">{formatDate(invoice.date)}</span>
                            </div>

                            <div className="invoice-row">
                                <span className="invoice-label">Phương thức thanh toán:</span>
                                <span className="invoice-value">{getPaymentMethodText(invoice.paymentMethod)}</span>
                            </div>

                            <div className="invoice-row">
                                <span className="invoice-label">Trạng thái:</span>
                                <span className={`invoice-status status-${invoice.status}`}>
                                    {getStatusText(invoice.status)}
                                </span>
                            </div>

                            <div className="invoice-divider"></div>

                            <div className="invoice-row invoice-total-row">
                                <span className="invoice-label">Tổng tiền:</span>
                                <span className="invoice-total">{formatCurrency(invoice.totalAmount)}</span>
                            </div>

                            <div className="invoice-row">
                                <span className="invoice-label">Đã thanh toán:</span>
                                <span className="invoice-paid">{formatCurrency(invoice.paidAmount)}</span>
                            </div>

                            {invoice.totalAmount !== invoice.paidAmount && (
                                <div className="invoice-row">
                                    <span className="invoice-label">Còn lại:</span>
                                    <span className="invoice-remaining">
                                        {formatCurrency(invoice.totalAmount - invoice.paidAmount)}
                                    </span>
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </Modal>
    );
};

export default InvoiceModal;
