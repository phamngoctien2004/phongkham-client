# Hướng Dẫn Đặt Lịch Khám - MediLab

## Tổng quan
Chức năng đặt lịch khám cho phép bệnh nhân đặt lịch hẹn trực tuyến với bác sĩ hoặc đăng ký gói khám/xét nghiệm.

## Luồng hoạt động

### 1. Truy cập trang đặt lịch
- Click vào nút **"Đặt lịch khám"** trên Header (chỉ hiển thị khi đã đăng nhập)
- Hoặc truy cập: `/dat-lich`

### 2. Điền thông tin đặt lịch

#### Bước 1: Chọn bệnh nhân
- Select dropdown hiển thị danh sách bệnh nhân liên kết với tài khoản
- Khi chọn, thông tin bệnh nhân sẽ hiển thị (họ tên, giới tính, ngày sinh, SĐT)
- API: `GET /api/patients/relationships`

#### Bước 2: Chọn loại khám
4 loại khám:
1. **Khám với bác sĩ**: Chọn bác sĩ cụ thể
   - API: `GET /api/doctors`
   
2. **Khám chuyên khoa**: Chọn gói khám chuyên khoa
   - API: `GET /api/services?type=CHUYEN_KHOA`
   
3. **Xét nghiệm**: Chọn dịch vụ xét nghiệm
   - API: `GET /api/services?type=XET_NGHIEM`
   
4. **Gói khám**: Chọn gói khám tổng quát
   - API: `GET /api/services?type=DICH_VU`

#### Bước 3: Chọn ngày và giờ khám
- **Chọn ngày**: Từ hôm nay đến 7 ngày tới
- **Chọn ca khám**: Sáng (7:00-11:30), Chiều (13:00-17:00), Tối (17:30-20:00)
- **Chọn giờ**: Các khung giờ 30 phút
- API: `GET /api/schedules/available?startDate={date}&endDate={date}&doctorId={id}&shift={shift}`
- Giờ đã được đặt sẽ bị disable (invalidTimes)

#### Bước 4: Nhập triệu chứng
- Mô tả triệu chứng, lý do khám (optional)

### 3. Xác nhận đặt lịch
- Click **"Đặt lịch khám"**
- Modal xác nhận hiển thị tất cả thông tin
- Click **"Xác nhận"** để tiếp tục

### 4. API Calls
1. **Tạo lịch hẹn**: `POST /api/appointments`
   ```json
   {
     "patientId": 1,
     "doctorId": 1, // hoặc healthPlanId
     "date": "2025-10-21",
     "time": "09:00:00",
     "symptoms": "Đau đầu..."
   }
   ```

2. **Tạo thanh toán**: `POST /api/payments/appointment/{id}`
   - Tạo QR code thanh toán

### 5. Chuyển sang trang thanh toán
- Navigate to: `/dat-lich/thanh-toan/{appointmentId}`
- Hiển thị:
  - QR Code để quét thanh toán
  - Thông tin chi tiết lịch hẹn
  - Thông tin bệnh nhân
  - Tổng tiền
  - Trạng thái thanh toán

## Cấu trúc Files

```
src/
├── services/
│   └── appointmentService.js       # API calls
├── components/
│   └── Appointment/
│       ├── AppointmentForm.jsx     # Form đặt lịch
│       ├── PaymentPage.jsx         # Trang thanh toán
│       ├── Appointment.css         # Styles
│       └── index.js                # Exports
└── App.jsx                         # Routes
```

## APIs sử dụng

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/patients/relationships` | GET | Lấy danh sách bệnh nhân |
| `/api/doctors` | GET | Lấy danh sách bác sĩ |
| `/api/services` | GET | Lấy danh sách dịch vụ (type: CHUYEN_KHOA, XET_NGHIEM, DICH_VU) |
| `/api/schedules/available` | GET | Lấy lịch khả dụng |
| `/api/appointments` | POST | Tạo lịch hẹn |
| `/api/appointments/{id}` | GET | Lấy chi tiết lịch hẹn |
| `/api/payments/appointment/{id}` | POST | Tạo thanh toán (QR code) |

## Validation

### Required fields:
- ✅ Bệnh nhân
- ✅ Loại khám
- ✅ Bác sĩ/Dịch vụ (tùy loại khám)
- ✅ Ngày khám
- ✅ Giờ khám

### Optional:
- Triệu chứng

## UI/UX Features

### Responsive Design
- Desktop: 2 columns (QR + Details)
- Tablet: Stacked layout
- Mobile: Full width

### Visual Feedback
- Loading states với spinner
- Disabled states cho các slot đã đặt
- Active states cho các lựa chọn
- Toast notifications cho mọi action
- Modal confirmation trước khi đặt lịch

### Theme Consistency
- Colors: Dùng CSS variables từ main.css
- Fonts: Roboto, Raleway, Poppins
- Button styles: Pill shape (border-radius: 50px)
- Accent color: #1977cc
- Heading color: #2c4964

## Error Handling

### Các trường hợp lỗi:
1. **Không load được bệnh nhân**: Toast error, form disabled
2. **Không load được bác sĩ/dịch vụ**: Toast error
3. **Không load được lịch khả dụng**: Toast error
4. **API đặt lịch thất bại**: Toast error, không navigate
5. **API thanh toán thất bại**: Console error, vẫn navigate (QR sẽ loading)

## Testing Checklist

- [ ] Load danh sách bệnh nhân
- [ ] Hiển thị thông tin bệnh nhân khi chọn
- [ ] Load danh sách bác sĩ
- [ ] Load danh sách dịch vụ theo type
- [ ] Lịch khả dụng cập nhật khi chọn bác sĩ/dịch vụ
- [ ] Disable các giờ đã đặt (invalidTimes)
- [ ] Validation required fields
- [ ] Modal confirmation hiển thị đúng thông tin
- [ ] API tạo lịch thành công
- [ ] API tạo thanh toán thành công
- [ ] Navigate đến trang thanh toán
- [ ] QR code hiển thị
- [ ] Thông tin lịch hẹn hiển thị đầy đủ
- [ ] Responsive trên mobile/tablet
- [ ] Toast notifications hoạt động

## Notes

- **Protected Routes**: Cả 2 routes `/dat-lich` và `/dat-lich/thanh-toan/:id` đều yêu cầu đăng nhập
- **QR Code**: Sử dụng API service `api.qrserver.com` để generate QR từ VietQR string
- **Time Slots**: Chia theo ca (Sáng/Chiều/Tối) với các khung giờ 30 phút
- **LocalStorage**: Token tự động được thêm vào header bởi `api.js`

## Future Improvements

1. **Lịch sử đặt lịch**: Trang xem lịch sử các lần đặt
2. **Hủy lịch**: Cho phép hủy lịch trước 24h
3. **Notifications**: Thông báo nhắc khám qua email/SMS
4. **Payment status**: Real-time check trạng thái thanh toán
5. **Filter**: Lọc bác sĩ theo chuyên khoa, kinh nghiệm
6. **Calendar view**: Hiển thị lịch dạng calendar thay vì dropdown
