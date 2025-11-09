import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import appointmentService from '../services/appointmentService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LabResultModal from '../components/MedicalRecord/LabResultModal';
import '../assets/css/medical-record-detail.css';

const MedicalRecordDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [record, setRecord] = useState(null);
    const [prescription, setPrescription] = useState(null);
    const [isLabResultModalOpen, setIsLabResultModalOpen] = useState(false);
    const [selectedLabOrderId, setSelectedLabOrderId] = useState(null);

    useEffect(() => {
        loadRecordDetail();
        loadPrescription();
    }, [id]);

    const loadRecordDetail = async () => {
        try {
            setLoading(true);
            const response = await appointmentService.getMedicalRecordDetail(id);
            setRecord(response.data);
        } catch (error) {
            toast.error('Không thể tải chi tiết hồ sơ');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadPrescription = async () => {
        try {
            const response = await appointmentService.getPrescriptionByMedicalRecord(id);
            setPrescription(response.data);
        } catch (error) {
            // Không hiển thị lỗi nếu không có đơn thuốc
            console.log('Không có đơn thuốc:', error);
        }
    };

    const handleViewLabResult = (labOrderId) => {
        setSelectedLabOrderId(labOrderId);
        setIsLabResultModalOpen(true);
    };

    const handleCloseLabResult = () => {
        setIsLabResultModalOpen(false);
        setSelectedLabOrderId(null);
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
            'CHO_KHAM': 'Chờ khám',
            'DANG_KHAM': 'Đang khám',
            'HOAN_THANH': 'Hoàn thành',
            'HUY': 'Đã hủy',
            'DA_THANH_TOAN': 'Đã thanh toán',
            'CHUA_THANH_TOAN': 'Chưa thanh toán',
            'CHO_THUC_HIEN': 'Chờ thực hiện',
            'DANG_THUC_HIEN': 'Đang thực hiện',
        };
        return statusMap[status] || status;
    };

    const getGenderText = (gender) => {
        return gender === 'NAM' ? 'Nam' : gender === 'NU' ? 'Nữ' : gender;
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="medical-record-detail-page">
                    <div className="container">
                        <div className="loading-container">
                            <i className="bi bi-hourglass-split"></i>
                            <p>Đang tải thông tin hồ sơ...</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!record) {
        return (
            <>
                <Header />
                <div className="medical-record-detail-page">
                    <div className="container">
                        <div className="error-container">
                            <i className="bi bi-exclamation-circle"></i>
                            <p>Không tìm thấy thông tin hồ sơ</p>
                            <button className="btn btn-primary" onClick={() => navigate('/profile')}>
                                Quay lại
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="medical-record-detail-page">
                <div className="container">
                    {/* Header with back button */}
                    <div className="page-header">
                        <button className="btn-back" onClick={() => navigate('/profile')}>
                            <i className="bi bi-arrow-left"></i>
                            Quay lại
                        </button>
                        <h1>
                            <i className="bi bi-file-medical-fill"></i>
                            Chi tiết hồ sơ khám bệnh
                        </h1>
                    </div>

                    {/* Thông tin hồ sơ */}
                    <div className="detail-section">
                        <h3 className="section-title">
                            <i className="bi bi-info-circle"></i>
                            Thông tin hồ sơ
                        </h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label>Mã hồ sơ:</label>
                                <span className="detail-value">{record.code}</span>
                            </div>
                            <div className="detail-item">
                                <label>Ngày khám:</label>
                                <span className="detail-value">{formatDate(record.date)}</span>
                            </div>
                            <div className="detail-item">
                                <label>Bác sĩ khám:</label>
                                <span className="detail-value">{record.doctorName || '--'}</span>
                            </div>
                            <div className="detail-item">
                                <label>Trạng thái:</label>
                                <span className={`status-badge status-${record.status}`}>
                                    {getStatusText(record.status)}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Gói dịch vụ:</label>
                                <span className="detail-value">{record.healthPlanName || '--'}</span>
                            </div>
                            <div className="detail-item">
                                <label>Họ và tên:</label>
                                <span className="detail-value">{record.patientName}</span>
                            </div>
                            <div className="detail-item">
                                <label>Giới tính:</label>
                                <span className="detail-value">{getGenderText(record.patientGender)}</span>
                            </div>
                            <div className="detail-item">
                                <label>Số điện thoại:</label>
                                <span className="detail-value">{record.patientPhone || '--'}</span>
                            </div>
                            <div className="detail-item full-width">
                                <label>Địa chỉ:</label>
                                <span className="detail-value">{record.patientAddress || '--'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin khám bệnh */}
                    <div className="detail-section">
                        <h3 className="section-title">
                            <i className="bi bi-clipboard2-pulse"></i>
                            Thông tin khám bệnh
                        </h3>
                        <div className="detail-grid">
                            <div className="detail-item full-width">
                                <label>Triệu chứng:</label>
                                <span className="detail-value">{record.symptoms || '--'}</span>
                            </div>
                            <div className="detail-item full-width">
                                <label>Khám lâm sàng:</label>
                                <span className="detail-value">{record.clinicalExamination || '--'}</span>
                            </div>
                            <div className="detail-item full-width">
                                <label>Chẩn đoán:</label>
                                <span className="detail-value">{record.diagnosis || '--'}</span>
                            </div>
                            <div className="detail-item full-width">
                                <label>Kế hoạch điều trị:</label>
                                <span className="detail-value">{record.treatmentPlan || '--'}</span>
                            </div>
                            <div className="detail-item full-width">
                                <label>Ghi chú:</label>
                                <span className="detail-value">{record.note || '--'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Chi tiết dịch vụ */}
                    {record.invoiceDetailsResponse && record.invoiceDetailsResponse.length > 0 && (
                        <div className="detail-section">
                            <h3 className="section-title">
                                <i className="bi bi-receipt"></i>
                                Dịch vụ y tế
                            </h3>
                            {record.invoiceDetailsResponse.map((invoice) => (
                                <div key={invoice.id} className="">
                                    {/* <div className="invoice-header">
                                        <h4>{invoice.healthPlanName}</h4>
                                        <span className={`status-badge status-${invoice.status}`}>
                                            {getStatusText(invoice.status)}
                                        </span>
                                    </div> */}
                                    <div className="invoice-body">
                                        {/* Multiple Lab Services */}
                                        {invoice.typeService === 'MULTIPLE' && invoice.multipleLab && invoice.multipleLab.length > 0 && (
                                            <div className="lab-services">
                                                <h5>Các dịch vụ trong gói:</h5>
                                                <div className="lab-services-list">
                                                    {invoice.multipleLab
                                                        .filter(lab => lab.name && lab.name.toLowerCase() !== 'khám bệnh')
                                                        .map((lab) => (
                                                            <div key={lab.id} className="lab-service-item">
                                                                <div className="lab-header">
                                                                    <span className="lab-name">
                                                                        <i className="bi bi-capsule"></i>
                                                                        {lab.name}
                                                                    </span>
                                                                    <div className="lab-actions">
                                                                        <span className={`status-badge status-${lab.status}`}>
                                                                            {getStatusText(lab.status)}
                                                                        </span>
                                                                        {lab.status === 'HOAN_THANH' && (
                                                                            <button
                                                                                className="btn-view-result"
                                                                                onClick={() => handleViewLabResult(lab.id)}
                                                                            >
                                                                                <i className="bi bi-file-text"></i>
                                                                                Xem kết quả
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="lab-info">
                                                                    <span>
                                                                        <i className="bi bi-upc-scan"></i>
                                                                        Mã: {lab.code}
                                                                    </span>
                                                                    <span>
                                                                        <i className="bi bi-door-open"></i>
                                                                        Phòng: {lab.room || '--'}
                                                                    </span>
                                                                </div>
                                                                <div className="lab-info">
                                                                    <span>
                                                                        <i className="bi bi-person-badge"></i>
                                                                        Bác sĩ: {lab.doctorPerforming || 'Chưa có'}
                                                                    </span>
                                                                    <span>
                                                                        <i className="bi bi-clock"></i>
                                                                        {formatDate(lab.createdAt)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Single Lab Service */}
                                        {invoice.typeService === 'SINGLE' && invoice.singleLab && invoice.singleLab.name && invoice.singleLab.name.toLowerCase() !== 'khám bệnh' && (
                                            <div className="lab-services">
                                                <h5>Dịch vụ đơn lẻ:</h5>
                                                <div className="lab-service-item">
                                                    <div className="lab-header">
                                                        <span className="lab-name">
                                                            <i className="bi bi-capsule"></i>
                                                            {invoice.singleLab.name}
                                                        </span>
                                                        <div className="lab-actions">
                                                            {/* <span className={`status-badge status-${invoice.singleLab.status}`}>
                                                                {getStatusText(invoice.singleLab.status)}
                                                            </span> */}
                                                            {invoice.singleLab.status === 'HOAN_THANH' && (
                                                                <button
                                                                    className="btn-view-result"
                                                                    onClick={() => handleViewLabResult(invoice.singleLab.id)}
                                                                >
                                                                    <i className="bi bi-file-text"></i>
                                                                    Xem kết quả
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="lab-info">
                                                        <span>
                                                            <i className="bi bi-upc-scan"></i>
                                                            Mã: {invoice.singleLab.code}
                                                        </span>
                                                        <span>
                                                            <i className="bi bi-door-open"></i>
                                                            Phòng: {invoice.singleLab.room || '--'}
                                                        </span>
                                                    </div>
                                                    <div className="lab-info">
                                                        <span>
                                                            <i className="bi bi-person-badge"></i>
                                                            Bác sĩ: {invoice.singleLab.doctorPerforming || 'Chưa có'}
                                                        </span>
                                                        <span>
                                                            <i className="bi bi-clock"></i>
                                                            {formatDate(invoice.singleLab.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Đơn thuốc */}
                    {prescription && prescription.detailResponses && prescription.detailResponses.length > 0 && (
                        <div className="detail-section">
                            <h3 className="section-title">
                                <i className="bi bi-capsule"></i>
                                Đơn thuốc
                            </h3>
                            <div className="prescription-info">
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <label>Mã đơn thuốc:</label>
                                        <span className="detail-value">{prescription.code}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Ngày kê đơn:</label>
                                        <span className="detail-value">{formatDate(prescription.prescriptionDate)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Bác sĩ kê đơn:</label>
                                        <span className="detail-value">{prescription.doctorCreated || '--'}</span>
                                    </div>
                                    {prescription.generalInstructions && (
                                        <div className="detail-item full-width">
                                            <label>Hướng dẫn chung:</label>
                                            <span className="detail-value">{prescription.generalInstructions}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="prescription-details">
                                <h5>Chi tiết thuốc:</h5>
                                <div className="medicines-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Tên thuốc</th>
                                                <th>Nồng độ</th>
                                                <th>Dạng bào chế</th>
                                                <th>Số lượng</th>
                                                <th>Đơn vị</th>
                                                <th>Cách dùng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {prescription.detailResponses.map((detail, index) => (
                                                <tr key={detail.id}>
                                                    <td>{index + 1}</td>
                                                    <td className="medicine-name">{detail.medicineResponse?.name || '--'}</td>
                                                    <td>{detail.medicineResponse?.concentration || '--'}</td>
                                                    <td>{detail.medicineResponse?.dosageForm || '--'}</td>
                                                    <td className="text-center">{detail.quantity}</td>
                                                    <td>{detail.medicineResponse?.unit || '--'}</td>
                                                    <td className="usage-instructions">{detail.usageInstructions || '--'}</td>
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

            {/* Lab Result Modal */}
            <LabResultModal
                isOpen={isLabResultModalOpen}
                onClose={handleCloseLabResult}
                labOrderId={selectedLabOrderId}
            />

            <Footer />
        </>
    );
};

export default MedicalRecordDetailPage;
