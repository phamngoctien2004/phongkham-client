import { apiRequest } from './api';

const appointmentService = {
    // Lấy danh sách bệnh nhân liên kết với tài khoản
    getPatients: async () => {
        return apiRequest('/patients/relationships', 'GET');
    },

    // Lấy danh sách bác sĩ
    getDoctors: async () => {
        return apiRequest('/doctors', 'GET');
    },

    // Lấy danh sách dịch vụ/gói khám
    getServices: async (type = null) => {
        const url = type ? `/services?type=${type}` : '/services';
        return apiRequest(url, 'GET');
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
};

export default appointmentService;
