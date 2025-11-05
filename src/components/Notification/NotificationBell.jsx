import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import notificationService from '../../services/notificationService';
import websocketService from '../../services/websocketService';
import './NotificationBell.css';

const NotificationBell = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch notifications khi component mount
    useEffect(() => {
        if (user?.id) {
            fetchNotifications();
            setupWebSocket();
        }

        return () => {
            // Cleanup websocket subscription
            if (user?.id) {
                websocketService.unsubscribeFromNotifications?.(user.id);
            }
        };
    }, [user?.id]);

    // Close dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Track unreadCount changes
    useEffect(() => {
        console.log('🔔 [Notification] unreadCount changed:', unreadCount);
    }, [unreadCount]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationService.getNotifications();
            console.log('📢 [Notification] API Response:', response);

            if (response?.data) {
                console.log('📢 [Notification] unreadCount from API:', response.data.unreadCount);

                // Normalize notifications để đảm bảo format đúng
                const normalizedNotifications = (response.data.notifications || []).map(notif => ({
                    ...notif,
                    // Hỗ trợ cả isUserRead và is_user_read
                    isUserRead: notif.isUserRead ?? notif.is_user_read ?? false
                }));

                setNotifications(normalizedNotifications);
                setUnreadCount(response.data.unreadCount || 0);

                console.log('📢 [Notification] State updated - unreadCount:', response.data.unreadCount || 0);
            }
        } catch (error) {
            console.error('❌ [Notification] Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const setupWebSocket = () => {
        if (!user?.id) return;

        // Chỉ subscribe nếu WebSocket đã connected
        if (websocketService.isConnected()) {
            subscribeToNotifications();
        } else {
            // Nếu chưa connected, connect trước rồi subscribe
            websocketService.connect(() => {
                subscribeToNotifications();
            });
        }
    };

    const subscribeToNotifications = () => {
        if (!user?.id) return;

        // Kiểm tra client và connected
        if (!websocketService.client || !websocketService.connected) {
            console.log('📬 [Notification] WebSocket not ready, skipping subscribe');
            return;
        }

        try {
            const subscription = websocketService.client.subscribe(
                `/topic/notifications/book.${user.id}`,
                (message) => {
                    try {
                        const newNotification = JSON.parse(message.body);
                        console.log('📬 [WebSocket] New notification:', newNotification);

                        // Normalize notification format
                        const normalizedNotification = {
                            ...newNotification,
                            // Hỗ trợ cả isUserRead và is_user_read
                            isUserRead: newNotification.isUserRead ?? newNotification.is_user_read ?? false
                        };

                        console.log('📬 [WebSocket] isUserRead:', normalizedNotification.isUserRead);

                        // Add new notification to the list
                        setNotifications(prev => [normalizedNotification, ...prev]);

                        // Chỉ tăng unreadCount nếu notification chưa đọc
                        if (!normalizedNotification.isUserRead) {
                            console.log('📬 [WebSocket] Incrementing unreadCount');
                            setUnreadCount(prev => prev + 1);
                        } else {
                            console.log('📬 [WebSocket] Not incrementing (already read)');
                        }
                    } catch (error) {
                        console.error('❌ [WebSocket] Error:', error);
                    }
                }
            );

            // Store subscription for cleanup
            websocketService.unsubscribeFromNotifications = (userId) => {
                if (subscription) {
                    try {
                        subscription.unsubscribe();
                        console.log('[Notification] Unsubscribed from notifications');
                    } catch (error) {
                        console.error('[Notification] Error unsubscribing:', error);
                    }
                }
            };
        } catch (error) {
            console.error('[Notification] Error subscribing:', error);
        }
    };

    const handleBellClick = async () => {
        setShowDropdown(!showDropdown);

        // Đánh dấu đã đọc khi mở dropdown (chỉ khi có thông báo chưa đọc)
        if (!showDropdown && unreadCount > 0) {
            console.log('✅ [Notification] Marking as read...');
            try {
                await notificationService.markAsRead();
                // Fetch lại notifications từ API để đồng bộ với database
                await fetchNotifications();
                console.log('✅ [Notification] Marked as read & refetched');
            } catch (error) {
                console.error('❌ [Notification] Error marking as read:', error);
            }
        }
    };

    const formatTime = (timeString) => {
        try {
            const date = new Date(timeString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'Vừa xong';
            if (diffMins < 60) return `${diffMins} phút trước`;
            if (diffHours < 24) return `${diffHours} giờ trước`;
            if (diffDays < 7) return `${diffDays} ngày trước`;

            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return timeString;
        }
    };

    if (!user) return null;

    return (
        <div className="notification-bell-container" ref={dropdownRef}>
            <button
                className="notification-bell-btn"
                onClick={handleBellClick}
                aria-label="Thông báo"
                title={`Unread count: ${unreadCount}`}
            >
                <i className="bi bi-bell"></i>
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
            </button>

            {showDropdown && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Thông báo</h3>
                        {notifications.length > 0 && (
                            <span className="notification-count">
                                {notifications.length} thông báo
                            </span>
                        )}
                    </div>

                    <div className="notification-list">
                        {loading ? (
                            <div className="notification-loading">
                                <i className="bi bi-hourglass-split"></i>
                                <span>Đang tải...</span>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="notification-empty">
                                <i className="bi bi-bell-slash"></i>
                                <span>Không có thông báo</span>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${!notification.isUserRead ? 'unread' : ''}`}
                                >
                                    <div className="notification-icon">
                                        <i className={`bi ${notification.type === 'DAT_LICH'
                                                ? 'bi-calendar-check'
                                                : 'bi-info-circle'
                                            }`}></i>
                                    </div>
                                    <div className="notification-content">
                                        <p className="notification-title">{notification.title}</p>
                                        <span className="notification-time">
                                            {formatTime(notification.time)}
                                        </span>
                                    </div>
                                    {!notification.isUserRead && (
                                        <div className="notification-unread-dot"></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="notification-footer">
                            <button
                                className="view-all-btn"
                                onClick={() => {
                                    setShowDropdown(false);
                                    // Navigate to notifications page if exists
                                }}
                            >
                                Xem tất cả
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
