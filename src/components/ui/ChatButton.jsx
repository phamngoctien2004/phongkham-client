import React from 'react';
import { Link } from 'react-router-dom';
import './ChatButton.css';

const ChatButton = ({ hasUnread }) => (
    <div className="chat-button-wrapper">
        <Link to="/chat" className="chat-button">
            <i className="bi bi-chat-dots"></i>
            {hasUnread && <span className="chat-badge" />}
        </Link>
    </div>
);

export default ChatButton;
