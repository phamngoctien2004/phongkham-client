import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow = () => {
    const { activeConversation, wsConnected } = useChat();
    const { user } = useAuth();

    const getConversationTitle = () => {
        if (!activeConversation) return '';

        // Lấy user từ localStorage để check role
        const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');

        // Nếu role là BENH_NHAN thì hiển thị "Nhân viên tư vấn"
        // Nếu là lễ tân hoặc role khác thì hiển thị patientName
        if (userFromStorage?.role === 'BENH_NHAN') {
            return 'Nhân viên tư vấn';
        }
        return activeConversation.patientName || 'Nhân viên tư vấn';
    };

    if (!activeConversation) {
        return (
            <div className="chat-window-empty">
                <div className="empty-state">
                    <i className="bi bi-chat-square-text"></i>
                    <h3>Chào mừng đến với Chat</h3>
                    <p>Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="chat-header-info">
                    <div className="chat-avatar">
                        <div className="avatar-circle">
                            <i className="bi bi-person-fill"></i>
                        </div>
                        {wsConnected && <span className="online-indicator-header"></span>}
                    </div>
                    <div className="chat-header-text">
                        <h3>{getConversationTitle()}</h3>
                        <span className="status-text">
                            {wsConnected ? 'Đang hoạt động' : 'Không trực tuyến'}
                        </span>
                    </div>
                </div>
                <div className="chat-header-actions">
                    <button className="header-action-btn" title="Thông tin">
                        <i className="bi bi-info-circle"></i>
                    </button>
                </div>
            </div>

            <MessageList />

            <MessageInput />
        </div>
    );
};

export default ChatWindow;
