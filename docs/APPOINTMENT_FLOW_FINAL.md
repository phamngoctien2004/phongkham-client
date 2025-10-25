# LUỒNG ĐẶT LỊCH CHUYÊN KHOA - PHIÊN BẢN CUỐI CÙNG

## Ngày cập nhật: 25/10/2025

## NGUYÊN TẮC QUAN TRỌNG

### ❌ KHÔNG BAO GIỜ DISABLE BÁC SĨ
- Người dùng luôn có thể chọn bất kỳ bác sĩ nào trong danh sách
- **CHỈ DISABLE KHUNG GIỜ** không hợp lệ

### ✅ LOGIC DISABLE KHUNG GIỜ

#### 1. Theo `available` flag:
```json
{
  "available": false,  // ← Nếu false → DISABLE TOÀN BỘ CA
  "shift": "SANG"
}
```
→ **Tất cả khung giờ buổi sáng sẽ bị disable**

#### 2. Theo `invalidTimes`:
```json
{
  "invalidTimes": ["09:00:00", "15:00:00"]
}
```
- `09:00:00` → Disable khung **9:00 - 9:30**
- `15:00:00` → Disable khung **15:00 - 15:30**

---

## LUỒNG 1: CHỌN BÁC SĨ TRƯỚC

### Bước 1: Người dùng chọn
1. Loại khám: **Chuyên khoa**
2. Chuyên khoa: **Nội tổng quát** (id = 2)
3. Bác sĩ: **BS. Nguyễn Văn A** (id = 1)
4. Ngày khám: **27/10/2025**

### Bước 2: Gọi API để lấy lịch
```
GET /api/schedules/available
Query params:
  - startDate=2025-10-27
  - endDate=2025-10-27
  - doctorId=1
```

### Bước 3: Response API
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

### Bước 4: Hiển thị khung giờ
**Buổi sáng (SANG):**
- ❌ 07:00 - 07:30 ✅ Available
- ❌ 07:30 - 08:00 ✅ Available
- ❌ 08:00 - 08:30 ✅ Available
- ❌ 08:30 - 09:00 ✅ Available
- ❌ **09:00 - 09:30** ❌ DISABLED (trong invalidTimes)
- ❌ **09:30 - 10:00** ❌ DISABLED (trong invalidTimes)
- ❌ 10:00 - 10:30 ✅ Available
- ... (các khung còn lại available)

**Buổi chiều (CHIEU):**
- ❌ **TẤT CẢ KHUNG GIỜ CHIỀU** ❌ DISABLED (available = false)

**Buổi tối (TOI):**
- Không có data → Không hiển thị hoặc tất cả disabled

---

## LUỒNG 2: CHỌN NGÀY VÀ GIỜ TRƯỚC

### Bước 1: Người dùng chọn
1. Loại khám: **Chuyên khoa**
2. Chuyên khoa: **Nội tổng quát** (id = 2)
3. Ngày khám: **27/10/2025**
4. Giờ khám: **08:00 - 08:30** (shift = SANG)

### Bước 2: Gọi API để lấy danh sách bác sĩ available
```
GET /api/schedules/available
Query params:
  - startDate=2025-10-27
  - endDate=2025-10-27
  - departmentId=2
  - shift=SANG
```

### Bước 3: Response API
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
          "invalidTimes": [],
          "shift": "SANG"
        },
        {
          "id": 3,
          "fullName": "BS. Trần Thị B",
          "available": true,
          "invalidTimes": ["08:00:00", "08:30:00"],
          "shift": "SANG"
        },
        {
          "id": 5,
          "fullName": "BS. Lê Văn C",
          "available": true,
          "invalidTimes": ["07:00:00", "07:30:00", "08:00:00"],
          "shift": "SANG"
        }
      ]
    }
  ]
}
```

### Bước 4: Hiển thị danh sách bác sĩ
- ✅ BS. Nguyễn Văn A (id=1) - **Có thể chọn**
- ✅ BS. Trần Thị B (id=3) - **Có thể chọn** 
- ✅ BS. Lê Văn C (id=5) - **Có thể chọn**

**LƯU Ý:** Tất cả bác sĩ đều có thể chọn, không disable

### Bước 5: Người dùng chọn bác sĩ
Chọn: **BS. Trần Thị B** (id = 3)

### Bước 6: Gọi lại API với doctorId
```
GET /api/schedules/available
Query params:
  - startDate=2025-10-27
  - endDate=2025-10-27
  - doctorId=3
  - shift=SANG
```

### Bước 7: Kiểm tra giờ đã chọn
Response:
```json
{
  "id": 3,
  "invalidTimes": ["08:00:00", "08:30:00"],
  "shift": "SANG"
}
```

**Giờ đã chọn:** 08:00:00  
**Kết quả:** `08:00:00` **CÓ TRONG** `invalidTimes`

→ ⚠️ **Hiển thị toast warning:**
```
"Khung giờ đã chọn không hợp lệ cho bác sĩ này. 
Vui lòng chọn khung giờ khác."
```

→ **Reset selectedTime = ""** (xóa giờ đã chọn)

→ **Disable các khung giờ không hợp lệ:**
- ❌ **08:00 - 08:30** ❌ DISABLED
- ❌ **08:30 - 09:00** ❌ DISABLED
- ✅ 07:00 - 07:30 ✅ Available
- ✅ 09:00 - 09:30 ✅ Available
- ... (các khung khác available)

---

## CODE IMPLEMENTATION

### 1. Function `loadAvailableSchedules()`

```javascript
const loadAvailableSchedules = async () => {
    try {
        const params = {
            startDate: selectedDate,
            endDate: selectedDate,
            departmentId: selectedDepartment.id,
        };

        // LUỒNG 1: Đã chọn bác sĩ trước
        if (selectedDoctor) {
            params.doctorId = selectedDoctor.id;
            delete params.departmentId;
        }
        // LUỒNG 2: Đã chọn giờ trước (chưa chọn bác sĩ)
        else if (selectedTime) {
            const hour = parseInt(selectedTime.split(':')[0]);
            if (hour >= 7 && hour < 13) {
                params.shift = 'SANG';
            } else if (hour >= 13 && hour < 17) {
                params.shift = 'CHIEU';
            } else {
                params.shift = 'TOI';
            }
        }

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

### 2. Function `isTimeSlotAvailable(timeValue, shiftName)`

```javascript
const isTimeSlotAvailable = (timeValue, shiftName) => {
    // Chưa chọn ngày → tất cả giờ đều available
    if (!selectedDate || appointmentType !== 'CHUYEN_KHOA') {
        return true;
    }

    // LUỒNG 1: Đã chọn bác sĩ
    if (selectedDoctor) {
        const doctorSlot = availableSlots.find(s => 
            s.id === selectedDoctor.id && s.shift === shiftName
        );

        if (!doctorSlot) return false;
        
        // Kiểm tra available flag
        if (!doctorSlot.available) return false;
        
        // Kiểm tra invalidTimes
        return !doctorSlot.invalidTimes.includes(timeValue);
    }

    // LUỒNG 2: Chưa chọn bác sĩ
    // → Kiểm tra có ÍT NHẤT 1 bác sĩ available cho khung giờ này
    const shiftsInThisTime = availableSlots.filter(s => s.shift === shiftName);
    
    if (shiftsInThisTime.length === 0) return false;

    return shiftsInThisTime.some(slot => {
        return slot.available && !slot.invalidTimes.includes(timeValue);
    });
};
```

### 3. Validation khi chọn bác sĩ (LUỒNG 2)

```javascript
onChange={(e) => {
    const doctor = doctors.find(d => d.id === parseInt(e.target.value));
    setSelectedDoctor(doctor);
    
    // Nếu đã chọn giờ trước, kiểm tra giờ đó có hợp lệ không
    if (selectedDate && selectedTime && doctor) {
        const hour = parseInt(selectedTime.split(':')[0]);
        let shift = hour >= 7 && hour < 13 ? 'SANG' 
                  : hour >= 13 && hour < 17 ? 'CHIEU' 
                  : 'TOI';
        
        setTimeout(() => {
            const doctorSlot = availableSlots.find(s => 
                s.id === doctor.id && s.shift === shift
            );
            
            if (doctorSlot) {
                const isInvalid = !doctorSlot.available 
                               || doctorSlot.invalidTimes.includes(selectedTime);
                if (isInvalid) {
                    toast.warning('Khung giờ đã chọn không hợp lệ cho bác sĩ này. Vui lòng chọn khung giờ khác.');
                    setSelectedTime('');
                }
            }
        }, 500);
    }
}}
```

### 4. Validation khi chọn giờ (sau khi đã chọn bác sĩ)

```javascript
onChange={(e) => {
    const time = e.target.value;
    
    // Nếu đã chọn bác sĩ, kiểm tra khung giờ có hợp lệ không
    if (selectedDoctor && selectedDate && time) {
        const hour = parseInt(time.split(':')[0]);
        let shift = hour >= 7 && hour < 13 ? 'SANG' 
                  : hour >= 13 && hour < 17 ? 'CHIEU' 
                  : 'TOI';
        
        const doctorSlot = availableSlots.find(s => 
            s.id === selectedDoctor.id && s.shift === shift
        );
        
        if (doctorSlot) {
            const isInvalid = !doctorSlot.available 
                           || doctorSlot.invalidTimes.includes(time);
            if (isInvalid) {
                toast.warning('Khung giờ này không hợp lệ cho bác sĩ đã chọn. Vui lòng chọn khung giờ khác.');
                return; // Không set time
            }
        }
    }
    
    setSelectedTime(time);
}}
```

---

## TÓM TẮT CÁC THAY ĐỔI

### ✅ Đã thực hiện:

1. ❌ **Xóa logic disable bác sĩ** - Tất cả bác sĩ luôn có thể chọn
2. ✅ **Chỉ disable khung giờ** dựa trên:
   - `available = false` → Disable toàn bộ ca
   - `invalidTimes` → Disable từng khung giờ cụ thể
3. ✅ **API params thông minh:**
   - Có `doctorId` → Dùng doctorId, bỏ departmentId
   - Không có `doctorId` + có `selectedTime` → Dùng departmentId + shift
   - Không có cả hai → Chỉ dùng departmentId
4. ✅ **Validation 2 chiều:**
   - Chọn bác sĩ sau khi chọn giờ → Kiểm tra giờ có hợp lệ không
   - Chọn giờ sau khi chọn bác sĩ → Kiểm tra giờ có hợp lệ không
5. ✅ **Toast warning** khi chọn khung giờ không hợp lệ
6. ✅ **Auto reset** selectedTime khi không hợp lệ

---

## TEST CASES

### Test 1: LUỒNG 1 - Chọn bác sĩ trước
1. Chọn chuyên khoa → Chọn bác sĩ A → Chọn ngày
2. ✅ Các khung giờ invalid của bác sĩ A phải bị disable
3. ✅ Có thể chọn khung giờ valid
4. ✅ Không thể chọn khung giờ invalid

### Test 2: LUỒNG 2 - Chọn ngày giờ trước
1. Chọn chuyên khoa → Chọn ngày → Chọn giờ 8:00
2. ✅ Danh sách bác sĩ hiển thị đầy đủ (không bị disable)
3. Chọn bác sĩ B (có invalidTime 8:00)
4. ✅ Toast warning xuất hiện
5. ✅ selectedTime bị reset về ""
6. ✅ Khung giờ 8:00-8:30 bị disable
7. ✅ Phải chọn lại khung giờ khác

### Test 3: available = false
1. Chọn bác sĩ có ca chiều available = false
2. ✅ Tất cả khung giờ chiều bị disable
3. ✅ Không thể chọn bất kỳ khung giờ nào buổi chiều

### Test 4: Switch bác sĩ
1. Chọn bác sĩ A → Chọn giờ 9:00 (valid cho A)
2. Đổi sang bác sĩ B (invalidTime có 9:00)
3. ✅ Toast warning xuất hiện
4. ✅ selectedTime bị reset
5. ✅ Phải chọn khung giờ khác

---

## API REFERENCE

### GET /api/schedules/available

**Query Parameters:**
- `startDate` (required): yyyy-MM-dd
- `endDate` (required): yyyy-MM-dd
- `doctorId` (optional): ID bác sĩ
- `departmentId` (optional): ID chuyên khoa
- `shift` (optional): SANG | CHIEU | TOI

**Response Structure:**
```json
{
  "data": [
    {
      "date": "2025-10-27",
      "dateName": "SUNDAY",
      "totalSlot": 2,
      "doctors": [
        {
          "id": 1,
          "fullName": "BS. Nguyễn Văn A",
          "position": "ThS. Nguyễn Văn A",
          "available": true,
          "invalidTimes": ["09:00:00", "09:30:00"],
          "shift": "SANG"
        }
      ]
    }
  ],
  "message": "get available slots success"
}
```

**Shift Time Ranges:**
- `SANG`: 07:00 - 13:00 (7h - 13h)
- `CHIEU`: 13:00 - 17:00 (13h - 17h)
- `TOI`: 17:00 - 23:00 (17h - 23h)

---

**File được tạo:** `docs/APPOINTMENT_FLOW_FINAL.md`  
**Ngày:** 25/10/2025  
**Trạng thái:** ✅ HOÀN THÀNH
