### 14.3 Lấy lịch khả dụng
**Endpoint:** `GET /api/schedules/available`

**Mô tả:** Lọc lịch làm việc khả dụng

**Query Parameters:**
- `startDate` (required): Ngày bắt đầu (yyyy-MM-dd)
- `endDate` (required): Ngày kết thúc (yyyy-MM-dd)
- `departmentId` (optional): ID khoa
- `doctorId` (optional): ID bác sĩ
- `shift` (optional): Ca làm việc (MORNING, AFTERNOON, EVENING)

**Response:**
```json
{
    "data": [
        {
            "date": "2025-10-20",
            "dateName": "MONDAY",
            "totalSlot": 2,
            "doctors": [
                {
                    "id": 1,
                    "fullName": "tien",
                    "position": "PGS. Phạm Tiến",
                    "available": true,
                    "invalidTimes": [
                        "09:00:00"
                    ],
                    "shift": "SANG"
                },
                {
                    "id": 1,
                    "fullName": "tien",
                    "position": "PGS. Phạm Tiến",
                    "available": true,
                    "invalidTimes": [
                        "15:00:00"
                    ],
                    "shift": "CHIEU"
                }
            ]
        }
    ],
    "message": "get available slots success"
}
```



### Base URL: `/api/appointments`

### 2.1 Đặt lịch hẹn
**Endpoint:** `POST /api/appointments`

**Mô tả:** Tạo lịch hẹn khám bệnh mới

**Request Body:**
```json
{
  "healthPlanId": null,
  "doctorId": 1,
  "patientId": 1,
  "date": "2024-12-20",
  "time": "09:00:00",
  "symptoms": "string"
}
```

**Response:**
```json
{
  "data": {
    "id": 40,
    "patientResponse": {
      "id": 5,
      "code": "BN1757508991380",
      "bloodType": "A",
      "weight": 65.50,
      "height": 170.20,
      "registrationDate": "2025-09-10T19:56:32",
      "fullName": "Nguyen Van A",
      "phone": "0395527082",
      "address": "123 Đường ABC, Quận 1, TP.HCM",
      "cccd": "012345678901",
      "birth": "1995-08-15",
      "gender": "NAM",
      "profileImage": "https://example.com/images/patient123.jpg",
      "relationship": null,
      "email": null,
      "verified": false
    },
    "healthPlanResponse": null, 
    "doctorResponse": {
      "id": 1,
      "fullName": "tien",
      "position": "PGS. Phạm Tiến",
      "available": true
    },
    "date": "2025-10-20",
    "time": "09:30:00",
    "status": "CHO_THANH_TOAN",
    "symptoms": "Đau đầu, mệt mỏi, mất ngủ",
    "qr": null,
    "totalAmount": 6000
  },
  "message": "Appointment booked successfully"
}

trường hợp nếu có healthPlanResponse thì doctorResponse sẽ là null
{
  "data": {
    "id": 41,
    "patientResponse": {
      "id": 5,
      "code": "BN1757508991380",
      "bloodType": "A",
      "weight": 65.50,
      "height": 170.20,
      "registrationDate": "2025-09-10T19:56:32",
      "fullName": "Nguyen Van A",
      "phone": "0395527082",
      "address": "123 Đường ABC, Quận 1, TP.HCM",
      "cccd": "012345678901",
      "birth": "1995-08-15",
      "gender": "NAM",
      "profileImage": "https://example.com/images/patient123.jpg",
      "relationship": null,
      "email": null,
      "verified": false
    },
    "healthPlanResponse": {
      "id": 2,
      "name": "Khám Khoa Nội tổng hợp",
    },
    "doctorResponse": null,
    "date": "2025-10-20",
    "time": "09:30:00",
    "status": "CHO_THANH_TOAN",
    "symptoms": "Đau đầu, mệt mỏi, mất ngủ",
    "qr": null,
    "totalAmount": 2000.00
  },
  "message": "Appointment booked successfully"
}
```


### 2.1 Đặt lịch hẹn
**Endpoint:** `GET /api/appointments/{id}`

**Mô tả:** Lấy lịch hẹn



**Response:**
```json
{
  "data": {
    "id": 39,
    "patientResponse": {
      "id": 5,
      "code": "BN1757508991380",
      "bloodType": "A",
      "weight": 65.50,
      "height": 170.20,
      "registrationDate": "2025-09-10T19:56:32",
      "fullName": "Nguyen Van A",
      "phone": "0395527082",
      "address": "123 Đường ABC, Quận 1, TP.HCM",
      "cccd": "012345678901",
      "birth": "1995-08-15",
      "gender": "NAM",
      "profileImage": "https://example.com/images/patient123.jpg",
      "relationship": null,
      "email": null,
      "verified": false
    },
    "healthPlanResponse": null,
    "doctorResponse": {
      "id": 1,
      "fullName": "tien",
      "position": "PGS. Phạm Tiến",
      "available": true
    },
    "date": "2025-10-20",
    "time": "09:00:00",
    "status": "CHO_THANH_TOAN",
    "symptoms": "Đau họng",
    "qr": "123312312",
    "invoiceCode": "HD1234"
    "totalAmount": 0
  },
  "message": "success"
}
```


### API tạo QR thanh toán
**api** /api/payments/appointment/{id}

response
{
  "data": {
    "invoiceId": 240,
    "qrCode": "00020101021238570010A000000727012700069704220113VQRQAEWAE97710208QRIBFTTA5303704540460005802VN62090805DLK4063044039",
    "orderCode": 1760949247
  },
  "message": "Payment link created successfully"
}

### API lấy danh sách bệnh nhân liên kết với tài khoản
**api** /api/patients/relationships

response
{
  "data": [
    {
      "id": 7,
      "code": "BN1757509934308",
      "bloodType": "O",
      "weight": 60.50,
      "height": 176.20,
      "registrationDate": "2025-09-10T20:12:14",
      "fullName": "Pham ngoc C",
      "phone": null,
      "address": "123 Đường ABC, Quận 1, TP.HN",
      "cccd": "012345678901",
      "birth": "1994-08-15",
      "gender": "NU",
      "profileImage": "https://example.com/images/patient123.jpg",
      "relationship": "Con",
      "email": null,
      "verified": true
    },
    {
      "id": 8,
      "code": "BN1757510034808",
      "bloodType": "O",
      "weight": 60.50,
      "height": 176.20,
      "registrationDate": "2025-09-10T20:13:55",
      "fullName": "Pham ngoc CDEF",
      "phone": null,
      "address": "123 Đường ABC, Quận 1, TP.HN",
      "cccd": "012345678901",
      "birth": "1994-08-15",
      "gender": "NU",
      "profileImage": "https://example.com/images/patient123.jpg",
      "relationship": "Vợ",
      "email": null,
      "verified": true
    },
    {
      "id": 31,
      "code": "BN1758265290687",
      "bloodType": "O",
      "weight": 60.50,
      "height": 176.20,
      "registrationDate": "2025-09-19T14:01:33",
      "fullName": "Pham ngoc Tuan",
      "phone": "0395527225",
      "address": "PHU DIEN HUU HOA THANH TRI TP.HN",
      "cccd": "001204020080",
      "birth": "2030-08-15",
      "gender": "NAM",
      "profileImage": "https://example.com/images/patient123.jpg",
      "relationship": "Em",
      "email": null,
      "verified": true
    },
    {
      "id": 65,
      "code": "BN1760453617934",
      "bloodType": "B-",
      "weight": 13.00,
      "height": 123.00,
      "registrationDate": "2025-10-14T21:53:38",
      "fullName": "mạnh sĩ béo ngậy",
      "phone": null,
      "address": "haf nooij",
      "cccd": "1233059483",
      "birth": "2025-10-08",
      "gender": "NAM",
      "profileImage": null,
      "relationship": "Người thân",
      "email": null,
      "verified": true
    }
  ],
  "message": "Get all patients successfully"
}



### 4.1 Lấy danh sách bác sĩ
**Endpoint:** `GET /api/doctors`

**Mô tả:** Lấy danh sách tất cả bác sĩ

**Response:**
```json
{
  "data": [
        {
            "id": 3,
            "fullName": "BS. PHAM VAN TIEN",
            "position": "ThS. PHAM VAN TIEN",
            "examinationFee": 4000,
            "available": true,
            "roomNumber": "101A",
            "roomName": "Phòng khám Nội tổng quát"
        },
        {
            "id": 23,
            "fullName": "BS. TRAN VAN T",
            "position": "ThS. TRAN VAN T",
            "examinationFee": 4000,
            "available": true,
            "roomNumber": "101A",
            "roomName": "Phòng khám Nội tổng quát"
        },
  ],
  "message": "Fetched all doctors successfully"
}
```
### 6.1 Lấy danh sách dịch vụ
**Endpoint:** `GET /api/services`

**Mô tả:** Lấy danh sách các gói khám/dịch vụ

**Query Parameters:**
- `keyword` (optional): Từ khóa tìm kiếm

**Response:**
```json
[
    {
        "id": 11,
        "code": "DV-XN-CBC",
        "name": "Xét nghiệm công thức máu",
        "price": 5000.0,
        "description": "CBC, lấy máu tĩnh mạch",
        "roomNumber": "101A",
        "roomName": "Phòng khám Nội tổng quát",
        "type": "XET_NGHIEM"
    },
    {
        "id": 2,
        "code": "DV-XN-MAU",
        "name": "Xét nghiệm máu cơ bản",
        "price": 2000.0,
        "description": "Xét nghiệm máu cơ bản",
        "roomNumber": "204A",
        "roomName": "Phòng xét nghiệm ",
        "type": "XET_NGHIEM"
    }
]
```


### API để lấy lịch hợp lệ đặt lịch
/api/schedules/available
**Query Parameters:**
- `startDate` (required): Ngày bắt đầu (yyyy-MM-dd)
- `endDate` (required): Ngày kết thúc (yyyy-MM-dd)
- `doctorId` (optional): ID bác sĩ
- `shift` (optional): Ca làm việc (MORNING, AFTERNOON, EVENING)


### Chọn bác sĩ trước và sau đấy bấm ngày để  lấy lịch làm
### startDate = 2025-10-21, endDate = 2025-10-27, doctorId = 1
{
  "data": [
    {
      "date": "2025-10-21",
      "dateName": "TUESDAY",
      "totalSlot": 2,
      "doctors": [
        {
          "id": 1,
          "fullName": "tien",
          "position": "PGS. Phạm Tiến",
          "available": true,
          "invalidTimes": [
            "09:00:00",
            "09:30:00"
          ],
          "shift": "SANG"
        },
        {
          "id": 1,
          "fullName": "tien",
          "position": "PGS. Phạm Tiến",
          "available": true,
          "invalidTimes": [
            "15:00:00"
          ],
          "shift": "CHIEU"
        }
      ]
    },
    {
      "date": "2025-10-22",
      "dateName": "WEDNESDAY",
      "totalSlot": 2,
      "doctors": [
        {
          "id": 1,
          "fullName": "tien",
          "position": "PGS. Phạm Tiến",
          "available": true,
          "invalidTimes": [],
          "shift": "SANG"
        },
        {
          "id": 1,
          "fullName": "tien",
          "position": "PGS. Phạm Tiến",
          "available": true,
          "invalidTimes": [],
          "shift": "CHIEU"
        }
      ]
    },
    {
      "date": "2025-10-23",
      "dateName": "THURSDAY",
      "totalSlot": 2,
      "doctors": [
        {
          "id": 1,
          "fullName": "tien",
          "position": "PGS. Phạm Tiến",
          "available": true,
          "invalidTimes": [],
          "shift": "SANG"
        },
        {
          "id": 1,
          "fullName": "tien",
          "position": "PGS. Phạm Tiến",
          "available": true,
          "invalidTimes": [],
          "shift": "CHIEU"
        }
      ]
    },
    {
      "date": "2025-10-24",
      "dateName": "FRIDAY",
      "totalSlot": 2,
      "doctors": [
        {
          "id": 1,
          "fullName": "tien",
          "position": "PGS. Phạm Tiến",
          "available": true,
          "invalidTimes": [],
          "shift": "SANG"
        },
        {
          "id": 1,
          "fullName": "tien",
          "position": "PGS. Phạm Tiến",
          "available": true,
          "invalidTimes": [],
          "shift": "CHIEU"
        }
      ]
    },
    {
      "date": "2025-10-25",
      "dateName": "SATURDAY",
      "totalSlot": 1,
      "doctors": [
        {
          "id": 1,
          "fullName": "tien",
          "position": "PGS. Phạm Tiến",
          "available": true,
          "invalidTimes": [],
          "shift": "SANG"
        }
      ]
    },
    {
      "date": "2025-10-26",
      "dateName": "SUNDAY",
      "totalSlot": 0,
      "doctors": []
    },
    {
      "date": "2025-10-27",
      "dateName": "MONDAY",
      "totalSlot": 2,
      "doctors": [
        {
          "id": 1,
          "fullName": "tien",
          "position": "PGS. Phạm Tiến",
          "available": true,
          "invalidTimes": [],
          "shift": "SANG"
        },
        {
          "id": 1,
          "fullName": "tien",
          "position": "PGS. Phạm Tiến",
          "available": true,
          "invalidTimes": [],
          "shift": "CHIEU"
        }
      ]
    }
  ],
  "message": "get available slots success"
}


### Chọn ngày cụ thể  startDate = 2025-10-21 = endDate, doctorId = 1
{
  "data": [
    {
      "date": "2025-10-21",
      "dateName": "TUESDAY",
      "totalSlot": 2,
      "doctors": [
        {
          "id": 1,
          "fullName": "tien",
          "position": "PGS. Phạm Tiến",
          "available": true,
          "invalidTimes": [
            "09:00:00",
            "09:30:00"
          ],
          "shift": "SANG"
        },
        {
          "id": 1,
          "fullName": "tien",
          "position": "PGS. Phạm Tiến",
          "available": true,
          "invalidTimes": [
            "15:00:00"
          ],
          "shift": "CHIEU"
        }
      ]
    }
  ],
  "message": "get available slots success"
}



### Chọn ngày và giờ trước start startDate = 2025-10-21 = endDate, shift = SANG
{
  "data": [
    {
      "date": "2025-10-26",
      "dateName": "SUNDAY",
      "totalSlot": 10,
      "doctors": [
        {
          "id": 3,
          "fullName": "BS. PHAM VAN TIEN",
          "position": "ThS. PHAM VAN TIEN",
          "available": true,
          "invalidTimes": [],
          "shift": "SANG"
        },
        {
          "id": 6,
          "fullName": "BS. LE VAN C",
          "position": "BSCKI. LE VAN C",
          "available": true,
          "invalidTimes": [],
          "shift": "SANG"
        },
        {
          "id": 9,
          "fullName": "BS. BUI THI F",
          "position": "TS. BUI THI F",
          "available": true,
          "invalidTimes": [],
          "shift": "SANG"
        },
        {
          "id": 13,
          "fullName": "BS. NGUYEN VAN J",
          "position": "ThS. NGUYEN VAN J",
          "available": true,
          "invalidTimes": [],
          "shift": "SANG"
        },
        {
          "id": 18,
          "fullName": "BS. BUI THI O",
          "position": "ThS. BUI THI O",
          "available": true,
          "invalidTimes": [],
          "shift": "SANG"
        },
        {
          "id": 22,
          "fullName": "BS. NGUYEN THI S",
          "position": "TS. NGUYEN THI S",
          "available": true,
          "invalidTimes": [],
          "shift": "SANG"
        },
        {
          "id": 24,
          "fullName": "BS. LE THI U",
          "position": "BSCKI. LE THI U",
          "available": true,
          "invalidTimes": [],
          "shift": "SANG"
        },
        {
          "id": 26,
          "fullName": "BS. DO THI W",
          "position": "ThS. DO THI W",
          "available": true,
          "invalidTimes": [],
          "shift": "SANG"
        },
        {
          "id": 28,
          "fullName": "BS. NGO THI Y",
          "position": "BSCKI. NGO THI Y",
          "available": true,
          "invalidTimes": [],
          "shift": "SANG"
        },
        {
          "id": 31,
          "fullName": "BS. TRAN VAN BB",
          "position": "BSCKI. TRAN VAN BB",
          "available": true,
          "invalidTimes": [],
          "shift": "SANG"
        }
      ]
    }
  ],
  "message": "get available slots success"
}


