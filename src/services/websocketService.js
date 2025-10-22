import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'http://localhost:8080';

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = new Map();
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    /**
     * Kết nối tới WebSocket server
     */
    connect(onConnected, onError) {
        if (this.client && this.connected) {
            console.log('WebSocket already connected');
            if (onConnected) onConnected();
            return;
        }

        const token = localStorage.getItem('accessToken');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        this.client = new Client({
            webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`),
            connectHeaders: {
                Authorization: token ? `Bearer ${token}` : '',
            },
            debug: (str) => {
                console.log('STOMP Debug:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: (frame) => {
                console.log('WebSocket Connected:', frame);
                this.connected = true;
                this.reconnectAttempts = 0;
                if (onConnected) onConnected();
            },
            onStompError: (frame) => {
                console.error('STOMP Error:', frame);
                this.connected = false;
                if (onError) onError(frame);
            },
            onWebSocketError: (error) => {
                console.error('WebSocket Error:', error);
                this.connected = false;
                if (onError) onError(error);
            },
            onDisconnect: () => {
                console.log('WebSocket Disconnected');
                this.connected = false;
            },
        });

        this.client.activate();
    }

    /**
     * Subscribe đến topic nhận thông báo thanh toán theo appointmentId
     * Backend gửi đến: /topic/appointments.{appointmentId}
     * Event payload: {event: "SUCCESS", message: "...", appointmentId: ...}
     */
    subscribeToAppointmentPayment(appointmentId, callback) {
        if (!this.client || !this.connected) {
            console.warn('WebSocket not connected. Attempting to connect...');
            this.connect(() => {
                this.subscribeToAppointmentPayment(appointmentId, callback);
            });
            return null;
        }

        // Destination: /topic/appointments.{appointmentId}
        const destination = `/topic/appointments.${appointmentId}`;

        console.log(`[WebSocket] Subscribing to: ${destination}`);

        const subscription = this.client.subscribe(destination, (message) => {
            console.log('[WebSocket] ✅ Received message from:', destination);
            console.log('[WebSocket] Raw message:', message);
            console.log('[WebSocket] Message body:', message.body);

            try {
                const event = JSON.parse(message.body);
                console.log('[WebSocket] Parsed event:', event);
                if (callback) callback(event);
            } catch (error) {
                console.error('[WebSocket] Error parsing payment notification:', error);
                console.error('[WebSocket] Raw body was:', message.body);
            }
        });

        // Lưu subscription để có thể unsubscribe sau
        this.subscriptions.set(appointmentId, subscription);

        return subscription;
    }

    /**
     * Hủy subscribe khỏi một appointment
     */
    unsubscribeFromAppointment(appointmentId) {
        const subscription = this.subscriptions.get(appointmentId);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(appointmentId);
            console.log(`Unsubscribed from appointment ${appointmentId}`);
        }
    }

    /**
     * Ngắt kết nối WebSocket
     */
    disconnect() {
        if (this.client) {
            // Unsubscribe tất cả subscriptions
            this.subscriptions.forEach((subscription) => {
                subscription.unsubscribe();
            });
            this.subscriptions.clear();

            // Deactivate client
            this.client.deactivate();
            this.connected = false;
            console.log('WebSocket disconnected');
        }
    }

    /**
     * Kiểm tra trạng thái kết nối
     */
    isConnected() {
        return this.connected;
    }
}

// Export singleton instance
const websocketService = new WebSocketService();
export default websocketService;
