import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AIChatButton.css';

const AIChatButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/ai-chat');
    };

    return (
        <div className="ai-chat-button-wrapper">
            <button
                onClick={handleClick}
                className="ai-chat-button"
                aria-label="Mở AI Chat tư vấn y tế"
                title="AI Tư vấn y tế"
            >
                <i className="bi bi-robot"></i>
            </button>
        </div>
    );
};

export default AIChatButton;
