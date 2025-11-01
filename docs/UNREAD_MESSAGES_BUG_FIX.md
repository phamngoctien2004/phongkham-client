# Bug Fix: Unread Message Notification Not Working After Closing Chat

## Vấn đề (Problem)

Sau khi đóng cửa sổ chat và nhận tin nhắn mới từ người khác, icon báo tin nhắn mới (notification badge) ở nút chat không hiển thị.

### Log quan sát được:
```
[WebSocket] ✅ Received chat message from: /topic/chat/23
[WebSocket] Chat message: {id: 499, conversationId: 23, senderId: 3, ...}
[ChatButtonWrapper] conversations: [{…}]
[ChatButtonWrapper] hasUnread: false unreadCount: 0  // ❌ Sai! Phải là true
[ChatButton] hasUnread: false unreadCount: 0 isOpen: false
```

## Nguyên nhân (Root Cause)

### Stale Closure Problem

1. **WebSocket subscription được tạo một lần** khi component mount hoặc khi có conversation mới
2. **Callback `handleNewMessage`** được đăng ký với subscription sử dụng **closure** chứa giá trị state tại thời điểm đó
3. Khi user đóng chat popup, `isChatPopupOpen` thay đổi từ `true` → `false`
4. Tuy nhiên, **callback đã đăng ký vẫn giữ giá trị cũ** (`isChatPopupOpen = true`) vì:
   - WebSocket service skip re-subscription nếu đã subscribe rồi:
   ```javascript
   if (this.subscriptions.has(subscriptionKey)) {
       console.log(`Already subscribed to conversation ${conversationId}, skipping...`);
       return this.subscriptions.get(subscriptionKey);
   }
   ```
   - Callback cũ vẫn chạy với state cũ (stale closure)

5. Khi tin nhắn mới đến, callback kiểm tra:
   ```javascript
   const isChatVisible = isChatPopupOpen || isChatOpen; // ❌ Vẫn là true (stale)
   const shouldMarkAsNew = isNotMyMessage && (!isActiveConversation || !isChatVisible);
   ```
   → `shouldMarkAsNew = false` (sai!) vì `isChatVisible = true` (giá trị cũ)

## Giải pháp (Solution)

Sử dụng **React useRef** để lưu trữ state hiện tại mà không tạo dependency mới:

### 1. Tạo ref để lưu state hiện tại

```javascript
// Sử dụng ref để lưu trữ giá trị mới nhất của state mà không trigger re-subscribe
const chatStateRef = useRef({
    activeConversation: null,
    isChatPopupOpen: false,
    isChatOpen: false,
    userId: null
});

// Cập nhật ref mỗi khi state thay đổi
useEffect(() => {
    chatStateRef.current = {
        activeConversation,
        isChatPopupOpen,
        isChatOpen,
        userId: user?.id
    };
}, [activeConversation, isChatPopupOpen, isChatOpen, user]);
```

### 2. Sử dụng ref trong callback thay vì closure

```javascript
const handleNewMessage = useCallback((message) => {
    // Lấy giá trị mới nhất từ ref (không bị stale)
    const currentState = chatStateRef.current;

    // Sử dụng currentState thay vì state trực tiếp
    const isNotMyMessage = message.senderId !== currentState.userId;
    const isActiveConversation = currentState.activeConversation?.id === message.conversationId;
    const isChatVisible = currentState.isChatPopupOpen || currentState.isChatOpen;
    
    const shouldMarkAsNew = isNotMyMessage && (!isActiveConversation || !isChatVisible);
    
    // ...
}, []); // ✅ Không dependencies nữa vì dùng ref
```

## Lợi ích của giải pháp (Benefits)

1. ✅ **Callback luôn có state mới nhất** qua ref
2. ✅ **Không cần re-subscribe** WebSocket khi state thay đổi
3. ✅ **Performance tốt hơn** - ít re-render và re-subscription
4. ✅ **Logic đơn giản hơn** - không phải quản lý unsubscribe/resubscribe

## Kết quả (Result)

Sau khi fix:
- ✅ Đóng chat popup → `isChatPopupOpen = false`
- ✅ Nhận tin nhắn mới → callback đọc được giá trị mới `isChatPopupOpen = false`
- ✅ `shouldMarkAsNew = true` (đúng!)
- ✅ Badge notification hiển thị ở ChatButton
- ✅ `hasUnread = true, unreadCount = 1`

## Testing

Để test fix này:

1. Đăng nhập vào ứng dụng
2. Mở chat popup và chọn một cuộc hội thoại
3. **Đóng chat popup**
4. Từ thiết bị khác hoặc account khác, gửi tin nhắn mới vào conversation đó
5. Quan sát: Icon chat phải hiển thị badge notification (chấm đỏ)

## Related Files

- `/src/contexts/ChatContext.jsx` - Main fix
- `/src/services/websocketService.js` - WebSocket subscription logic
- `/src/components/ui/ChatButton.jsx` - UI component hiển thị badge
- `/src/App.jsx` - ChatButtonWrapper logic

## Technical Notes

### React Closure Issue
- React closures capture values at the time of creation
- useCallback with dependencies will recreate function when deps change
- But WebSocket subscription doesn't know about the new function
- Solution: Use ref which is mutable and always has latest value

### Alternative Solutions Considered
1. ❌ Re-subscribe on every state change - Too expensive, causes flickering
2. ❌ Use global event emitter - Adds complexity
3. ✅ **Use ref pattern** - Simple, performant, idiomatic React

---
**Fixed by:** AI Assistant
**Date:** October 29, 2025
**Issue:** Stale closure in WebSocket callback
**Solution:** React useRef pattern
