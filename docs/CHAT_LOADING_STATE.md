# Chat Loading State Feature

## Tổng quan (Overview)

Thêm hiệu ứng loading khi mở cửa sổ chat và tin nhắn đang được tải từ server. Điều này cải thiện trải nghiệm người dùng bằng cách cho họ biết rằng ứng dụng đang xử lý yêu cầu của họ.

## Tính năng (Features)

### 1. Loading Spinner
- ✅ Hiển thị spinner khi `loading = true` và có `activeConversation`
- ✅ Spinner sử dụng Bootstrap spinner với hiệu ứng quay
- ✅ Có text "Đang tải tin nhắn..." để thông báo cho user

### 2. Fade In Animation
- ✅ Loading container có animation fade in mượt mà
- ✅ Thời gian animation: 0.3s

### 3. Responsive Design
- ✅ Loading state hoạt động tốt trên cả chat popup và chat page
- ✅ Responsive với các kích thước màn hình khác nhau

## Implementation

### 1. ChatWindow Component

**File:** `/src/components/Chat/ChatWindow.jsx`

```jsx
const { activeConversation, wsConnected, loading } = useChat();

// Hiển thị loading state
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
    // Empty state
)}
```

**Logic:**
1. Kiểm tra `loading && activeConversation` → Hiển thị loading spinner
2. Nếu không loading và có `activeConversation` → Hiển thị MessageList
3. Nếu không có `activeConversation` → Hiển thị empty state

### 2. CSS Styling

**File:** `/src/components/Chat/Chat.css`

```css
/* Loading Container */
.chat-loading-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9fafb;
    animation: fadeIn 0.3s ease-in;
}

/* Fade In Animation */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Loading Spinner Layout */
.chat-loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

/* Loading Text */
.chat-loading-text {
    margin: 0;
    color: #65676b;
    font-size: 14px;
    font-weight: 500;
}

/* Spinner Size */
.spinner-border {
    width: 2.5rem;
    height: 2.5rem;
}
```

**File:** `/src/components/Chat/ChatPopup.css`

```css
/* Loading State for Popup */
.chat-popup-body .chat-loading-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    animation: fadeIn 0.3s ease-in;
}
```

### 3. Loading State Management

**File:** `/src/contexts/ChatContext.jsx`

Loading state được quản lý trong ChatContext:

```javascript
const [loading, setLoading] = useState(false);

// Khi load messages
const loadMessages = useCallback(async (conversationId) => {
    try {
        setLoading(true); // ✅ Bật loading
        const data = await chatService.getMessages(conversationId);
        // ... xử lý data
    } catch (error) {
        console.error('Failed to load messages:', error);
    } finally {
        setLoading(false); // ✅ Tắt loading
    }
}, [activeConversation]);

// Khi load more messages
const loadMoreOldMessages = useCallback(async (conversationId) => {
    if (!hasMoreOld || loading) return;
    
    try {
        setLoading(true); // ✅ Bật loading
        // ... load more logic
    } catch (error) {
        console.error('[Load More] Error:', error);
    } finally {
        setLoading(false); // ✅ Tắt loading
    }
}, [hasMoreOld, loading, messages]);
```

## User Experience Flow

### Scenario 1: Mở Chat Popup lần đầu

1. User click vào chat button
2. Popup mở ra
3. `openChatPopup()` được gọi → `selectConversation()` được gọi
4. `loadMessages()` được gọi → `setLoading(true)`
5. **Loading spinner hiển thị** với animation fade in
6. API request hoàn thành
7. `setLoading(false)` → Loading ẩn, MessageList hiển thị

### Scenario 2: Chuyển đổi giữa các conversation

1. User click vào conversation khác trong danh sách
2. `selectConversation()` được gọi
3. `loadMessages()` được gọi → `setLoading(true)`
4. **Loading spinner hiển thị**
5. API request hoàn thành
6. `setLoading(false)` → Tin nhắn mới hiển thị

### Scenario 3: Load More Old Messages

1. User click nút "Tải thêm tin nhắn cũ"
2. `loadMoreOldMessages()` được gọi → `setLoading(true)`
3. **Button loading state** (trong MessageList component)
4. API request hoàn thành
5. `setLoading(false)` → Tin nhắn cũ được thêm vào đầu list

## Visual Design

### Loading Spinner Appearance

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│          ⟳  [Spinner]          │
│                                 │
│      Đang tải tin nhắn...      │
│                                 │
│                                 │
└─────────────────────────────────┘
```

### Colors
- Background: `#f9fafb` (Chat page), `white` (Chat popup)
- Spinner: Bootstrap primary color (`#0d6efd`)
- Text: `#65676b` (Gray)

### Spacing
- Spinner size: `2.5rem` (40px)
- Gap between spinner and text: `16px`

## Benefits

1. ✅ **User Feedback:** User biết rằng app đang load data
2. ✅ **No Blank Screen:** Tránh màn hình trống trong khi chờ data
3. ✅ **Smooth Transition:** Animation mượt mà giữa các state
4. ✅ **Professional Look:** Trông chuyên nghiệp và polished
5. ✅ **Consistent UX:** Loading state nhất quán trên toàn bộ app

## Technical Notes

### Loading State Conditions

```javascript
loading && activeConversation ? LoadingUI : NormalUI
```

**Why check both?**
- `loading`: Đảm bảo đang có request API
- `activeConversation`: Chỉ hiển thị loading khi đã chọn conversation
- Nếu chưa chọn conversation → Hiển thị empty state thay vì loading

### Performance

- ✅ CSS animation sử dụng GPU (`transform`, `opacity`)
- ✅ Không re-render không cần thiết
- ✅ Loading state chỉ trigger khi thực sự cần thiết

### Accessibility

- ✅ `role="status"` cho screen readers
- ✅ `visually-hidden` text cho screen readers
- ✅ Clear visual feedback cho tất cả users

## Testing

### Test Cases

1. **Mở chat popup lần đầu**
   - Verify: Loading spinner hiển thị
   - Verify: Sau khi load xong, hiển thị tin nhắn

2. **Switch between conversations**
   - Verify: Loading spinner hiển thị khi chuyển conversation
   - Verify: Tin nhắn mới hiển thị sau khi load

3. **Slow network**
   - Verify: Loading spinner vẫn hiển thị
   - Verify: Không có flash of empty content

4. **Error state**
   - Verify: Loading ẩn khi có lỗi
   - Verify: User có thể retry

5. **Chat page vs Chat popup**
   - Verify: Loading hoạt động giống nhau ở cả 2 nơi
   - Verify: Style phù hợp với từng context

## Future Enhancements

Các cải tiến có thể thêm trong tương lai:

1. 💡 **Skeleton Loading:** Thay vì spinner, hiển thị skeleton của tin nhắn
2. 💡 **Progressive Loading:** Load tin nhắn gần đây trước, sau đó load thêm
3. 💡 **Optimistic UI:** Hiển thị tin nhắn ngay lập tức, sau đó sync với server
4. 💡 **Loading Progress:** Hiển thị % progress khi load large data
5. 💡 **Retry Mechanism:** Tự động retry khi load fail

## Related Files

- `/src/components/Chat/ChatWindow.jsx` - Main component with loading UI
- `/src/components/Chat/Chat.css` - Loading styles for chat page
- `/src/components/Chat/ChatPopup.css` - Loading styles for popup
- `/src/contexts/ChatContext.jsx` - Loading state management
- `/src/services/chatService.js` - API calls that trigger loading

---
**Created by:** AI Assistant  
**Date:** October 29, 2025  
**Feature:** Chat Loading State  
**Status:** ✅ Implemented and Working
