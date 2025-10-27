import { useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';

const ConversationList = () => {
    const { conversations, activeConversation, selectConversation, loadConversations } = useChat();
    const { user } = useAuth();

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    const getConversationTitle = (conversation) => {
        // Lấy user từ localStorage để check role
        const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');

        // Nếu role là BENH_NHAN thì hiển thị "Nhân viên tư vấn"
        // Nếu là lễ tân hoặc role khác thì hiển thị patientName
        if (userFromStorage?.role === 'BENH_NHAN') {
            return 'Nhân viên tư vấn';
        }
        return conversation.patientName || 'Nhân viên tư vấn';
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        // Nếu trong ngày hôm nay
        if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
            return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        }

        // Nếu trong tuần
        if (diff < 7 * 24 * 60 * 60 * 1000) {
            return date.toLocaleDateString('vi-VN', { weekday: 'short' });
        }

        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    };

    return (
        <div className="conversation-list">
            <div className="conversation-list-header">
                <h2>Đoạn chat</h2>
            </div>
            <div className="conversation-list-content">
                {conversations.length === 0 ? (
                    <div className="no-conversations">
                        <i className="bi bi-chat-dots"></i>
                        <p>Chưa có cuộc trò chuyện nào</p>
                    </div>
                ) : (
                    conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={`conversation-item ${activeConversation?.id === conversation.id ? 'active' : ''
                                } ${conversation.newMessage ? 'has-new-message' : ''}`}
                            onClick={() => selectConversation(conversation)}
                        >
                            <div className="conversation-avatar">
                                <div className="avatar-circle">
                                    <i className="bi bi-person-fill"></i>
                                </div>
                                {conversation.newMessage && (
                                    <span className="new-message-indicator"></span>
                                )}
                            </div>
                            <div className="conversation-info">
                                <div className="conversation-name">
                                    {getConversationTitle(conversation)}
                                    {conversation.newMessage && (
                                        <span className="new-badge">Mới</span>
                                    )}
                                </div>
                                <div className="conversation-preview">
                                    {conversation.lastMessage || 'Bắt đầu cuộc trò chuyện'}
                                </div>
                            </div>
                            <div className="conversation-meta">
                                <div className="conversation-time">
                                    {formatTime(conversation.lastMessageTime)}
                                </div>
                                {conversation.unreadCount > 0 && (
                                    <div className="unread-badge">{conversation.unreadCount}</div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ConversationList;
