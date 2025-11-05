import { apiRequest } from './api';

const chatService = {
    /**
     * Lấy danh sách tất cả cuộc trò chuyện của người dùng
     * @returns {Promise} Danh sách conversations
     */
    getConversations: async () => {
        try {
            const response = await apiRequest('/conversations', 'GET');
            return response.data;
        } catch (error) {
            console.error('Error fetching conversations:', error);
            throw error;
        }
    },

    /**
     * Lấy lịch sử tin nhắn của một cuộc trò chuyện
     * @param {number} conversationId - ID của cuộc trò chuyện
     * @returns {Promise} Object chứa messages, lastReadId, totalUnread, totalMessage, hasMoreOld
     */
    getMessages: async (conversationId) => {
        try {
            const response = await apiRequest(`/conversations/${conversationId}/messages`, 'GET');
            return response.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    },

    /**
     * Load thêm tin nhắn cũ hơn (phân trang)
     * @param {number} conversationId - ID của cuộc trò chuyện
     * @param {number} beforeId - ID tin nhắn để load trước đó
     * @returns {Promise} Object chứa messages, lastReadId, totalUnread, totalMessage, hasMoreOld
     */
    loadMoreMessages: async (conversationId, beforeId) => {
        try {
            const response = await apiRequest(`/conversations/${conversationId}/messages/more?beforeId=${beforeId}`, 'GET');
            return response.data;
        } catch (error) {
            console.error('Error loading more messages:', error);
            throw error;
        }
    },

    /**
     * Upload nhiều ảnh cho chat
     * @param {File[]} files - Mảng các file ảnh cần upload
     * @returns {Promise<string[]>} Mảng URL của các ảnh đã upload
     */
    uploadImages: async (files) => {
        try {
            const token = localStorage.getItem('accessToken');
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });
            formData.append('type', 'chat');

            const response = await fetch(`${API_BASE_URL}/files/multiple`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            return data.data; // Trả về mảng URL
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    },

    /**
     * Lấy danh sách tất cả cuộc trò chuyện AI của người dùng
     * @returns {Promise} Danh sách AI conversations
     */
    getAIConversations: async () => {
        try {
            const response = await apiRequest('/conversations/ai', 'GET');
            return response.data;
        } catch (error) {
            console.error('Error fetching AI conversations:', error);
            throw error;
        }
    },

    /**
     * Lấy lịch sử tin nhắn của một cuộc trò chuyện AI
     * @param {number} conversationId - ID của cuộc trò chuyện
     * @returns {Promise} Object chứa messages (không cần lastReadId, totalUnread)
     */
    getAIMessages: async (conversationId) => {
        try {
            const response = await apiRequest(`/conversations/${conversationId}/messages`, 'GET');
            return response.data;
        } catch (error) {
            console.error('Error fetching AI messages:', error);
            throw error;
        }
    }
};

export default chatService;
