import React from 'react';
import './ChatButton.css';

const ChatButton = ({ hasUnread, unreadCount = 0, onClick, isOpen = false }) => {
    console.log('[ChatButton] hasUnread:', hasUnread, 'unreadCount:', unreadCount, 'isOpen:', isOpen);

    return (
        <div className="chat-button-wrapper">
            <button
                onClick={onClick}
                className={`chat-button ${isOpen ? 'chat-button-open' : ''}`}
                aria-label={isOpen ? "Đóng chat" : "Mở chat"}
            >
                <i className="bi bi-chat-dots"></i>
                {hasUnread && !isOpen && unreadCount > 0 && (
                    <span className="chat-badge">
                        {unreadCount <= 99 ? unreadCount : '99+'}
                    </span>
                )}
            </button>
        </div>
    );
};

export default ChatButton;
