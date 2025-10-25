# LUỒNG ĐẶT LỊCH ĐƠN GIẢN HÓA

## Ngày cập nhật: 25/10/2025 (Version 2)

---

## 🎯 NGUYÊN TẮC MỚI (ĐƠN GIẢN HƠN)

### ✅ LUỒNG DUY NHẤT: Chọn bác sĩ → API disable khung giờ

1. **Bỏ hoàn toàn `departmentId`** - Không gửi trong bất kỳ API call nào
2. **Chưa chọn bác sĩ** → **TẤT CẢ khung giờ đều AVAILABLE** (không disable)
3. **Đã chọn bác sĩ** → Gọi API với `doctorId` → Disable khung giờ không hợp lệ
4. **Chọn lại "-- Chọn bác sĩ --"** → Clear `availableSlots` → Tất cả giờ lại available

---

## 📋 LUỒNG SỬ DỤNG

### Bước 1: Người dùng chọn
1. Loại khám: **Chuyên khoa**
2. Chuyên khoa: **Nội tổng quát** (id = 2)
3. **Chưa chọn bác sĩ** → Select đang ở "-- Chọn bác sĩ --"
4. Ngày khám: **27/10/2025**

### Bước 2: Chọn giờ
- ✅ **TẤT CẢ khung giờ đều KHÔNG bị disable**
- ✅ Có thể chọn bất kỳ giờ nào (7:00 - 23:00)
- Ví dụ: Chọn **09:00 - 09:30**

### Bước 3: Chọn bác sĩ
Chọn: **BS. Nguyễn Văn A** (id = 1)

### Bước 4: Gọi API
```
GET /api/schedules/available
Query params:
  - startDate=2025-10-27
  - endDate=2025-10-27
  - doctorId=1
```

**LƯU Ý:** 
- ❌ KHÔNG có `departmentId`
- ❌ KHÔNG có `shift`
- ✅ CHỈ có `doctorId` + dates

### Bước 5: Response API
```json
{
  "data": [
    {
      "date": "2025-10-27",
      "doctors": [
        {
          "id": 1,
          "fullName": "BS. Nguyễn Văn A",
          "available": true,
          "invalidTimes": ["09:00:00", "09:30:00"],
          "shift": "SANG"
        },
        {
          "id": 1,
          "fullName": "BS. Nguyễn Văn A",
          "available": false,
          "invalidTimes": [],
          "shift": "CHIEU"
        }
      ]
    }
  ]
}
```

### Bước 6: Kiểm tra giờ đã chọn
- Giờ đã chọn: **09:00:00**
- invalidTimes của bác sĩ A: `["09:00:00", "09:30:00"]`
- **Kết quả:** `09:00:00` có trong invalidTimes

→ ⚠️ **Toast warning:**
```
"Khung giờ đã chọn không hợp lệ cho bác sĩ này. 
Vui lòng chọn khung giờ khác."
```

→ **Reset `selectedTime = ""`**

### Bước 7: UI cập nhật
**Buổi sáng:**
- ✅ 07:00 - 07:30
- ✅ 07:30 - 08:00
- ✅ 08:00 - 08:30
- ✅ 08:30 - 09:00
- ❌ **09:00 - 09:30** (DISABLED)
- ❌ **09:30 - 10:00** (DISABLED)
- ✅ 10:00 - 10:30
- ... (các khung còn lại available)

**Buổi chiều:**
- ❌ **TẤT CẢ** (DISABLED - vì available = false)

---

## 🔄 TRƯỜNG HỢP ĐỔI BÁC SĨ

### Kịch bản: Chọn lại "-- Chọn bác sĩ --"

**Trước khi đổi:**
- Bác sĩ: BS. Nguyễn Văn A (id=1)
- Giờ: 08:00 - 08:30
- Một số khung giờ bị disable theo schedule bác sĩ A

**Sau khi chọn "-- Chọn bác sĩ --":**
1. `setSelectedDoctor(null)`
2. `setAvailableSlots([])` → Clear schedule data
3. ✅ **TẤT CẢ khung giờ lại thành AVAILABLE**
4. Giờ đã chọn (08:00-08:30) vẫn giữ nguyên
5. Có thể chọn bác sĩ khác hoặc giữ nguyên

---

## 💻 CODE IMPLEMENTATION

### 1. useEffect - Chỉ gọi API khi có bác sĩ

```javascript
useEffect(() => {
    // CHỈ gọi API khi đã chọn bác sĩ + ngày
    if (appointmentType === 'CHUYEN_KHOA' && selectedDoctor && selectedDate) {
        loadAvailableSchedules();
    } else {
        // Nếu chưa chọn bác sĩ → clear để tất cả giờ available
        setAvailableSlots([]);
    }
}, [selectedDate, appointmentType, selectedDoctor]);
```

### 2. loadAvailableSchedules - Bỏ departmentId

```javascript
const loadAvailableSchedules = async () => {
    try {
        // CHỈ gọi khi có bác sĩ được chọn
        if (!selectedDoctor) {
            setAvailableSlots([]);
            return;
        }

        const params = {
            startDate: selectedDate,
            endDate: selectedDate,
            doctorId: selectedDoctor.id,
            // ❌ KHÔNG CÓ departmentId
            // ❌ KHÔNG CÓ shift
        };

        const response = await appointmentService.getAvailableSchedules(params);
        if (response.data && response.data.length > 0) {
            const dayData = response.data[0];
            setAvailableSlots(dayData.doctors || []);
        } else {
            setAvailableSlots([]);
        }
    } catch (error) {
        console.error('Error loading available schedules:', error);
        setAvailableSlots([]);
    }
};
```

### 3. isTimeSlotAvailable - Đơn giản hóa

```javascript
const isTimeSlotAvailable = (timeValue, shiftName) => {
    // Chưa chọn ngày → all available
    if (!selectedDate || appointmentType !== 'CHUYEN_KHOA') {
        return true;
    }

    // ⭐ CHƯA CHỌN BÁC SĨ → all available
    if (!selectedDoctor) {
        return true;
    }

    // ĐÃ CHỌN BÁC SĨ → kiểm tra schedule
    if (availableSlots.length === 0) {
        return false;
    }

    const doctorSlot = availableSlots.find(s => 
        s.id === selectedDoctor.id && s.shift === shiftName
    );

    if (!doctorSlot) return false;
    if (!doctorSlot.available) return false;
    
    return !doctorSlot.invalidTimes.includes(timeValue);
};
```

### 4. onChange Select Bác sĩ - Xử lý "-- Chọn bác sĩ --"

```javascript
onChange={(e) => {
    const doctorId = e.target.value;
    
    // ⭐ Nếu chọn "-- Chọn bác sĩ --" (value = "")
    if (!doctorId) {
        setSelectedDoctor(null);
        setAvailableSlots([]); // Clear → all available
        return;
    }
    
    const doctor = doctors.find(d => d.id === parseInt(doctorId));
    setSelectedDoctor(doctor);
    
    // Kiểm tra giờ đã chọn có hợp lệ không
    if (selectedDate && selectedTime && doctor) {
        setTimeout(() => {
            const doctorSlot = availableSlots.find(s => 
                s.id === doctor.id && s.shift === shift
            );
            
            if (doctorSlot) {
                const isInvalid = !doctorSlot.available 
                               || doctorSlot.invalidTimes.includes(selectedTime);
                if (isInvalid) {
                    toast.warning('Khung giờ đã chọn không hợp lệ...');
                    setSelectedTime('');
                }
            }
        }, 500);
    }
}}
```

---

## 🧪 TEST CASES

### Test 1: Chưa chọn bác sĩ
1. ✅ Chọn khoa → Chọn ngày
2. ✅ **TẤT CẢ khung giờ đều available**
3. ✅ Có thể chọn bất kỳ giờ nào

### Test 2: Chọn bác sĩ sau khi chọn giờ
1. Chọn khoa → Chọn ngày → Chọn giờ 09:00
2. Chọn bác sĩ A (có invalidTime 09:00)
3. ✅ Toast warning xuất hiện
4. ✅ selectedTime bị reset
5. ✅ Khung 09:00-09:30 bị disable
6. ✅ Phải chọn giờ khác

### Test 3: Chọn lại "-- Chọn bác sĩ --"
1. Đã chọn bác sĩ A → Một số giờ bị disable
2. Chọn lại "-- Chọn bác sĩ --"
3. ✅ selectedDoctor = null
4. ✅ availableSlots = []
5. ✅ **TẤT CẢ khung giờ lại available**

### Test 4: Đổi bác sĩ
1. Chọn bác sĩ A → Chọn giờ 10:00 (valid)
2. Đổi sang bác sĩ B (invalidTime có 10:00)
3. ✅ Toast warning xuất hiện
4. ✅ selectedTime bị reset
5. ✅ Khung 10:00-10:30 bị disable
6. ✅ Phải chọn giờ khác

### Test 5: available = false
1. Chọn bác sĩ có ca chiều available = false
2. ✅ **TẤT CẢ khung giờ chiều bị disable**
3. ✅ Không thể chọn bất kỳ giờ nào buổi chiều

---

## 📊 SO SÁNH VỚI PHIÊN BẢN CŨ

### ❌ Phiên bản cũ (Phức tạp):
- Gọi API với `departmentId` khi chưa chọn bác sĩ
- Có 2 luồng: chọn bác sĩ trước / chọn giờ trước
- Phải kiểm tra "có ít nhất 1 bác sĩ available"
- Logic phức tạp, khó maintain

### ✅ Phiên bản mới (Đơn giản):
- **KHÔNG** gọi API khi chưa chọn bác sĩ
- **CHỈ 1 luồng:** Chọn bác sĩ → Disable giờ
- Tất cả giờ available khi chưa chọn bác sĩ
- Logic đơn giản, dễ hiểu

---

## 🎯 TÓM TẮT

### Khi CHƯA CHỌN BÁC SĨ:
```
selectedDoctor = null
→ availableSlots = []
→ isTimeSlotAvailable() return true
→ ✅ TẤT CẢ khung giờ AVAILABLE
```

### Khi ĐÃ CHỌN BÁC SĨ:
```
selectedDoctor = { id: 1, ... }
→ Gọi API: ?doctorId=1&startDate=...&endDate=...
→ availableSlots = [{ id: 1, shift: 'SANG', invalidTimes: [...] }]
→ isTimeSlotAvailable() check invalidTimes
→ ❌ Disable khung giờ không hợp lệ
```

### Khi CHỌN LẠI "-- Chọn bác sĩ --":
```
doctorId = "" (empty)
→ setSelectedDoctor(null)
→ setAvailableSlots([])
→ ✅ TẤT CẢ khung giờ lại AVAILABLE
```

---

## 📝 API CALL EXAMPLES

### ✅ ĐÃ CHỌN BÁC SĨ:
```
GET /api/schedules/available?startDate=2025-10-27&endDate=2025-10-27&doctorId=1
```

### ❌ CHƯA CHỌN BÁC SĨ:
```
KHÔNG GỌI API
(Tất cả giờ đều available)
```

---

**File được tạo:** `docs/APPOINTMENT_SIMPLE_FLOW.md`  
**Ngày:** 25/10/2025  
**Version:** 2.0 (Đơn giản hóa)  
**Trạng thái:** ✅ HOÀN THÀNH
