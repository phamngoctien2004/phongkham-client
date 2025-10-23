import { apiRequest } from './api';

const appointmentService = {
    // Lấy danh sách bệnh nhân liên kết với tài khoản
    getPatients: async () => {
        return apiRequest('/patients/relationships', 'GET');
    },

    // Lấy danh sách bác sĩ
    getDoctors: async () => {
        return apiRequest('/doctors', 'GET', null, false);
    },

    // Lấy danh sách bằng cấp
    getDegrees: async () => {
        return apiRequest('/degrees', 'GET', null, false);
    },

    // Lấy danh sách dịch vụ/gói khám
    getServices: async (type = null) => {
        const url = type ? `/services?type=${type}` : '/services';
        return apiRequest(url, 'GET', null, false);
    },

    // Lấy chi tiết dịch vụ cho trang chi tiết
    getServiceDetail: async (id) => {
        return apiRequest(`/services/optional/${id}`, 'GET', null, false);
    },

    // Lấy lịch khả dụng
    getAvailableSchedules: async (params) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/schedules/available?${queryString}`, 'GET');
    },

    // Tạo lịch hẹn
    createAppointment: async (data) => {
        return apiRequest('/appointments', 'POST', data);
    },

    // Lấy chi tiết lịch hẹn
    getAppointmentDetail: async (id) => {
        return apiRequest(`/appointments/${id}`, 'GET');
    },

    // Tạo thanh toán cho lịch hẹn
    createPayment: async (appointmentId) => {
        return apiRequest(`/payments/appointment/${appointmentId}`, 'POST', {});
    },

    // Lấy thông tin profile bệnh nhân hiện tại
    getMyProfile: async () => {
        return apiRequest('/patients/me', 'GET');
    },

    // Lấy lịch sử đặt lịch của tôi
    getMyAppointments: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/appointments/me?${queryString}` : '/appointments/me';
        return apiRequest(url, 'GET');
    },

    // Lấy hồ sơ khám bệnh của tôi
    getMedicalRecords: async () => {
        return apiRequest('/medical-record/me', 'GET');
    },

    // Lấy hồ sơ khám bệnh theo bệnh nhân
    getMedicalRecordsByPatient: async (patientId) => {
        return apiRequest(`/medical-record/patient/${patientId}`, 'GET');
    },

    // Lấy chi tiết hồ sơ khám bệnh
    getMedicalRecordDetail: async (id) => {
        return apiRequest(`/medical-record/${id}`, 'GET');
    },

    // Lấy hóa đơn theo medical record ID
    getInvoiceByMedicalRecord: async (medicalRecordId) => {
        return apiRequest(`/medical-record/${medicalRecordId}/invoice`, 'GET');
    },

    // Lấy chi tiết phiếu xét nghiệm
    getLabOrderDetail: async (id) => {
        return apiRequest(`/lab-orders/${id}`, 'GET');
    },
};

export default appointmentService;
