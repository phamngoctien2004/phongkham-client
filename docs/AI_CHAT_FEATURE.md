# AI Chat Feature - Implementation Guide

## Tổng quan
Tính năng AI Chat mới được thêm vào ứng dụng với một nút AI Chat floating (nằm trên nút chat thông thường) và một trang AI Chat hoàn chỉnh không có header/footer nhưng có nút quay lại.

## Các file đã tạo/chỉnh sửa

### 1. Components mới tạo

#### `/src/components/ui/AIChatButton.jsx`
- Component nút AI Chat floating
- Sử dụng icon robot (bi-robot)
- Khi click sẽ navigate đến route `/ai-chat`
- Có animation pulse và float để thu hút sự chú ý

#### `/src/components/ui/AIChatButton.css`
- Styling cho AI Chat button
- Đặt vị trí: `bottom: 180px` (cao hơn chat button ở `bottom: 100px`)
- Gradient background: purple gradient (667eea -> 764ba2)
- Animations:
  - `pulse`: Tạo hiệu ứng nhấp nháy shadow
  - `float`: Icon robot bay lên xuống nhẹ nhàng
- Responsive cho mobile

### 2. Pages mới tạo

#### `/src/pages/AIChatPage.jsx`
- Trang AI Chat đầy đủ tính năng
- **Không có Header và Footer** - chỉ hiển thị AI Chat interface
- **Có nút quay lại** (← arrow) ở góc trái header
- Dựa trên logic từ `test-chatbot.html` với các tính năng:
  - Chat với AI backend (http://localhost:8000/api/chat)
  - Hiển thị tin nhắn với avatar (user/bot)
  - Loading animation khi AI đang trả lời
  - Hiển thị nguồn tham khảo (PDF sources)
  - Badge "Nên đặt lịch khám" khi cần
  - Sidebar hiển thị bác sĩ đề xuất
  - Chọn lịch khám (theo ngày, ca, giờ)
  - Nút đặt lịch

#### `/src/pages/AIChatPage.css`
- Styling hoàn chỉnh cho trang AI Chat
- Layout: Flexbox với main chat area và sidebar
- Responsive design cho mobile
- Custom scrollbar
- Animations cho loading dots
- Color scheme: Blue/Cyan gradient theme

### 3. Files đã chỉnh sửa

#### `/src/components/ui/index.js`
Thêm export cho AIChatButton:
```javascript
export { default as AIChatButton } from './AIChatButton';
```

#### `/src/App.jsx`
**Thay đổi chính:**

1. **Import thêm:**
   - `useLocation` từ react-router-dom
   - `AIChatButton` component
   - `AIChatPage` page

2. **ChatButtonWrapper cập nhật:**
   - Sử dụng `useLocation()` để check pathname
   - Ẩn cả 2 buttons khi ở trang `/ai-chat`
   - Hiển thị cả `AIChatButton` và `ChatButton` khi đã login

3. **Route mới:**
   ```jsx
   <Route path="/ai-chat" element={<AIChatPage />} />
   ```

## Cấu trúc Layout

### Vị trí các nút floating:
```
┌─────────────────────┐
│                     │
│                     │
│                     │
│              [🤖]   │ ← AI Chat Button (bottom: 180px)
│              [💬]   │ ← Chat Button (bottom: 100px)
└─────────────────────┘
```

### Trang AI Chat:
```
┌──────────────────────────────────────┐
│ [←] AI Tư Vấn Y Tế 🩺                │ ← Header với nút quay lại
│ ⚠️ Lưu ý: Tư vấn tham khảo...        │
├──────────────────────────────────────┤
│ Messages Area                        │
│ 🤖 Bot: Xin chào!                    │
│                          👤 User: Hi │
├──────────────────────────────────────┤
│ [Textarea] [📤 Gửi]                  │
└──────────────────────────────────────┘
```

## Tính năng chính

### 1. AI Chat Button
- ✅ Floating button với icon robot
- ✅ Animation pulse và float
- ✅ Chỉ hiển thị khi đã đăng nhập
- ✅ Ẩn khi đang ở trang AI Chat
- ✅ Navigate đến `/ai-chat` khi click

### 2. AI Chat Page
- ✅ Không có Header/Footer (standalone page)
- ✅ Nút quay lại (← arrow) để trở về trang trước
- ✅ Chat với AI backend
- ✅ Hiển thị lịch sử tin nhắn
- ✅ Loading state khi AI đang xử lý
- ✅ Hiển thị nguồn PDF tham khảo
- ✅ Sidebar bác sĩ đề xuất
- ✅ Chọn lịch khám theo ngày/ca/giờ
- ✅ Nút đặt lịch khám
- ✅ Responsive design

### 3. Integration
- ✅ Tích hợp với AuthContext (chỉ hiển thị khi login)
- ✅ Routing hoàn chỉnh
- ✅ Không xung đột với chat thông thường
- ✅ Có thể truy cập từ bất kỳ trang nào khi đã login

## API Backend

AI Chat kết nối đến backend tại:
- **Endpoint:** `http://localhost:8000/api/chat`
- **Method:** POST
- **Payload:**
  ```json
  {
    "message": "user message",
    "conversation_history": [...]
  }
  ```
- **Response:**
  ```json
  {
    "response": "AI response",
    "sources": [...],
    "needs_appointment": boolean,
    "recommended_doctors": [...]
  }
  ```

## Hướng dẫn sử dụng

1. **Đăng nhập vào ứng dụng**
2. **Thấy 2 nút floating ở góc phải:**
   - Nút AI Chat (🤖) - màu purple gradient
   - Nút Chat thông thường (💬) - màu xanh
3. **Click vào nút AI Chat (🤖)**
4. **Được chuyển đến trang AI Chat đầy đủ**
5. **Nhập triệu chứng/câu hỏi vào ô chat**
6. **AI sẽ trả lời và đề xuất bác sĩ (nếu cần)**
7. **Chọn lịch khám và đặt lịch**
8. **Click nút ← để quay lại trang trước**

## Responsive Design

### Desktop (> 768px):
- Sidebar bác sĩ hiển thị bên phải (width: 20rem)
- Chat area ở bên trái (flexible)

### Mobile (≤ 768px):
- Sidebar bác sĩ hiển thị ở dưới (height: 40vh)
- Chat area ở trên
- Layout chuyển sang column

## Icons sử dụng

- 🤖 Robot - AI Chat button
- 📤 Send - Gửi tin nhắn
- 👤 User - Avatar người dùng
- 🤖 Bot - Avatar AI
- ⚠️ Alert - Cảnh báo
- 📅 Calendar - Lịch khám
- 🩺 Stethoscope - Y tế
- ← Arrow - Quay lại

## Testing Checklist

- [ ] AI Chat button hiển thị đúng vị trí
- [ ] Click vào AI Chat button chuyển đến `/ai-chat`
- [ ] Trang AI Chat không có header/footer
- [ ] Nút quay lại hoạt động
- [ ] Chat với AI backend hoạt động
- [ ] Hiển thị tin nhắn đúng
- [ ] Loading animation hoạt động
- [ ] Sidebar bác sĩ hiển thị khi có
- [ ] Chọn lịch khám hoạt động
- [ ] Responsive trên mobile
- [ ] Buttons ẩn khi ở trang AI Chat

## Notes

- Backend phải chạy tại `http://localhost:8000`
- Cần đăng nhập để thấy AI Chat button
- AI Chat page hoàn toàn độc lập (không dùng AuthContext để check login trong page)
- Có thể truy cập trực tiếp qua URL `/ai-chat`

## Future Improvements

- [ ] Tích hợp đặt lịch thực sự với backend
- [ ] Lưu lịch sử chat
- [ ] Voice input/output
- [ ] Chia sẻ cuộc hội thoại
- [ ] Export PDF lời khuyên
