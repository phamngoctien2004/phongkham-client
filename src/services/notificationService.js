import apiRequest from './api';

const notificationService = {
    /**
     * Lấy danh sách thông báo của người dùng
     */
    async getNotifications() {
        try {
            // Thêm timestamp để tránh cache
            const timestamp = new Date().getTime();
            const response = await apiRequest(`/users/notifications?t=${timestamp}`, 'GET');
            return response;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    /**
     * Đánh dấu đã đọc tất cả thông báo
     */
    async markAsRead() {
        try {
            console.log('🔖 [NotificationService] Calling markAsRead API...');
            const response = await apiRequest('/users/notifications/mark-as-read', 'POST');
            console.log('🔖 [NotificationService] markAsRead response:', response);
            return response;
        } catch (error) {
            console.error('❌ [NotificationService] Error marking notifications as read:', error);
            throw error;
        }
    },
};

export default notificationService;
