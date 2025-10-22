# Tài liệu: Chức năng Đổi Mật Khẩu

## Tổng quan
Đã triển khai chức năng đổi mật khẩu với modal dialog cho trang Profile. Khi người dùng click vào link "Đổi mật khẩu", một modal sẽ hiện lên cho phép họ thay đổi mật khẩu.

## Các file đã tạo mới

### 1. Modal Component (`src/components/ui/Modal.jsx`)
- Component modal tái sử dụng được
- Hỗ trợ nhiều kích thước: sm, md, lg, xl
- Tự động ngăn scroll body khi modal mở
- Đóng modal bằng phím ESC
- Đóng khi click vào overlay
- Animation mượt mà (fade in + slide up)

**Props:**
- `isOpen` (boolean): Trạng thái hiển thị modal
- `onClose` (function): Callback khi đóng modal
- `title` (string): Tiêu đề modal
- `children` (node): Nội dung modal
- `size` (string): Kích thước modal (sm/md/lg/xl)

### 2. Modal Styles (`src/components/ui/Modal.css`)
- Overlay với background đen mờ
- Modal content với border radius và shadow
- Animation fade in và slide up
- Responsive cho mobile
- Custom scrollbar styles

### 3. ChangePasswordModal Component (`src/components/Auth/ChangePasswordModal.jsx`)
- Form đổi mật khẩu với 3 trường:
  - Mật khẩu hiện tại
  - Mật khẩu mới
  - Xác nhận mật khẩu mới
- Toggle hiển thị/ẩn mật khẩu
- Validation form đầy đủ:
  - Kiểm tra mật khẩu hiện tại không trống
  - Mật khẩu mới tối thiểu 6 ký tự
  - Mật khẩu xác nhận phải khớp
  - Mật khẩu mới phải khác mật khẩu cũ
- Hiển thị yêu cầu mật khẩu với icon check động
- Loading state khi submit
- Toast notification cho thành công/thất bại

**Props:**
- `isOpen` (boolean): Trạng thái hiển thị modal
- `onClose` (function): Callback khi đóng modal
- `userId` (number): ID của user cần đổi mật khẩu

### 4. ChangePasswordModal Styles (`src/components/Auth/ChangePasswordModal.css`)
- Form layout với gap spacing
- Password input wrapper với toggle button
- Password requirements section với validation indicator
- Responsive button actions
- Loading spinner animation

## Các file đã chỉnh sửa

### 1. `src/services/authService.js`
Thêm method `changePassword`:
```javascript
changePassword: async (userId, oldPassword, newPassword, confirmPassword) => {
    return await apiRequest('/auth/reset-password', 'POST', {
        userId,
        oldPassword,
        password: newPassword,
        confirmPassword,
    });
}
```

### 2. `src/pages/ProfilePage.jsx`
- Import `ChangePasswordModal` component
- Thêm state `isChangePasswordModalOpen`
- Cập nhật link "Đổi mật khẩu" để mở modal
- Render `ChangePasswordModal` component với props phù hợp

### 3. `src/components/ui/index.js`
- Export Modal component để dễ import

## API Endpoint

**Endpoint:** `POST /api/auth/reset-password`

**Request Body:**
```json
{
    "userId": 1,
    "oldPassword": "mật_khẩu_cũ",
    "password": "mật_khẩu_mới",
    "confirmPassword": "mật_khẩu_mới"
}
```

## Luồng hoạt động

1. User click vào link "Đổi mật khẩu" trong trang Profile
2. Modal hiện lên với form đổi mật khẩu
3. User nhập:
   - Mật khẩu hiện tại
   - Mật khẩu mới (tối thiểu 6 ký tự)
   - Xác nhận mật khẩu mới
4. Hệ thống validate:
   - Tất cả các trường đã được điền
   - Mật khẩu mới có ít nhất 6 ký tự
   - Mật khẩu xác nhận khớp với mật khẩu mới
   - Mật khẩu mới khác mật khẩu hiện tại
5. Nếu validation thành công, gọi API `/auth/reset-password`
6. Hiển thị thông báo thành công/thất bại
7. Nếu thành công, đóng modal và reset form

## Tính năng nổi bật

✅ **UI/UX tốt:**
- Modal responsive, đẹp mắt
- Animation mượt mà
- Toggle hiển thị/ẩn mật khẩu
- Visual feedback cho validation

✅ **Validation đầy đủ:**
- Kiểm tra đầy đủ các trường
- Hiển thị yêu cầu mật khẩu real-time
- Ngăn submit khi dữ liệu không hợp lệ

✅ **User Experience:**
- Đóng modal bằng ESC
- Đóng khi click overlay
- Disable form khi đang submit
- Loading state rõ ràng
- Toast notification

✅ **Code Quality:**
- Component tái sử dụng
- PropTypes validation
- Clean code structure
- Separation of concerns

## Cách sử dụng

Để sử dụng Modal component ở nơi khác:

```jsx
import Modal from '../components/ui/Modal';

<Modal 
    isOpen={isOpen} 
    onClose={handleClose} 
    title="Tiêu đề"
    size="md"
>
    {/* Nội dung modal */}
</Modal>
```

## Testing

Để test chức năng:
1. Chạy `npm run dev`
2. Đăng nhập vào hệ thống
3. Vào trang Profile
4. Click vào "Đổi mật khẩu"
5. Nhập thông tin và submit

## Lưu ý

- Modal component có thể tái sử dụng cho các tính năng khác
- Validation có thể tùy chỉnh theo yêu cầu (thêm regex, độ dài, ...)
- API endpoint cần được cấu hình đúng trong `src/services/api.js`
- Component sử dụng `sonner` để hiển thị toast notification
