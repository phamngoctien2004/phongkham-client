const AI_API_BASE_URL = import.meta.env.VITE_AI_API_BASE_URL || 'http://localhost:8000';

const aiService = {
    /**
     * Clear schedule cache for a specific doctor after booking
     * @param {number} doctorId - ID of the doctor
     */
    clearDoctorScheduleCache: async (doctorId) => {
        try {
            const response = await fetch(`${AI_API_BASE_URL}/api/clear-schedule-cache/${doctorId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to clear cache: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`[AI Service] Cache cleared for doctor ${doctorId}:`, data);
            return data;
        } catch (error) {
            console.error(`[AI Service] Error clearing cache for doctor ${doctorId}:`, error);
            throw error;
        }
    },

    /**
     * Clear all schedule cache after booking
     */
    clearAllScheduleCache: async () => {
        try {
            const response = await fetch(`${AI_API_BASE_URL}/api/clear-all-schedule-cache`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to clear all cache: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[AI Service] All cache cleared:', data);
            return data;
        } catch (error) {
            console.error('[AI Service] Error clearing all cache:', error);
            throw error;
        }
    },

    /**
     * Send chat message to AI
     * @param {string} message - User message
     * @param {Array} conversationHistory - Previous messages
     * @param {number|null} conversationId - ID of the conversation (null for new chat)
     */
    sendChatMessage: async (message, conversationHistory = [], conversationId = null) => {
        try {
            const token = localStorage.getItem('accessToken');
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const userId = user?.id;

            console.log('[AI Service] Sending message with token:', token ? 'Token exists' : 'No token');
            console.log('[AI Service] User ID:', userId);

            if (!userId) {
                throw new Error('User not logged in');
            }

            const response = await fetch(`${AI_API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message,
                    conversation_history: conversationHistory,
                    conversation_id: conversationId,
                    user_id: userId,
                    token: token
                })
            });

            if (!response.ok) {
                throw new Error(`AI request failed: ${response.statusText}`);
            }

            const data = await response.json();
            // Response should include: response, sources, needs_appointment, recommended_doctors
            // And for chat history: conversation_id, conversation_name
            return data;
        } catch (error) {
            console.error('[AI Service] Error sending chat message:', error);
            throw error;
        }
    }
};

export default aiService;
