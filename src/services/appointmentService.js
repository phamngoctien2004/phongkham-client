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

    // Lấy danh sách bác sĩ theo khoa/chuyên khoa
    getDoctorsByDepartment: async (departmentId) => {
        return apiRequest(`/departments/${departmentId}/doctors`, 'GET', null, false);
    },

    // Lấy danh sách chuyên khoa
    getDepartments: async () => {
        return apiRequest('/departments', 'GET', null, false);
    },

    // Lấy danh sách bằng cấp
    getDegrees: async () => {
        return apiRequest('/degrees', 'GET', null, false);
    },

    // Lấy danh sách dịch vụ/gói khám
    getServices: async (type = null) => {
        const url = type ? `/services/optional?type=${type}` : '/services/optional';
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

    // Lấy khung giờ không hợp lệ cho dịch vụ/gói khám (không phải chuyên khoa)
    getInvalidTimesForService: async (date, serviceId) => {
        const params = new URLSearchParams({ date, serviceId }).toString();
        return apiRequest(`/appointments/invalid-services?${params}`, 'GET');
    },

    // Tạo lịch hẹn
    createAppointment: async (data) => {
        return apiRequest('/appointments', 'POST', data);
    },

    // Lấy chi tiết lịch hẹn
    getAppointmentDetail: async (id) => {
        return apiRequest(`/appointments/${id}`, 'GET');
    },

    // Alias cho getAppointmentDetail
    getAppointmentById: async (id) => {
        return apiRequest(`/appointments/${id}`, 'GET');
    },

    // Tạo thanh toán cho lịch hẹn
    createPayment: async (appointmentId) => {
        return apiRequest(`/payments/appointment/${appointmentId}`, 'POST', {});
    },

    // Gửi email khi đặt lịch thành công (backend endpoint POST /appointments/send-email-success/{id})
    sendEmailSuccess: async (appointmentId) => {
        return apiRequest(`/appointments/send-email-success/${appointmentId}`, 'POST', {});
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

    // Lấy đơn thuốc theo medical record ID
    getPrescriptionByMedicalRecord: async (medicalRecordId) => {
        return apiRequest(`/prescriptions/medical-record/${medicalRecordId}`, 'GET');
    },

    // Xác nhận/Thay đổi trạng thái lịch hẹn
    confirmAppointment: async (id, status) => {
        return apiRequest('/appointments/confirm', 'PUT', { id, status });
    },

    // Cập nhật thông tin bệnh nhân
    updatePatient: async (patientData) => {
        return apiRequest('/patients', 'PUT', patientData);
    },

    // Thêm quan hệ bệnh nhân (thành viên gia đình)
    addFamilyMember: async (memberData) => {
        return apiRequest('/patients/relationships', 'POST', memberData);
    },

    // Xác thực quan hệ bệnh nhân với OTP
    verifyFamilyMember: async (phone, otp) => {
        return apiRequest('/patients/relationships/verify', 'POST', { phone, otp });
    },

    // Xóa quan hệ bệnh nhân
    deleteFamilyMember: async (patientId) => {
        return apiRequest(`/patients/relationships/${patientId}`, 'DELETE');
    },

    // Upload file (image)
    uploadFile: async (file, type = 'avatars') => {
        const formData = new FormData();
        formData.append('files', file);
        formData.append('type', type);

        return apiRequest('/files', 'POST', formData, true);
    },
};

export default appointmentService;
