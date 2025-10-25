# Final Update: Shift Parameters & Doctor Selection Logic

## 🔧 Các Thay Đổi Cuối Cùng

### 1. ✅ Shift Parameters - Tiếng Việt
**Yêu cầu:** API yêu cầu shift phải là `SANG`, `CHIEU`, `TOI` (không phải `MORNING`, `AFTERNOON`, `EVENING`)

**Đã sửa:**
```javascript
// CŨ
if (hour >= 7 && hour < 13) {
    params.shift = 'MORNING';
} else if (hour >= 13 && hour < 17) {
    params.shift = 'AFTERNOON';
} else {
    params.shift = 'EVENING';
}

// MỚI
if (hour >= 7 && hour < 13) {
    params.shift = 'SANG';
} else if (hour >= 13 && hour < 17) {
    params.shift = 'CHIEU';
} else {
    params.shift = 'TOI';
}
```

**Vị trí cập nhật:**
- ✅ `loadAvailableDoctorsForDepartment()` - Line ~192-200
- ✅ `onChange` của time select - Line ~617-625

---

### 2. ✅ Doctor Selection Logic - doctorId vs departmentId
**Yêu cầu:** Nếu đã chọn bác sĩ → dùng `doctorId`, nếu chưa → dùng `departmentId`

**Logic:**
```javascript
const params = {
    startDate: selectedDate,
    endDate: selectedDate,
};

// Nếu đã chọn bác sĩ → dùng doctorId, nếu chưa → dùng departmentId
if (selectedDoctor) {
    params.doctorId = selectedDoctor.id;
} else {
    params.departmentId = selectedDepartment.id;
}
```

**Lý do:** 
- Khi chưa chọn bác sĩ: Cần lấy tất cả bác sĩ trong khoa → `departmentId`
- Khi đã chọn bác sĩ: Chỉ cần check available của bác sĩ đó → `doctorId`

---

## 📊 Luồng API Calls

### Scenario 1: Chưa Chọn Bác Sĩ
```
User: Chọn khoa "Nội" (id=1)
User: Chọn ngày "26/10/2025"
API: GET /api/schedules/available?startDate=2025-10-26&endDate=2025-10-26&departmentId=1

User: Chọn giờ "09:00"
API: GET /api/schedules/available?startDate=2025-10-26&endDate=2025-10-26&departmentId=1&shift=SANG
```

### Scenario 2: Đã Chọn Bác Sĩ
```
User: Chọn khoa "Nội" (id=1)
User: Chọn bác sĩ "BS. Nguyễn Văn A" (id=3)
User: Chọn ngày "26/10/2025"
API: GET /api/schedules/available?startDate=2025-10-26&endDate=2025-10-26&doctorId=3

User: Chọn giờ "09:00"
API: GET /api/schedules/available?startDate=2025-10-26&endDate=2025-10-26&doctorId=3&shift=SANG
```

---

## 🎯 Mapping Giờ → Shift

| Giờ | Shift | Note |
|-----|-------|------|
| 07:00 - 12:59 | `SANG` | Buổi sáng |
| 13:00 - 16:59 | `CHIEU` | Buổi chiều |
| 17:00 - 23:00 | `TOI` | Buổi tối |

---

## ✅ State Dependencies

### useEffect Dependency Array
```javascript
useEffect(() => {
    if (appointmentType === 'CHUYEN_KHOA' && selectedDepartment && (selectedDate || selectedTime)) {
        loadAvailableDoctorsForDepartment();
    }
}, [
    selectedDate,        // ✅ Thay đổi ngày → re-load
    selectedTime,        // ✅ Thay đổi giờ → re-load
    selectedShift,       // ✅ Shift tự động update theo giờ
    appointmentType,     // ✅ Đổi loại khám → re-load
    selectedDepartment,  // ✅ Đổi khoa → re-load
    selectedDoctor       // ✅ Chọn/bỏ chọn bác sĩ → re-load
]);
```

---

## 🧪 Test Cases

### Test Case 1: Shift Parameter
```javascript
// Input: Chọn giờ 09:00
// Expected: params.shift = 'SANG'
// API: /schedules/available?...&shift=SANG

// Input: Chọn giờ 14:00
// Expected: params.shift = 'CHIEU'
// API: /schedules/available?...&shift=CHIEU

// Input: Chọn giờ 18:00
// Expected: params.shift = 'TOI'
// API: /schedules/available?...&shift=TOI
```

### Test Case 2: doctorId vs departmentId
```javascript
// Scenario A: Chưa chọn bác sĩ
selectedDoctor = null
selectedDepartment = { id: 1 }
// Expected: params = { departmentId: 1 }

// Scenario B: Đã chọn bác sĩ
selectedDoctor = { id: 3 }
selectedDepartment = { id: 1 }
// Expected: params = { doctorId: 3 }
// Note: Không gửi departmentId nữa
```

### Test Case 3: Đổi Bác Sĩ
```javascript
// User: Chọn bác sĩ A (id=3)
// API: /schedules/available?doctorId=3&...

// User: Chọn bác sĩ B (id=5)
// API: /schedules/available?doctorId=5&...

// User: Bỏ chọn bác sĩ (chọn "-- Chọn bác sĩ --")
// selectedDoctor = null
// API: /schedules/available?departmentId=1&...
```

---

## 📋 Checklist

- [x] Shift parameters dùng tiếng Việt (SANG, CHIEU, TOI)
- [x] Logic chọn doctorId vs departmentId
- [x] useEffect dependency bao gồm selectedDoctor
- [x] API calls đúng theo logic
- [x] No syntax errors
- [x] Backward compatible với getTimeSlotsByShift()

---

## 🔍 Code Review

### ✅ Correct Implementation

```javascript
// 1. Shift mapping - CORRECT
const hour = parseInt(selectedTime.split(':')[0]);
if (hour >= 7 && hour < 13) {
    params.shift = 'SANG';      // ✅ Tiếng Việt
} else if (hour >= 13 && hour < 17) {
    params.shift = 'CHIEU';     // ✅ Tiếng Việt
} else {
    params.shift = 'TOI';       // ✅ Tiếng Việt
}

// 2. Doctor vs Department - CORRECT
if (selectedDoctor) {
    params.doctorId = selectedDoctor.id;        // ✅ Ưu tiên doctorId
} else {
    params.departmentId = selectedDepartment.id; // ✅ Fallback departmentId
}

// 3. Function supports both formats - CORRECT
const getTimeSlotsByShift = (shift) => {
    switch (shift) {
        case 'MORNING':   // ✅ Backward compatible
        case 'SANG':      // ✅ Tiếng Việt
            return TIME_SLOTS_MORNING;
        case 'AFTERNOON': // ✅ Backward compatible
        case 'CHIEU':     // ✅ Tiếng Việt
            return TIME_SLOTS_AFTERNOON;
        case 'EVENING':   // ✅ Backward compatible
        case 'TOI':       // ✅ Tiếng Việt
            return TIME_SLOTS_EVENING;
        default:
            return [];
    }
};
```

---

## 🎓 Key Takeaways

1. **API Contract**: Luôn check documentation để đảm bảo đúng format parameters
2. **Smart Logic**: Ưu tiên `doctorId` khi có, fallback `departmentId` khi không có
3. **Backward Compatible**: Support cả 2 formats (EN & VI) trong helper functions
4. **Dependency Management**: Thêm `selectedDoctor` vào dependency array để re-load khi cần

---

## 📊 API Parameters Summary

| Case | Parameters |
|------|-----------|
| Chưa chọn bác sĩ, chưa chọn giờ | `startDate`, `endDate`, `departmentId` |
| Chưa chọn bác sĩ, đã chọn giờ | `startDate`, `endDate`, `departmentId`, `shift` |
| Đã chọn bác sĩ, chưa chọn giờ | `startDate`, `endDate`, `doctorId` |
| Đã chọn bác sĩ, đã chọn giờ | `startDate`, `endDate`, `doctorId`, `shift` |

---

**Version**: 2.3.0  
**Date**: October 25, 2025  
**Status**: ✅ ALL FIXED  
**Ready**: Production Ready 🚀
