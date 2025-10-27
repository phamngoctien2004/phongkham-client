import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import chatService from '../services/chatService';
import websocketService from '../services/websocketService';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [lastReadId, setLastReadId] = useState(null);
    const [hasMoreOld, setHasMoreOld] = useState(false);
    const [loading, setLoading] = useState(false);
    const [wsConnected, setWsConnected] = useState(false);
    // Theo dõi trạng thái chat room đang mở
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Kết nối WebSocket khi có user
    useEffect(() => {
        if (user) {
            websocketService.connect(
                () => {
                    console.log('Chat WebSocket connected');
                    setWsConnected(true);
                },
                (error) => {
                    console.error('Chat WebSocket error:', error);
                    setWsConnected(false);
                }
            );
        }

        return () => {
            if (activeConversation) {
                websocketService.unsubscribeFromChatConversation(activeConversation.id);
            }
        };
    }, [user]);

    // Load danh sách conversations
    const loadConversations = useCallback(async () => {
        try {
            setLoading(true);
            const data = await chatService.getConversations();
            setConversations(data);
        } catch (error) {
            console.error('Failed to load conversations:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load messages của một conversation
    const loadMessages = useCallback(async (conversationId) => {
        try {
            setLoading(true);
            const data = await chatService.getMessages(conversationId);
            setMessages(data.messages || []);
            setLastReadId(data.lastReadId || null);
            setHasMoreOld(data.hasMoreOld || false);

            // Subscribe to this conversation
            if (activeConversation?.id !== conversationId) {
                // Unsubscribe from old conversation
                if (activeConversation) {
                    websocketService.unsubscribeFromChatConversation(activeConversation.id);
                }

                // Subscribe to new conversation
                websocketService.subscribeToChatConversation(conversationId, handleNewMessage);
            }
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setLoading(false);
        }
    }, [activeConversation]);

    // Load more old messages
    const loadMoreOldMessages = useCallback(async (conversationId) => {
        if (!hasMoreOld) {
            console.log('[Load More] Blocked: hasMoreOld is false');
            return;
        }

        if (loading) {
            console.log('[Load More] Blocked: already loading');
            return;
        }

        try {
            setLoading(true);

            // Kiểm tra thứ tự messages hiện tại
            const firstMsg = messages[0];
            const lastMsg = messages[messages.length - 1];

            console.log('[Load More] Current messages count:', messages.length);
            console.log('[Load More] First message:', { id: firstMsg?.id, time: firstMsg?.sentTime });
            console.log('[Load More] Last message:', { id: lastMsg?.id, time: lastMsg?.sentTime });

            // Xác định tin nhắn cũ nhất dựa vào ID
            // ID nhỏ hơn = tin nhắn cũ hơn
            const allIds = messages.map(m => m.id).filter(id => id);
            const minId = Math.min(...allIds);
            const maxId = Math.max(...allIds);
            const oldestMessage = messages.find(m => m.id === minId);

            console.log('[Load More] Min ID (oldest):', minId);
            console.log('[Load More] Max ID (newest):', maxId);
            console.log('[Load More] Position of oldest message:', messages.indexOf(oldestMessage));

            if (!oldestMessage || !oldestMessage.id) {
                console.log('[Load More] No oldest message found');
                setLoading(false);
                return;
            }

            const beforeId = oldestMessage.id;

            console.log('[Load More] Loading messages before ID:', beforeId);

            const data = await chatService.loadMoreMessages(conversationId, beforeId);

            console.log('[Load More] ===== API RESPONSE =====');
            console.log('[Load More] Total messages from API:', data.messages?.length);

            if (data.messages && data.messages.length > 0) {
                const firstApiMsg = data.messages[0];
                const lastApiMsg = data.messages[data.messages.length - 1];
                const apiIds = data.messages.map(m => m.id);

                console.log('[Load More] API First message:', { id: firstApiMsg?.id, time: firstApiMsg?.sentTime });
                console.log('[Load More] API Last message:', { id: lastApiMsg?.id, time: lastApiMsg?.sentTime });
                console.log('[Load More] API Message IDs:', apiIds);
                console.log('[Load More] API Min ID:', Math.min(...apiIds));
                console.log('[Load More] API Max ID:', Math.max(...apiIds));
            }

            console.log('[Load More] ===== FILTERING =====');

            // Kiểm tra duplicate trước khi thêm vào (dùng id field)
            // Lọc: 1) ID phải < beforeId (backend có thể trả sai), 2) Chưa tồn tại
            const existingIds = new Set(messages.map(m => m.id).filter(id => id));

            console.log('[Load More] beforeId:', beforeId);
            console.log('[Load More] Existing IDs count:', existingIds.size);
            console.log('[Load More] Existing IDs:', Array.from(existingIds).sort((a, b) => a - b));

            const messagesLessThanBeforeId = (data.messages || []).filter(m => m.id && m.id < beforeId);
            const duplicates = messagesLessThanBeforeId.filter(m => existingIds.has(m.id));
            const newMessages = messagesLessThanBeforeId.filter(m => !existingIds.has(m.id));

            console.log('[Load More] Messages with ID < beforeId:', messagesLessThanBeforeId.length);
            console.log('[Load More] Duplicates found:', duplicates.length, duplicates.map(m => m.id));
            console.log('[Load More] New messages:', newMessages.length);
            console.log('[Load More] New message IDs:', newMessages.map(m => m.id).sort((a, b) => a - b));

            if (newMessages.length > 0) {
                console.log('[Load More] ===== ADDING TO STATE =====');
                console.log('[Load More] Adding', newMessages.length, 'messages to the beginning');
                setMessages((prev) => {
                    const updated = [...newMessages, ...prev];
                    console.log('[Load More] New total count:', updated.length);
                    console.log('[Load More] New first message ID:', updated[0]?.id);
                    console.log('[Load More] New last message ID:', updated[updated.length - 1]?.id);
                    return updated;
                });
            } else {
                console.log('[Load More] ⚠️ No new messages to add!');
            }

            console.log('[Load More] hasMoreOld from API:', data.hasMoreOld);
            console.log('[Load More] totalMessage from API:', data.totalMessage);

            // Cập nhật hasMoreOld dựa trên response từ backend
            // Backend sẽ tự kiểm tra còn tin nhắn cũ hơn không
            setHasMoreOld(data.hasMoreOld || false);
            console.log('[Load More] Updated hasMoreOld to:', data.hasMoreOld || false);
        } catch (error) {
            console.error('Failed to load more messages:', error);
        } finally {
            setLoading(false);
        }
    }, [messages, hasMoreOld, loading]);

    // Handle incoming message from WebSocket
    const handleNewMessage = useCallback((message) => {
        setMessages((prev) => [...prev, message]);

        // Update last message in conversations list
        setConversations((prev) =>
            prev.map((conv) => {
                if (conv.id === message.conversationId) {
                    // Set newMessage = true nếu:
                    // 1. Tin nhắn không phải của mình
                    // 2. Conversation không đang được mở
                    const isNotMyMessage = message.senderId !== user?.id;
                    const isNotActiveConversation = activeConversation?.id !== message.conversationId;
                    const shouldMarkAsNew = isNotMyMessage && isNotActiveConversation;

                    console.log('[New Message] Conversation:', conv.id,
                        'isNotMyMessage:', isNotMyMessage,
                        'isNotActive:', isNotActiveConversation,
                        'markAsNew:', shouldMarkAsNew);

                    return {
                        ...conv,
                        lastMessage: message.message,
                        lastMessageTime: message.sentTime,
                        newMessage: shouldMarkAsNew ? true : conv.newMessage
                    };
                }
                return conv;
            })
        );
    }, [user, activeConversation]);

    // Send message
    const sendMessage = useCallback(async (messageText, urls = []) => {
        if (!activeConversation || !user) return;

        const messageDTO = {
            conversationId: parseInt(activeConversation.id),
            senderId: user.id,
            message: messageText,
            sentTime: new Date().toISOString(),
            urls: urls,
        };

        try {
            websocketService.sendChatMessage(messageDTO);
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    }, [activeConversation, user]);

    // Select active conversation
    const selectConversation = useCallback((conversation) => {
        setActiveConversation(conversation);
        if (conversation) {
            loadMessages(conversation.id);

            // Xóa badge "Mới" khi người dùng bấm vào conversation
            if (conversation.newMessage) {
                console.log('[Conversation] Marking as read:', conversation.id);
                setConversations((prev) =>
                    prev.map((conv) =>
                        conv.id === conversation.id
                            ? { ...conv, newMessage: false }
                            : conv
                    )
                );
            }
        } else {
            setMessages([]);
        }
    }, [loadMessages]);

    const value = {
        conversations,
        activeConversation,
        messages,
        lastReadId,
        hasMoreOld,
        loading,
        wsConnected,
        loadConversations,
        loadMessages,
        loadMoreOldMessages,
        sendMessage,
        selectConversation,
        isChatOpen,
        setIsChatOpen,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within ChatProvider');
    }
    return context;
};
