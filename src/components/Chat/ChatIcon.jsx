import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import './ChatIcon.css';

const ChatIcon = () => {
    const { toggleChatPopup, conversations } = useChat();

    // Tính có tin nhắn mới ở bất kỳ conversation nào
    const hasUnread = conversations.some((conv) => conv.newMessage);
    // Đếm số conversation có tin nhắn mới
    const unreadCount = conversations.filter((conv) => conv.newMessage).length;

    return (
        <button
            className="chat-icon-btn"
            onClick={toggleChatPopup}
            aria-label="Mở tin nhắn"
        >
            <i className="bi bi-chat-dots"></i>
            {hasUnread && unreadCount > 0 && (
                <span className="chat-icon-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
        </button>
    );
};

export default ChatIcon;
