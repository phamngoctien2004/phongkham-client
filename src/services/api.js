import { toast } from 'sonner';

// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
    // Kiểm tra xem response có phải JSON không
    const contentType = response.headers.get('content-type');

    // Xử lý lỗi 401 - Unauthorized
    if (response.status === 401) {
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();

            // Nếu là lỗi đăng nhập (AUTH_401), không xóa token và redirect
            if (data.data === 'AUTH_401') {
                throw new Error(data.message || 'Đăng nhập thất bại');
            }
        }

        // Các lỗi 401 khác -> Phiên hết hạn
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');

        setTimeout(() => {
            window.location.href = '/login';
        }, 1000);

        throw new Error('Phiên đăng nhập đã hết hạn.');
    }

    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } else {
        // Nếu không phải JSON, xử lý như text
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || 'API request failed');
        }

        return null;
    }
};

// Helper function to make API requests
const apiRequest = async (endpoint, method = 'GET', body = null, requireAuth = true) => {
    const token = localStorage.getItem('accessToken');

    const config = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            // Chỉ gửi token nếu requireAuth = true
            ...(requireAuth && token && { Authorization: `Bearer ${token}` }),
        },
    };

    if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return handleResponse(response);
};

export { apiRequest };
export default apiRequest;
