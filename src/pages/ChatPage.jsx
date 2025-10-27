import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChatPage as ChatContent } from '../components/Chat';
import { useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';

const ChatPage = () => {
    const { setIsChatOpen } = useChat();
    useEffect(() => {
        setIsChatOpen(true);
        return () => setIsChatOpen(false);
    }, [setIsChatOpen]);
    return (
        <>
            <Header />
            <main style={{ minHeight: 'calc(100vh - 80px - 200px)' }}>
                <ChatContent />
            </main>
            <Footer />
        </>
    );
};

export default ChatPage;
