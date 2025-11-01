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
     */
    sendChatMessage: async (message, conversationHistory = []) => {
        try {
            const response = await fetch(`${AI_API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message,
                    conversation_history: conversationHistory
                })
            });

            if (!response.ok) {
                throw new Error(`AI request failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('[AI Service] Error sending chat message:', error);
            throw error;
        }
    }
};

export default aiService;
