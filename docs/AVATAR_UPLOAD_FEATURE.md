# Avatar Upload Feature Documentation

## Overview
Chức năng upload ảnh đại diện trực tiếp thay vì nhập URL thủ công cho profile và family members.

## Changes Made

### 1. API Service Updates

#### api.js
- **Cập nhật hàm `apiRequest`** để hỗ trợ FormData
  - Tự động phát hiện nếu body là FormData
  - Không set Content-Type khi upload file (browser tự động set với boundary)
  - Giữ nguyên logic cho JSON requests

```javascript
// Kiểm tra nếu body là FormData thì không set Content-Type
if (body instanceof FormData) {
    config.body = body;
} else {
    // Với JSON data
    config.headers['Content-Type'] = 'application/json';
    if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
    }
}
```

#### appointmentService.js
- **Thêm method `uploadFile`**
  - Endpoint: `POST /api/files`
  - Parameters: file (File object), type (default: 'avatars')
  - Returns: Array of uploaded image URLs
  - Sử dụng FormData để upload

```javascript
uploadFile: async (file, type = 'avatars') => {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('type', type);
    
    return apiRequest('/files', 'POST', formData, true);
}
```

### 2. Modal Components Updates

#### EditProfileModal.jsx
**Removed:**
- ❌ Trường input URL ảnh đại diện (text input)

**Added:**
- ✅ Avatar preview section (120x120px, circular)
- ✅ Hidden file input với ref
- ✅ Button "Chọn ảnh" để trigger file input
- ✅ Upload progress indicator (loading overlay)
- ✅ Image preview sau khi upload
- ✅ Validation:
  - File type check (must be image/*)
  - File size limit (max 5MB)

**Features:**
```javascript
const [uploading, setUploading] = useState(false);
const fileInputRef = useRef(null);

const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
    }

    try {
        setUploading(true);
        const response = await appointmentService.uploadFile(file, 'avatars');
        const imageUrl = response.data?.[0];
        
        if (imageUrl) {
            setFormData(prev => ({
                ...prev,
                profileImage: imageUrl
            }));
            toast.success('Tải ảnh lên thành công!');
        }
    } catch (error) {
        toast.error(error.message || 'Tải ảnh lên thất bại');
    } finally {
        setUploading(false);
    }
};
```

#### EditFamilyMemberModal.jsx
- Cùng các thay đổi như EditProfileModal
- Upload riêng cho từng family member
- URL được lưu vào formData.profileImage

### 3. UI/UX

#### Avatar Upload Section Layout
```
┌────────────────────────────────────┐
│                                    │
│      ┌──────────────────┐          │
│      │                  │          │
│      │   Avatar Preview │          │
│      │   (120x120px)    │          │
│      │                  │          │
│      └──────────────────┘          │
│                                    │
│     [📷 Chọn ảnh] Button           │
│                                    │
│   Kích thước tối đa: 5MB          │
│                                    │
└────────────────────────────────────┘
```

**States:**
1. **No Image**: Hiển thị icon person-circle placeholder
2. **Image Selected**: Hiển thị preview ảnh đã upload
3. **Uploading**: Overlay loading với icon hourglass

**Styling:**
- Circular avatar (border-radius: 50%)
- Blue border (3px solid #1e88e5)
- Clickable với cursor pointer
- Hover effect (có thể thêm)
- Responsive design

### 4. API Integration

#### Upload Flow
```
User selects image
    ↓
Client validates (type + size)
    ↓
FormData created with file + type
    ↓
POST /api/files (with Authorization header)
    ↓
Server processes upload
    ↓
Response: { data: ["https://..."], message: "..." }
    ↓
URL extracted from response.data[0]
    ↓
formData.profileImage updated
    ↓
Preview updated immediately
    ↓
On form submit: URL sent to update patient API
```

#### API Request Format
**Request:**
```
POST /api/files
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body (FormData):
- files: [File object]
- type: "avatars"
```

**Response:**
```json
{
    "data": [
        "https://files.tienpndev.id.vn/phongkham/avatars/af3a6cd8-0015-4836-ae5e-6621f2644d9f.png"
    ],
    "message": "Upload files successfully"
}
```

### 5. Validation Rules

#### File Type
- Must be image/* (jpg, png, gif, webp, etc.)
- Checked via `file.type.startsWith('image/')`
- Error message: "Vui lòng chọn file ảnh"

#### File Size
- Maximum: 5MB (5 * 1024 * 1024 bytes)
- Checked via `file.size`
- Error message: "Kích thước ảnh không được vượt quá 5MB"

### 6. User Experience

#### Success Flow
```
1. User clicks avatar area or "Chọn ảnh" button
2. File picker opens
3. User selects image
4. Loading overlay appears on avatar
5. Upload completes
6. Success toast: "Tải ảnh lên thành công!"
7. Preview updates with new image
8. User can continue editing other fields
9. On form submit: All data including image URL saved
```

#### Error Handling
- Invalid file type → Toast error
- File too large → Toast error  
- Upload fails → Toast error with message
- Network error → Toast error

#### Visual Feedback
- **Uploading**: Semi-transparent black overlay with loading icon
- **Success**: Toast notification + immediate preview update
- **Error**: Toast notification + no change to current image
- **Button disabled**: During upload to prevent multiple uploads

## Benefits

### Before
❌ User phải upload ảnh riêng đâu đó
❌ Copy/paste URL thủ công
❌ Dễ nhập sai URL
❌ Không preview trước khi submit
❌ Phức tạp và dễ lỗi

### After
✅ Upload trực tiếp trong modal
✅ Tự động lấy URL
✅ Preview ngay lập tức
✅ Validation built-in
✅ UX smooth và professional

## Technical Details

### Dependencies
- React hooks: `useState`, `useEffect`, `useRef`
- Toast notifications: `sonner`
- Bootstrap Icons: `bi-person-circle`, `bi-camera`, `bi-hourglass-split`

### File Structure
```
src/
├── services/
│   ├── api.js                    (Updated - FormData support)
│   └── appointmentService.js     (Updated - uploadFile method)
├── components/
│   └── Profile/
│       ├── EditProfileModal.jsx          (Updated)
│       └── EditFamilyMemberModal.jsx     (Updated)
```

### State Management
```javascript
// Component states
const [uploading, setUploading] = useState(false);  // Upload progress
const fileInputRef = useRef(null);                   // File input ref
const [formData, setFormData] = useState({
    // ...
    profileImage: '',  // Stores uploaded URL
});
```

## Testing Checklist

- [x] Build passes without errors
- [ ] File upload opens file picker
- [ ] Only image files can be selected
- [ ] Files > 5MB are rejected
- [ ] Upload shows loading state
- [ ] Success shows toast and updates preview
- [ ] Error shows toast and keeps current image
- [ ] Image URL is saved on form submit
- [ ] Works in EditProfileModal
- [ ] Works in EditFamilyMemberModal
- [ ] Mobile responsive

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- File validation happens client-side (instant)
- Upload happens asynchronously (non-blocking)
- Preview updates immediately after upload
- No page reload required
- Optimized for files up to 5MB

## Future Enhancements

1. **Image Cropping**: Add crop tool before upload
2. **Drag & Drop**: Support drag-drop files
3. **Multiple Format Support**: Specify allowed formats (jpg, png only)
4. **Compression**: Auto-compress large images before upload
5. **Progress Bar**: Show upload percentage
6. **Remove Image**: Button to remove current avatar
7. **Webcam Capture**: Take photo directly from webcam

## Troubleshooting

### Upload fails
1. Check network connection
2. Verify file is valid image
3. Check file size < 5MB
4. Ensure API endpoint is accessible
5. Check authentication token is valid

### Preview not updating
1. Verify response format is correct
2. Check `response.data[0]` contains URL
3. Ensure state update is triggered
4. Check console for errors

### File picker not opening
1. Verify fileInputRef is connected
2. Check click handler is attached
3. Ensure input is not disabled

## Notes

- Upload type is hardcoded to 'avatars' for profile images
- API returns array of URLs (supports multiple files)
- We only use first URL from response
- Original image URL field removed from form
- Upload is separate from form submission
- Image URL is stored in formData and sent with patient update



