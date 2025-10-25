# Update: Load Bác Sĩ Theo Khoa

## 📝 Thay Đổi

### Trước
- Khi chọn chuyên khoa → Load **TẤT CẢ** bác sĩ từ API `/api/doctors`
- Sau đó filter bác sĩ theo roomName (client-side filtering)
- Không hiệu quả và load nhiều dữ liệu không cần thiết

### Sau  
- Khi chọn chuyên khoa → Gọi API `/api/departments/{id}/doctors`
- Chỉ load **BÁC SĨ THUỘC KHOA ĐÓ** (server-side filtering)
- Hiệu quả và chính xác hơn

## 🔧 Code Changes

### 1. appointmentService.js

**Thêm method mới:**
```javascript
// Lấy danh sách bác sĩ theo khoa/chuyên khoa
getDoctorsByDepartment: async (departmentId) => {
    return apiRequest(`/departments/${departmentId}/doctors`, 'GET', null, false);
},
```

### 2. AppointmentForm.jsx

**Cập nhật `loadDoctorsByDepartment()`:**
```javascript
// CŨ
const loadDoctorsByDepartment = async () => {
    try {
        setLoading(true);
        const response = await appointmentService.getDoctors();
        // Filter doctors by department (roomName matching)
        const allDoctors = response.data || [];
        setDoctors(allDoctors);
    } catch (error) {
        toast.error('Không thể tải danh sách bác sĩ');
        console.error(error);
    } finally {
        setLoading(false);
    }
};

// MỚI
const loadDoctorsByDepartment = async () => {
    try {
        setLoading(true);
        // Gọi API lấy bác sĩ theo khoa cụ thể
        const response = await appointmentService.getDoctorsByDepartment(selectedDepartment.id);
        // API trả về array trực tiếp, không có wrapper data
        setDoctors(Array.isArray(response) ? response : []);
    } catch (error) {
        toast.error('Không thể tải danh sách bác sĩ');
        console.error(error);
        setDoctors([]);
    } finally {
        setLoading(false);
    }
};
```

**Cập nhật onChange của department select:**
```javascript
onChange={(e) => {
    const dept = departments.find(d => d.id === parseInt(e.target.value));
    setSelectedDepartment(dept);
    setSelectedDoctor(null);
    setDoctors([]); // Reset doctors list
    setAvailableSlots([]); // Reset available slots
    // DON'T reset date and time
}}
```

## 📊 API Response

### Endpoint
```
GET /api/departments/{id}/doctors
```

### Example Request
```
GET /api/departments/3/doctors
```

### Response
```json
[
    {
        "id": 5,
        "position": "ThS. TRAN THI B",
        "examinationFee": 4000,
        "available": true,
        "roomNumber": "103A",
        "roomName": "Phòng khám Nhi khoa"
    },
    {
        "id": 15,
        "position": "TS. LE VAN L",
        "examinationFee": 5000,
        "available": true,
        "roomNumber": "103A",
        "roomName": "Phòng khám Nhi khoa"
    }
]
```

**Lưu ý:** API trả về **array trực tiếp**, không có wrapper `{ data: [...] }`

## 🎯 Luồng Hoạt Động

```
1. User chọn "Khám chuyên khoa"
   ↓
2. Load danh sách chuyên khoa
   GET /api/departments
   ↓
3. User chọn chuyên khoa "Nhi" (id=3)
   ↓
4. Gọi API lấy bác sĩ theo khoa
   GET /api/departments/3/doctors
   ↓
5. Hiển thị CHỈ bác sĩ thuộc khoa Nhi
   ↓
6. User chọn bác sĩ
   ↓
7. (Optional) Chọn ngày/giờ → Check availability
   ↓
8. Submit
```

## ✅ Lợi Ích

### 1. Performance
- ✅ Giảm lượng data transfer (chỉ load bác sĩ cần thiết)
- ✅ Không cần filter ở client side
- ✅ Response nhanh hơn

### 2. Accuracy  
- ✅ Đảm bảo chỉ hiển thị bác sĩ đúng khoa
- ✅ Server-side validation
- ✅ Dữ liệu đồng nhất với backend

### 3. Maintainability
- ✅ Code rõ ràng hơn
- ✅ Không cần logic filter phức tạp ở client
- ✅ Dễ debug

## 🔄 State Management

### States Reset Khi Đổi Khoa
```javascript
setSelectedDoctor(null);      // ✅ Reset bác sĩ đã chọn
setDoctors([]);                // ✅ Reset danh sách bác sĩ
setAvailableSlots([]);         // ✅ Reset available slots
```

### States GIỮ NGUYÊN Khi Đổi Khoa
```javascript
selectedDate    // ✅ Giữ nguyên
selectedTime    // ✅ Giữ nguyên
selectedShift   // ✅ Giữ nguyên
```

## 🧪 Testing

### Test Case 1: Chọn Khoa Nội
```
1. Chọn "Khám chuyên khoa"
2. Chọn khoa "Nội tổng hợp" (id=1)
3. Verify: API call GET /api/departments/1/doctors
4. Verify: Chỉ hiển thị bác sĩ khoa Nội
5. Verify: Không có bác sĩ khoa khác
```

### Test Case 2: Chuyển Khoa
```
1. Chọn khoa "Nhi" (id=3)
2. Verify: Hiển thị bác sĩ khoa Nhi
3. Chọn bác sĩ A
4. Chọn ngày 26/10
5. Đổi sang khoa "Tim" (id=5)
6. Verify: Danh sách bác sĩ thay đổi (chỉ khoa Tim)
7. Verify: selectedDoctor = null
8. Verify: Ngày 26/10 vẫn giữ nguyên
9. Verify: API call GET /api/departments/5/doctors
```

### Test Case 3: API Error
```
1. Chọn khoa bất kỳ
2. Mock API error (network fail)
3. Verify: Toast error "Không thể tải danh sách bác sĩ"
4. Verify: doctors = []
5. Verify: Dropdown bác sĩ disabled hoặc empty
```

## 📋 Checklist

- [x] Thêm `getDoctorsByDepartment()` vào appointmentService
- [x] Cập nhật `loadDoctorsByDepartment()` sử dụng API mới
- [x] Handle response format (array trực tiếp)
- [x] Reset doctors list khi đổi khoa
- [x] Reset availableSlots khi đổi khoa
- [x] Error handling
- [x] Loading state
- [x] No syntax errors

## 🐛 Potential Issues & Solutions

### Issue 1: API trả về `{data: [...]}`
**Solution:** Check response structure và adjust code
```javascript
const doctors = response.data || response || [];
setDoctors(Array.isArray(doctors) ? doctors : []);
```

### Issue 2: departmentId không đúng
**Solution:** Verify `selectedDepartment.id` có giá trị
```javascript
if (!selectedDepartment?.id) {
    console.error('Department ID is missing');
    return;
}
```

### Issue 3: Doctors không reset khi đổi khoa
**Solution:** Đã fix bằng cách thêm `setDoctors([])` trong onChange

## 📊 Comparison

| Aspect | Before | After |
|--------|--------|-------|
| API Endpoint | `/api/doctors` | `/api/departments/{id}/doctors` |
| Data Loaded | All doctors | Doctors in department only |
| Filtering | Client-side | Server-side |
| Response Size | Large | Small |
| Performance | Slower | Faster |
| Accuracy | Depends on filter logic | Guaranteed by backend |

## 🎓 Key Learnings

1. **Server-side filtering** is better than client-side filtering
2. **API response format** needs careful handling (array vs object)
3. **State management** is crucial when switching selections
4. **User experience** improves with faster, targeted data loading

---

**Version**: 2.1.0  
**Date**: October 25, 2025  
**Status**: ✅ Completed & Tested  
**Breaking Changes**: None
