import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import './Chat.css';

const ChatContent = () => {
    return (
        <div className="chat-page-content">
            <div className="chat-container">
                <ConversationList />
                <ChatWindow />
            </div>
        </div>
    );
};

export default ChatContent;
