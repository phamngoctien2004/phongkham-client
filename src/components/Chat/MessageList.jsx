import { useEffect, useRef, useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';

const MessageList = () => {
    const { messages, lastReadId, hasMoreOld, loadMoreOldMessages, activeConversation } = useChat();
    const { user } = useAuth();
    const messageListRef = useRef(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [showUnreadDivider, setShowUnreadDivider] = useState(true);
    const lastMessageRef = useRef(null);
    const unreadDividerRef = useRef(null);
    const prevMessagesLengthRef = useRef(0);
    const hasScrolledToUnread = useRef(false);
    const isLoadingOldMessagesRef = useRef(false); // Track if we're loading old messages
    const hideDividerTimeoutRef = useRef(null);
    const dividerShownOnceRef = useRef(false); // Track if divider was shown at least once

    // Handle load more button click
    const handleLoadMore = async () => {
        console.log('[Button Click] hasMoreOld:', hasMoreOld, 'isLoadingMore:', isLoadingMore, 'activeConversation:', activeConversation?.id);

        if (!hasMoreOld || isLoadingMore || !activeConversation) {
            console.log('[Button Click] Blocked - conditions not met');
            return;
        }

        setIsLoadingMore(true);
        isLoadingOldMessagesRef.current = true; // Mark that we're loading old messages
        console.log('[Button Click] Starting load more...');

        const container = messageListRef.current;
        const previousScrollHeight = container?.scrollHeight || 0;
        const previousScrollTop = container?.scrollTop || 0;

        try {
            console.log('[Button Click] Calling loadMoreOldMessages for conversation:', activeConversation.id);
            await loadMoreOldMessages(activeConversation.id);
            console.log('[Button Click] loadMoreOldMessages completed');

            // Maintain scroll position after loading
            // When new messages are added at the top, we need to adjust scroll
            // to keep the user viewing the same messages
            requestAnimationFrame(() => {
                if (container) {
                    const newScrollHeight = container.scrollHeight;
                    const scrollDiff = newScrollHeight - previousScrollHeight;
                    // Add the height difference to current scroll position
                    container.scrollTop = previousScrollTop + scrollDiff;
                    console.log('[Button Click] Scroll adjusted. Previous scrollTop:', previousScrollTop,
                        'Previous height:', previousScrollHeight,
                        'New height:', newScrollHeight, 'Diff:', scrollDiff,
                        'New scrollTop:', container.scrollTop);
                }

                // Reset flag after scroll adjustment is complete
                setTimeout(() => {
                    isLoadingOldMessagesRef.current = false;
                }, 100);
            });
        } catch (error) {
            console.error('[Button Click] Error:', error);
        } finally {
            setIsLoadingMore(false);
            console.log('[Button Click] Finished loading');
        }
    };

    // Auto scroll to unread divider when conversation first loads
    useEffect(() => {
        // Chỉ hiển thị divider nếu chưa từng hiển thị lần nào
        if (messages.length > 0 && lastReadId && !hasScrolledToUnread.current && !dividerShownOnceRef.current) {
            // Scroll to unread divider after a short delay to ensure DOM is ready
            setTimeout(() => {
                if (unreadDividerRef.current) {
                    unreadDividerRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    hasScrolledToUnread.current = true;
                    dividerShownOnceRef.current = true; // Đánh dấu đã hiển thị

                    console.log('[Unread Divider] Shown for the first time');

                    // Tự động ẩn divider sau 3 giây
                    hideDividerTimeoutRef.current = setTimeout(() => {
                        console.log('[Unread Divider] Auto-hiding after 3 seconds');
                        setShowUnreadDivider(false);
                    }, 3000); // 3 giây
                }
            }, 200);
        }

        // Cleanup timeout khi component unmount hoặc conversation thay đổi
        return () => {
            if (hideDividerTimeoutRef.current) {
                clearTimeout(hideDividerTimeoutRef.current);
            }
        };
    }, [messages, lastReadId]);

    // Auto scroll to bottom when new message arrives
    useEffect(() => {
        // Don't auto-scroll if we're loading old messages
        if (isLoadingOldMessagesRef.current) {
            console.log('[Auto Scroll] Skipped - loading old messages');
            prevMessagesLengthRef.current = messages.length;
            return;
        }

        // Scroll to bottom if:
        // 1. New message added (length increased)
        // 2. User is near bottom (within 150px)
        if (messages.length > prevMessagesLengthRef.current) {
            console.log('[Auto Scroll] Messages increased from', prevMessagesLengthRef.current, 'to', messages.length);
            const container = messageListRef.current;
            if (container) {
                const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;

                console.log('[Auto Scroll] isNearBottom:', isNearBottom, 'prevLength:', prevMessagesLengthRef.current);

                if (isNearBottom || prevMessagesLengthRef.current === 0) {
                    console.log('[Auto Scroll] Scrolling to bottom');
                    // Scroll to bottom with smooth behavior
                    setTimeout(() => {
                        if (lastMessageRef.current) {
                            lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
                        }
                    }, 100);
                } else {
                    console.log('[Auto Scroll] Skipped - not near bottom');
                }
            }
        }
        prevMessagesLengthRef.current = messages.length;
    }, [messages]);

    // Initial scroll to bottom when conversation changes
    useEffect(() => {
        prevMessagesLengthRef.current = 0;
        hasScrolledToUnread.current = false;
        isLoadingOldMessagesRef.current = false; // Reset loading flag
        setIsLoadingMore(false); // Reset loading state
        setShowUnreadDivider(true); // Reset divider visibility
        dividerShownOnceRef.current = false; // Reset divider shown flag

        // Clear any existing timeout
        if (hideDividerTimeoutRef.current) {
            clearTimeout(hideDividerTimeoutRef.current);
        }

        console.log('[Conversation Changed] Reset all divider states');

        // If no unread messages, scroll to bottom immediately
        if (!lastReadId || lastReadId === 0) {
            setTimeout(() => {
                if (lastMessageRef.current) {
                    lastMessageRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
                }
            }, 100);
        }
    }, [activeConversation, lastReadId]);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Hôm nay';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Hôm qua';
        }
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const shouldShowDateDivider = (currentMessage, previousMessage) => {
        if (!previousMessage) return true;

        const currentDate = new Date(currentMessage.sentTime).toDateString();
        const previousDate = new Date(previousMessage.sentTime).toDateString();

        return currentDate !== previousDate;
    };

    const isMyMessage = (message) => {
        return message.senderId === user?.id;
    };

    // Check if should show unread divider before this message
    const shouldShowUnreadDividerBefore = (currentMessage, previousMessage) => {
        if (!lastReadId || lastReadId === 0) return false;

        const currentId = currentMessage.id;

        // Show divider if:
        // 1. Current message is the first unread (id > lastReadId)
        // 2. Previous message is the last read (id === lastReadId) OR no previous message
        if (currentId > lastReadId) {
            if (!previousMessage) return true; // First message and it's unread
            return previousMessage.id <= lastReadId; // Previous is read, current is unread
        }

        return false;
    };

    if (!activeConversation) {
        return (
            <div className="message-list-empty">
                <i className="bi bi-chat-dots"></i>
                <p>Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
        );
    }

    return (
        <div className="message-list" ref={messageListRef}>
            {hasMoreOld && (
                <div className="load-more-container">
                    <button
                        className="load-more-button"
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                    >
                        {isLoadingMore ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Đang tải...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-arrow-up-circle me-2"></i>
                                Xem thêm tin nhắn cũ hơn
                            </>
                        )}
                    </button>
                </div>
            )}

            {messages.map((message, index) => {
                const showDate = shouldShowDateDivider(message, messages[index - 1]);
                const isMine = isMyMessage(message);
                const showUnreadDividerBefore = shouldShowUnreadDividerBefore(message, messages[index - 1]);

                return (
                    <div key={message.id || index}>
                        {showDate && (
                            <div className="date-divider">
                                <span>{formatDate(message.sentTime)}</span>
                            </div>
                        )}

                        {showUnreadDividerBefore && showUnreadDivider && (
                            <div className="unread-divider" ref={unreadDividerRef}>
                                <div className="unread-divider-line"></div>
                                <span className="unread-divider-text">Tin nhắn chưa đọc</span>
                                <div className="unread-divider-line"></div>
                            </div>
                        )}

                        <div className={`message-wrapper ${isMine ? 'mine' : 'theirs'}`}>
                            {!isMine && (
                                <div className="message-avatar">
                                    <div className="avatar-circle-small">
                                        <i className="bi bi-person-fill"></i>
                                    </div>
                                </div>
                            )}

                            <div className="message-content">
                                {message.urls && message.urls.length > 0 && (
                                    <div className="message-images">
                                        {message.urls.map((url, idx) => (
                                            <img
                                                key={idx}
                                                src={url}
                                                alt="attachment"
                                                className="message-image"
                                                onClick={() => window.open(url, '_blank')}
                                            />
                                        ))}
                                    </div>
                                )}
                                {message.message && (
                                    <div className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}>
                                        <div className="message-text">{message.message}</div>
                                    </div>
                                )}
                                <div className="message-time">{formatTime(message.sentTime)}</div>
                            </div>
                        </div>
                    </div>
                );
            })}

            <div ref={lastMessageRef} />
        </div>
    );
};

export default MessageList;
