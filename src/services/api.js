import { toast } from 'sonner';

// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
    // Xử lý lỗi 401 - Unauthorized (token hết hạn hoặc không hợp lệ)
    if (response.status === 401) {
        // Xóa token và thông tin user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        // Hiển thị thông báo
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');

        // Redirect về trang đăng nhập sau 1 giây
        setTimeout(() => {
            window.location.href = '/login';
        }, 1000);

        throw new Error('Phiên đăng nhập đã hết hạn.');
    }

    // Kiểm tra xem response có phải JSON không
    const contentType = response.headers.get('content-type');
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
const apiRequest = async (endpoint, method = 'GET', body = null) => {
    const token = localStorage.getItem('accessToken');

    const config = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
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
