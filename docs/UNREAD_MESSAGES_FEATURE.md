# Tính năng Unread Messages (Tin nhắn chưa đọc)

## 📋 Mô tả
Hiển thị rõ ràng tin nhắn đã đọc và chưa đọc với dấu phân cách màu đỏ, tự động scroll đến vị trí tin nhắn chưa đọc đầu tiên khi mở conversation.

## 🎯 Cách hoạt động

### 1. **API Response Structure**
Backend trả về `lastReadId` trong response:
```json
{
  "data": {
    "messages": [...],
    "lastReadId": 18,
    "totalUnread": 5,
    "totalMessage": 23,
    "hasMoreOld": false
  }
}
```

- **lastReadId = 18**: Tin nhắn có ID 18 là tin nhắn cuối cùng đã đọc
- Tất cả tin nhắn từ ID 19 trở đi là **chưa đọc**

### 2. **Visual Indicator**
Hiển thị dấu phân cách giữa tin nhắn đã đọc và chưa đọc:

```
[Tin nhắn đã đọc - ID 18]
─────── ⚠️ TIN NHẮN CHƯA ĐỌC ───────  ← Divider màu đỏ
[Tin nhắn chưa đọc - ID 19]
[Tin nhắn chưa đọc - ID 20]
```

### 3. **Auto Scroll Behavior**

#### Khi mở conversation:
1. Kiểm tra có `lastReadId` không
2. Nếu có → Scroll đến divider "Tin nhắn chưa đọc" (block: center)
3. Nếu không → Scroll xuống cuối

#### Khi có tin nhắn mới:
1. User ở gần cuối (< 150px) → Auto scroll xuống
2. User đang xem tin nhắn cũ → Không scroll

## 🎨 UI Design

### Unread Divider
- **Màu sắc**: Đỏ (#ff3b30) - nổi bật
- **Layout**: Flexbox với 2 dòng gradient + text giữa
- **Text**: "TIN NHẮN CHƯA ĐỌC" (uppercase, bold)
- **Border**: 2px solid với shadow nhẹ
- **Animation**: Smooth scroll (behavior: 'smooth', block: 'center')

### CSS Classes
```css
.unread-divider {
  display: flex;
  align-items: center;
  margin: 16px 0;
  gap: 12px;
}

.unread-divider-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(to right, transparent, #ff3b30, transparent);
}

.unread-divider-text {
  color: #ff3b30;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  background: white;
  padding: 4px 12px;
  border-radius: 12px;
  border: 2px solid #ff3b30;
  box-shadow: 0 2px 8px rgba(255, 59, 48, 0.2);
}
```

## 🔧 Implementation

### ChatContext.jsx
```javascript
const [lastReadId, setLastReadId] = useState(null);

const loadMessages = async (conversationId) => {
  const data = await chatService.getMessages(conversationId);
  setMessages(data.messages || []);
  setLastReadId(data.lastReadId || null); // ✅ Lưu lastReadId
};
```

### MessageList.jsx
```javascript
const unreadDividerRef = useRef(null);
const hasScrolledToUnread = useRef(false);

// Auto scroll to unread when conversation loads
useEffect(() => {
  if (messages.length > 0 && lastReadId && !hasScrolledToUnread.current) {
    setTimeout(() => {
      if (unreadDividerRef.current) {
        unreadDividerRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        hasScrolledToUnread.current = true;
      }
    }, 200);
  }
}, [messages, lastReadId]);

// Check if should show unread divider
const shouldShowUnreadDivider = (currentMessage, nextMessage) => {
  if (!lastReadId || lastReadId === 0) return false;
  
  const currentId = currentMessage.id || messages.indexOf(currentMessage);
  return currentId === lastReadId && nextMessage;
};

// Render
{showUnreadDivider && (
  <div className="unread-divider" ref={unreadDividerRef}>
    <div className="unread-divider-line"></div>
    <span className="unread-divider-text">Tin nhắn chưa đọc</span>
    <div className="unread-divider-line"></div>
  </div>
)}
```

## 📊 Flow Chart

```
User click vào conversation
    ↓
Load messages API
    ↓
Nhận lastReadId = 18
    ↓
Render messages + Unread Divider (sau message 18)
    ↓
Auto scroll đến Divider (smooth, center)
    ↓
User thấy rõ: đã đọc ở trên ← DIVIDER → chưa đọc ở dưới
```

## ⚙️ Edge Cases

### Case 1: Không có tin nhắn chưa đọc
- `lastReadId = 0` hoặc `null`
- **Hành động**: Không hiển thị divider, scroll xuống cuối

### Case 2: Tất cả tin nhắn đều chưa đọc
- `lastReadId = 0`
- **Hành động**: Không hiển thị divider, scroll xuống cuối

### Case 3: Message không có ID field
- Sử dụng index làm ID fallback
- **Code**: `const currentId = message.id || messages.indexOf(message)`

### Case 4: Load more old messages
- Giữ nguyên vị trí scroll hiện tại
- Không scroll lại đến divider

## 🎯 User Experience

### Scenario 1: User vừa mở conversation
```
✅ Tự động scroll đến divider
✅ Thấy rõ phần nào đã đọc, chưa đọc
✅ Không cần scroll thủ công
```

### Scenario 2: User đang đọc tin nhắn cũ
```
✅ Có tin nhắn mới → Không auto scroll
✅ Giữ nguyên vị trí đọc
✅ User chủ động scroll xuống khi muốn
```

### Scenario 3: User ở cuối chat
```
✅ Có tin nhắn mới → Auto scroll xuống
✅ Luôn thấy tin nhắn mới nhất
✅ Smooth animation
```

## 🐛 Debugging

### Kiểm tra lastReadId
```javascript
console.log('Last Read ID:', lastReadId);
console.log('Messages:', messages.map(m => m.id || 'no-id'));
```

### Kiểm tra divider render
```javascript
const showUnreadDivider = shouldShowUnreadDivider(message, messages[index + 1]);
console.log('Show divider after message', message.id, ':', showUnreadDivider);
```

### Kiểm tra scroll behavior
```javascript
useEffect(() => {
  console.log('Scrolling to unread divider');
  if (unreadDividerRef.current) {
    console.log('Divider ref found:', unreadDividerRef.current);
  }
}, [messages, lastReadId]);
```

## 📝 Notes

- Divider chỉ hiển thị **1 lần** trong conversation
- Vị trí: Giữa tin nhắn có ID = lastReadId và tin nhắn tiếp theo
- Scroll chỉ trigger **1 lần** khi mở conversation (dùng hasScrolledToUnread flag)
- CSS gradient cho line effect đẹp hơn solid color
- Màu đỏ (#ff3b30) tương tự iOS/Messenger notification style
