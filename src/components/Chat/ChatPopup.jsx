import { useChat } from '../../contexts/ChatContext';
import ChatWindow from './ChatWindow';
import './ChatPopup.css';

const ChatPopup = () => {
    const { isChatPopupOpen, closeChatPopup, activeConversation } = useChat();

    if (!isChatPopupOpen) return null;

    return (
        <div className="chat-popup-container">
            <div className="chat-popup-window">
                <div className="chat-popup-header">
                    <h3>
                        <i className="bi bi-person-circle me-2"></i>
                        {activeConversation?.patientName || 'Chat'}
                    </h3>
                    <div className="chat-popup-header-actions">
                        <button
                            className="chat-popup-action-btn"
                            title="Thu nhỏ"
                            onClick={closeChatPopup}
                        >
                            <i className="bi bi-dash-lg"></i>
                        </button>
                        <button
                            className="chat-popup-action-btn"
                            onClick={closeChatPopup}
                            title="Đóng"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                </div>
                <div className="chat-popup-body">
                    <ChatWindow />
                </div>
            </div>
        </div>
    );
};

export default ChatPopup;
