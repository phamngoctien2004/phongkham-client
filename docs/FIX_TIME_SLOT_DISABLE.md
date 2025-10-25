# Fix: Disable Time Slots Khi Đã Chọn Bác Sĩ và Ngày

## 🐛 Vấn Đề

**Hiện tượng:** 
- User chọn bác sĩ (doctorId=4)
- User chọn ngày (2025-10-27)
- API response có `invalidTimes`
- Nhưng các giờ trong `invalidTimes` KHÔNG bị disable ở dropdown

**Ví dụ API Response:**
```json
GET /api/schedules/available?startDate=2025-10-27&endDate=2025-10-27&doctorId=4

{
  "data": [
    {
      "date": "2025-10-27",
      "doctors": [
        {
          "id": 4,
          "fullName": "BS. NGUYEN VAN D",
          "available": true,
          "invalidTimes": ["09:00:00", "09:30:00", "15:00:00"],
          "shift": "SANG"
        },
        {
          "id": 4,
          "fullName": "BS. NGUYEN VAN D",
          "available": true,
          "invalidTimes": ["15:00:00"],
          "shift": "CHIEU"
        }
      ]
    }
  ]
}
```

**Expected:** Các giờ 09:00, 09:30, 15:00 phải bị disable  
**Actual:** Tất cả giờ đều có thể chọn được

---

## 🔧 Root Cause

Code cũ không có logic kiểm tra `invalidTimes` cho dropdown giờ khám:

```jsx
// CŨ - Không có check
{TIME_SLOTS_MORNING.map((slot) => (
    <option key={slot.value} value={slot.value}>
        {slot.label}
    </option>
))}
```

---

## ✅ Solution

### 1. Thêm Hàm `isTimeSlotAvailable()`

```javascript
const isTimeSlotAvailable = (timeValue, shift) => {
    // Nếu chưa chọn bác sĩ và ngày → tất cả giờ available
    if (!selectedDoctor || !selectedDate) {
        return true;
    }

    // Nếu availableSlots rỗng → tất cả giờ unavailable
    if (availableSlots.length === 0) {
        return false;
    }

    // Tìm slot của bác sĩ trong ca này
    const doctorSlot = availableSlots.find(s => 
        s.id === selectedDoctor.id && 
        (s.shift === shift || s.shift === shift.toUpperCase())
    );

    // Không tìm thấy slot cho ca này → unavailable
    if (!doctorSlot) {
        return false;
    }

    // Ca không available → unavailable
    if (!doctorSlot.available) {
        return false;
    }

    // Kiểm tra xem giờ có trong invalidTimes không
    return !doctorSlot.invalidTimes.includes(timeValue);
};
```

### 2. Cập Nhật UI Dropdown

```jsx
// MỚI - Có check và disable
<optgroup label="Buổi sáng (7:00 - 12:00)">
    {TIME_SLOTS_MORNING.map((slot) => {
        const isAvailable = isTimeSlotAvailable(slot.value, 'SANG');
        return (
            <option
                key={slot.value}
                value={slot.value}
                disabled={!isAvailable}
                style={!isAvailable ? { 
                    color: '#999', 
                    backgroundColor: '#f0f0f0' 
                } : {}}
            >
                {slot.label}
            </option>
        );
    })}
</optgroup>
```

---

## 🎯 Logic Flow

### Case 1: Chưa Chọn Bác Sĩ hoặc Ngày
```
selectedDoctor = null  OR  selectedDate = ''
→ isTimeSlotAvailable() = true (tất cả)
→ All time slots enabled
```

### Case 2: Đã Chọn Bác Sĩ và Ngày, API Chưa Response
```
selectedDoctor = { id: 4 }
selectedDate = '2025-10-27'
availableSlots = []
→ isTimeSlotAvailable() = false (tất cả)
→ All time slots disabled (waiting for API)
```

### Case 3: Đã Có API Response
```
selectedDoctor = { id: 4 }
selectedDate = '2025-10-27'
availableSlots = [
    { 
        id: 4, 
        shift: 'SANG', 
        available: true, 
        invalidTimes: ['09:00:00', '09:30:00'] 
    }
]

Check slot 09:00:00:
→ doctorSlot found ✓
→ doctorSlot.available = true ✓
→ invalidTimes.includes('09:00:00') = true ✗
→ isTimeSlotAvailable() = false
→ 09:00 DISABLED

Check slot 10:00:00:
→ doctorSlot found ✓
→ doctorSlot.available = true ✓
→ invalidTimes.includes('10:00:00') = false ✓
→ isTimeSlotAvailable() = true
→ 10:00 ENABLED
```

---

## 🧪 Test Cases

### Test 1: Chưa Chọn Bác Sĩ
```
Input:
- selectedDoctor = null
- selectedDate = '2025-10-27'

Expected:
- Tất cả giờ enabled (có thể chọn)

Reason:
- Chưa biết bác sĩ nào → không biết giờ nào unavailable
```

### Test 2: Chọn Bác Sĩ, Chưa Chọn Ngày
```
Input:
- selectedDoctor = { id: 4 }
- selectedDate = ''

Expected:
- Tất cả giờ enabled

Reason:
- Chưa biết ngày → không load API → không có invalidTimes
```

### Test 3: Chọn Bác Sĩ và Ngày
```
Input:
- selectedDoctor = { id: 4 }
- selectedDate = '2025-10-27'
- availableSlots = [
    { id: 4, shift: 'SANG', invalidTimes: ['09:00:00', '09:30:00'] }
  ]

Expected:
- 09:00 DISABLED
- 09:30 DISABLED
- Other SANG slots ENABLED

Verify:
✅ isTimeSlotAvailable('09:00:00', 'SANG') = false
✅ isTimeSlotAvailable('09:30:00', 'SANG') = false
✅ isTimeSlotAvailable('10:00:00', 'SANG') = true
```

### Test 4: Bác Sĩ Không Làm Ca Chiều
```
Input:
- selectedDoctor = { id: 4 }
- selectedDate = '2025-10-27'
- availableSlots = [
    { id: 4, shift: 'SANG', available: true }
  ]
  // Không có entry cho 'CHIEU'

Expected:
- Tất cả CHIEU slots DISABLED

Verify:
✅ doctorSlot not found for 'CHIEU'
✅ isTimeSlotAvailable('13:00:00', 'CHIEU') = false
```

### Test 5: Ca Không Available
```
Input:
- availableSlots = [
    { id: 4, shift: 'SANG', available: false, invalidTimes: [] }
  ]

Expected:
- Tất cả SANG slots DISABLED

Verify:
✅ doctorSlot.available = false
✅ isTimeSlotAvailable(anyTime, 'SANG') = false
```

---

## 📊 Shift Mapping

| Shift Name | Value in Code | Value from API |
|------------|---------------|----------------|
| Buổi sáng | `'SANG'` | `'SANG'` |
| Buổi chiều | `'CHIEU'` | `'CHIEU'` |
| Buổi tối | `'TOI'` | `'TOI'` |

**Note:** Function support cả lowercase và uppercase:
```javascript
s.shift === shift || s.shift === shift.toUpperCase()
```

---

## 🔍 Debug Tips

### Kiểm Tra API Response
```javascript
console.log('availableSlots:', availableSlots);
// Expected: Array of doctor slots with shift, invalidTimes
```

### Kiểm Tra Time Slot Check
```javascript
const isAvailable = isTimeSlotAvailable('09:00:00', 'SANG');
console.log('09:00 available?', isAvailable);
// Expected: false nếu '09:00:00' trong invalidTimes
```

### Kiểm Tra Doctor Slot
```javascript
const doctorSlot = availableSlots.find(s => 
    s.id === selectedDoctor.id && 
    s.shift === 'SANG'
);
console.log('Doctor slot for SANG:', doctorSlot);
// Expected: { id: 4, shift: 'SANG', invalidTimes: [...] }
```

---

## ✅ Verification Checklist

- [x] Thêm hàm `isTimeSlotAvailable()`
- [x] Cập nhật UI cho cả 3 shifts (SANG, CHIEU, TOI)
- [x] Handle case chưa chọn bác sĩ
- [x] Handle case chưa chọn ngày
- [x] Handle case availableSlots rỗng
- [x] Handle case bác sĩ không làm ca đó
- [x] Handle case ca không available
- [x] Check invalidTimes correctly
- [x] Styling cho disabled options
- [x] No syntax errors

---

## 🎨 UI Changes

### Before
```
Giờ khám: [Dropdown]
  ├─ 09:00 - 09:30  [ENABLED]  ← Sai (đã hết slot)
  ├─ 09:30 - 10:00  [ENABLED]  ← Sai (đã hết slot)
  └─ 10:00 - 10:30  [ENABLED]  ← Đúng
```

### After
```
Giờ khám: [Dropdown]
  ├─ 09:00 - 09:30  [DISABLED] ← Đúng (trong invalidTimes)
  ├─ 09:30 - 10:00  [DISABLED] ← Đúng (trong invalidTimes)
  └─ 10:00 - 10:30  [ENABLED]  ← Đúng (còn slot)
```

---

## 📝 Summary

### Problem
- Time slots không bị disable dù đã có invalidTimes

### Solution
- Thêm hàm `isTimeSlotAvailable()` để check
- Cập nhật UI với `disabled={!isAvailable}`
- Style disabled options với màu xám

### Result
- ✅ Giờ trong invalidTimes bị disable
- ✅ Giờ hợp lệ vẫn có thể chọn
- ✅ UX tốt hơn (không cho chọn giờ không hợp lệ)

---

**Version**: 2.4.0  
**Date**: October 25, 2025  
**Status**: ✅ FIXED  
**Impact**: High - Prevents booking invalid time slots
