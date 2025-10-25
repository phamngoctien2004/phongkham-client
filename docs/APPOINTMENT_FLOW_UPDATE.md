# Cập nhật luồng đặt lịch khám - Appointment Flow Update

## Tổng quan
Cập nhật luồng đặt lịch khám theo chỉ dẫn từ API documentation, đặc biệt là luồng "Khám chuyên khoa" với khả năng hiển thị và disable bác sĩ không khả dụng.

## Các thay đổi chính

### 1. Thêm API getDepartments
**File:** `src/services/appointmentService.js`

Thêm method mới để lấy danh sách chuyên khoa:
```javascript
getDepartments: async () => {
    return apiRequest('/departments', 'GET', null, false);
}
```

### 2. Cập nhật State Management
**File:** `src/components/Appointment/AppointmentForm.jsx`

Thêm các state mới:
- `departments`: Danh sách các chuyên khoa
- `selectedDepartment`: Chuyên khoa được chọn

### 3. Luồng mới cho "Khám chuyên khoa" (CHUYEN_KHOA)

#### Bước 1: Chọn loại khám
- Người dùng chọn "Khám chuyên khoa"
- Hệ thống tự động load danh sách chuyên khoa từ API `/api/departments`

#### Bước 2: Chọn chuyên khoa
- Hiển thị dropdown danh sách chuyên khoa
- Khi chọn chuyên khoa, load danh sách bác sĩ

#### Bước 3: Chọn ngày (optional)
- Người dùng có thể chọn ngày khám
- Khi chọn ngày, hệ thống gọi API `/api/schedules/available` để lấy thông tin bác sĩ khả dụng

#### Bước 4: Chọn giờ (optional)
- Người dùng có thể chọn giờ khám
- Khi chọn giờ, hệ thống update lại danh sách bác sĩ dựa trên ca làm việc

#### Bước 5: Chọn bác sĩ
- Hiển thị tất cả bác sĩ của chuyên khoa
- **Bác sĩ không khả dụng** (dựa vào ngày/giờ đã chọn):
  - Vẫn hiển thị trong danh sách
  - Bị disable (không thể chọn)
  - Hiển thị với style khác biệt (màu xám, gạch ngang)
  - Thêm text "(Không khả dụng)"

### 4. Logic kiểm tra bác sĩ khả dụng

Function `isDoctorAvailable(doctorId)`:
```javascript
// Nếu chưa chọn ngày -> tất cả bác sĩ available
if (!selectedDate || appointmentType !== 'CHUYEN_KHOA') {
    return true;
}

// Kiểm tra doctor có trong availableSlots không
const doctorSlot = availableSlots.find(slot => slot.id === doctorId);

// Nếu đã chọn giờ, kiểm tra thêm invalidTimes
if (selectedTime && doctorSlot.invalidTimes) {
    return !doctorSlot.invalidTimes.includes(selectedTime);
}

// Chỉ kiểm tra available flag
return doctorSlot.available;
```

### 5. Giữ nguyên giá trị ngày và giờ

**Quan trọng:** Ngày và giờ đã chọn KHÔNG bị reset khi:
- Thay đổi loại khám (từ DOCTOR sang CHUYEN_KHOA hoặc ngược lại)
- Thay đổi chuyên khoa
- Thay đổi bác sĩ

Chỉ reset khi người dùng thực sự thao tác thay đổi ngày/giờ.

### 6. API Calls

#### Lấy lịch khả dụng cho chuyên khoa
```
GET /api/schedules/available?startDate=2025-10-21&endDate=2025-10-21&shift=MORNING
```

Response sẽ trả về danh sách bác sĩ với:
- `available`: true/false
- `invalidTimes`: Mảng các giờ không khả dụng
- `shift`: Ca làm việc (SANG, CHIEU, TOI)

### 7. Visual Indicators

Bác sĩ không khả dụng được hiển thị với:
```javascript
style={!isAvailable ? { 
    color: '#999', 
    backgroundColor: '#f5f5f5',
    textDecoration: 'line-through'
} : {}}
```

## Flow Chart

```
1. Chọn bệnh nhân
   ↓
2. Chọn loại khám
   ↓
3a. Nếu "Khám chuyên khoa":
    → Chọn chuyên khoa
    → Load danh sách bác sĩ
    ↓
3b. (Optional) Chọn ngày
    → Gọi API /schedules/available
    → Update trạng thái bác sĩ (disable không khả dụng)
    ↓
3c. (Optional) Chọn giờ
    → Gọi API /schedules/available với shift
    → Update trạng thái bác sĩ dựa trên invalidTimes
    ↓
4. Chọn bác sĩ (chỉ cho phép chọn bác sĩ khả dụng)
   ↓
5. Nhập triệu chứng
   ↓
6. Xác nhận và đặt lịch
```

## Testing

Để test luồng mới:

1. **Test chọn chuyên khoa:**
   - Chọn "Khám chuyên khoa"
   - Verify danh sách chuyên khoa được load
   - Chọn một chuyên khoa
   - Verify danh sách bác sĩ được load

2. **Test bác sĩ không khả dụng:**
   - Chọn chuyên khoa
   - Chọn ngày cụ thể
   - Verify một số bác sĩ bị disable/tô xám
   - Try chọn bác sĩ bị disable -> không thể chọn

3. **Test giữ nguyên ngày/giờ:**
   - Chọn ngày và giờ
   - Đổi chuyên khoa
   - Verify ngày và giờ vẫn giữ nguyên

4. **Test invalidTimes:**
   - Chọn chuyên khoa, ngày, giờ cụ thể
   - Verify bác sĩ có giờ đó trong invalidTimes bị disable

## Notes

- API `/api/schedules/available` trả về shift bằng tiếng Việt (SANG, CHIEU, TOI) nên cần convert từ MORNING/AFTERNOON/EVENING
- Frontend sử dụng MORNING/AFTERNOON/EVENING cho logic nội bộ
- Backend API sử dụng SANG/CHIEU/TOI
- Function `convertShiftToVietnamese()` xử lý việc mapping này

## Các file đã thay đổi

1. `src/services/appointmentService.js` - Thêm getDepartments method
2. `src/components/Appointment/AppointmentForm.jsx` - Update toàn bộ logic và UI
