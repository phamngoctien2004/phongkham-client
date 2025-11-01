import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow = () => {
    const { activeConversation, wsConnected, loading } = useChat();
    const { user } = useAuth();

    const getConversationTitle = () => {
        if (!activeConversation) {
            // Nếu chưa có conversation, hiển thị tiêu đề mặc định
            const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
            return userFromStorage?.role === 'BENH_NHAN' ? 'Nhân viên tư vấn' : 'Chat';
        }

        // Lấy user từ localStorage để check role
        const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');

        // Nếu role là BENH_NHAN thì hiển thị "Nhân viên tư vấn"
        // Nếu là lễ tân hoặc role khác thì hiển thị patientName
        if (userFromStorage?.role === 'BENH_NHAN') {
            return 'Nhân viên tư vấn';
        }
        return activeConversation.patientName || 'Nhân viên tư vấn';
    };

    // Luôn hiển thị chat window, ngay cả khi chưa có conversation
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

            {loading && activeConversation ? (
                <div className="chat-loading-container">
                    <div className="chat-loading-spinner">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="chat-loading-text">Đang tải tin nhắn...</p>
                    </div>
                </div>
            ) : activeConversation ? (
                <MessageList />
            ) : (
                <div className="message-list" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#65676b',
                    fontSize: '14px'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <i className="bi bi-chat-dots" style={{ fontSize: '48px', marginBottom: '12px', display: 'block' }}></i>
                        <p>Bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn</p>
                    </div>
                </div>
            )}

            <MessageInput />
        </div>
    );
};

export default ChatWindow;
