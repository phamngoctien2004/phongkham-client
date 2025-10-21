import apiRequest from './api';

// Authentication Service
const authService = {
    // Đăng nhập bằng mật khẩu
    loginWithPassword: async (username, password) => {
        const response = await apiRequest('/auth/login', 'POST', {
            username,
            password,
            type: 'PASSWORD',
        });

        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.userResponse));
        }

        return response;
    },

    // Đăng nhập bằng OTP
    loginWithOTP: async (username, password) => {
        const response = await apiRequest('/auth/login', 'POST', {
            username,
            password,
            type: 'OTP',
        });

        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.userResponse));
        }

        return response;
    },

    // Gửi OTP đăng nhập
    sendLoginOTP: async (phone) => {
        return await apiRequest('/auth/send-otp', 'POST', { to: phone });
    },

    // Gửi OTP đăng ký
    sendRegisterOTP: async (phone) => {
        return await apiRequest('/auth/register-otp', 'POST', { to: phone });
    },

    // Xác thực OTP
    verifyOTP: async (phone, otp) => {
        return await apiRequest('/auth/verify-otp', 'POST', { phone, otp });
    },

    // Đăng ký tài khoản
    register: async (userData) => {
        const response = await apiRequest('/auth/register', 'POST', userData);

        // Sau khi đăng ký thành công, tự động đăng nhập
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.userResponse));
        }

        return response;
    },

    // Đăng xuất
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    },

    // Lấy thông tin user hiện tại
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Kiểm tra đã đăng nhập
    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    },
};

export default authService;
