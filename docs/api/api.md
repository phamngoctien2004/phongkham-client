# API Documentation - Hệ thống Quản lý Phòng khám

## Mục lục
1. [Authentication API](#1-authentication-api)
2. [Appointment API](#2-appointment-api)
3. [Department API](#3-department-api)
4. [Doctor API](#4-doctor-api)
5. [Patient API](#5-patient-api)
6. [Health Plan (Services) API](#6-health-plan-services-api)
7. [Medical Record API](#7-medical-record-api)
8. [Prescription API](#8-prescription-api)
9. [Medicine API](#9-medicine-api)
10. [Lab Order API](#10-lab-order-api)
11. [Lab Result API](#11-lab-result-api)
12. [Invoice API](#12-invoice-api)
13. [Payment API](#13-payment-api)
14. [Schedule API](#14-schedule-api)
15. [Receptionist API](#15-receptionist-api)
16. [User API](#16-user-api)
17. [HTML Export API](#17-html-export-api)

---

## 1. Authentication API

### Base URL: `/api/auth`

### 1.1 Đăng nhập (Login)
**Endpoint:** `POST /api/auth/login`

**Mô tả:** Đăng nhập cho bệnh nhân

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "type": "PASSWORD" // hoặc "OTP"
}
```

**Response:**
```json
{
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaXNzIjoiVElFTi1ERVYtSkFWQSIsImF1ZCI6ImxvY2FsaG9zdDo4MDgwIiwiaWF0IjoxNzYxMDMwNzkyLCJleHAiOjE3NjEwMzQzOTIsInJvbGUiOiJCRU5IX05IQU4ifQ.jrBwyXvox3TIgIrwZMqvlY5XSvEMrPWUCRp_X2KekVw",
        "userResponse": {
            "id": 1,
            "email": "tienolympia2020@gmail.com",
            "phone": "0395527082",
            "name": "Nguyen Van A",
            "role": "BENH_NHAN",
            "status": true,
            "createdAt": "2025-09-09T08:58:19",
            "createdPassword": false
        }
    },
    "message": "Login successful"
}
```

---

---

### 1.3 Gửi OTP
**Endpoint:** `POST /api/auth/send-otp`

**Mô tả:** Gửi mã OTP để đăng nhập hoặc xác thực

**Request Body:**
```json
{
    "to": "0395527082"
}
```

**Response:**
```json
{
    "data": "",
    "message": "Send OTP successful"
}
```

---

### 1.4 Gửi OTP đăng ký
**Endpoint:** `POST /api/auth/register-otp`

**Mô tả:** Gửi mã OTP cho quá trình đăng ký tài khoản mới

**Request Body:**
```json
{
    "to": "0000000092"
}
```

**Response:**
```json
{
    "data": "",
    "message": "Send OTP successful"
}

```

---

### 1.5 Xác thực OTP
**Endpoint:** `POST /api/auth/verify-otp`

**Mô tả:** Xác thực mã OTP

**Request Body:**
```json
{
    "phone": "0000000092",
    "otp": "469300"
}
```

**Response:**
```json
{
    "data": true,
    "message": "Verify OTP successful"
}
```

---

### 1.6 Đăng ký tài khoản
**Endpoint:** `POST /api/auth/register`

**Mô tả:** Đăng ký tài khoản 

**Request Body:**
```json
{
    "phone": "0868224097",
    "email": "adsfsadf@gmail.com",
    "name": "Tien dep trai",
    "birth": "2025-02-01",
    "gender": "NAM",
    "password": "1234567",
    "confirmPassword": "1234567"
}
```

**Response:**
```json
{
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMDUiLCJpc3MiOiJUSUVOLURFVi1KQVZBIiwiYXVkIjoibG9jYWxob3N0OjgwODAiLCJpYXQiOjE3NjEwMzEwMDYsImV4cCI6MTc2MTA2NzAwNiwicm9sZSI6IkJFTkhfTkhBTiJ9.Ho7koLvh-HWbSFEbp9tr3V0KWpmTh2d8aPga-QfA59Q",
        "userResponse": {
            "id": 105,
            "email": "dddd@gmail.com",
            "phone": "0868224097",
            "name": "Tien dep trai",
            "role": "BENH_NHAN",
            "status": true,
            "createdAt": "2025-10-21T14:16:46.505991",
            "createdPassword": false
        }
    },
    "message": "Register successful"
}
```
### 1.7 Đổi mật khẩu
**Endpoint:** `POST /api/auth/reset-password`

**Mô tả:** Đổi mật khẩu

**Request Body:**
```json
{
    "userId": 1,
    "oldPassword": "dskalfjlaskdf",
    "name": "Tien dep trai",
    "password": "1234456",
    "confirmPassword": "1234456",
}
```

```
---

## 2. Appointment API

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
  "data": "",
  "message": "Appointment booked successfully"
}
```

---

### 2.2 Lấy danh sách lịch hẹn
**Endpoint:** `GET /api/appointments`

**Mô tả:** Lấy danh sách lịch hẹn theo bộ lọc

**Query Parameters:**
- `phone` (optional): Số điện thoại để tìm kiếm
- `date` (optional): Ngày khám (format: yyyy-MM-dd)
- `status` (optional): Trạng thái (DA_XAC_NHAN, KHONG_DEN, DANG_KHAM)
- `limit`
- `page`
**Response:**
```json
{
    "data": {
        "content": [
            {
                "id": 13,
                "fullName": "Tokuda",
                "phone": "0395527082",
                "gender": null,
                "birth": "2000-11-20",
                "email": "nguyenvana@example.com",
                "address": "123 Đường ABC, Quận 1, TP.HN",
                "healthPlanResponse": {
                    "id": 3,
                    "name": "X-quang phổi",
                    "price": 0.0
                },
                "doctorResponse": null,
                "departmentResponse": null,
                "date": "2025-09-22",
                "time": "07:00:00",
                "status": "DA_DEN",
                "symptoms": "Đau đầu, chóng mặt trong 2 ngày",
                "patientId": 15
            },
            {
                "id": 18,
                "fullName": "shaka",
                "phone": "0395527082",
                "gender": null,
                "birth": "2000-11-20",
                "email": "nguyenvana@example.com",
                "address": "123 Đường ABC, Quận 1, TP.HN",
                "healthPlanResponse": null,
                "doctorResponse": {
                    "id": 4,
                    "position": "TS. NGUYEN VAN A",
                    "available": true
                },
                "departmentResponse": {
                    "id": 2,
                    "name": "Khoa Ngoại tổng quát"
                },
                "date": "2025-09-22",
                "time": "07:00:00",
                "status": "DA_DEN",
                "symptoms": "Đau đầu, chóng mặt trong 2 ngày",
                "patientId": 10
            },
            {
                "id": 19,
                "fullName": "NPham Ngoc Tien",
                "phone": "0395527082",
                "gender": null,
                "birth": "2000-11-20",
                "email": "nguyenvana@example.com",
                "address": "123 Đường ABC, Quận 1, TP.HN",
                "healthPlanResponse": null,
                "doctorResponse": {
                    "id": 4,
                    "position": "TS. NGUYEN VAN A",
                    "available": true
                },
                "departmentResponse": {
                    "id": 2,
                    "name": "Khoa Ngoại tổng quát"
                },
                "date": "2025-09-22",
                "time": "07:00:00",
                "status": "DA_DEN",
                "symptoms": "Đau đầu, chóng mặt trong 2 ngày",
                "patientId": 15
            },
            {
                "id": 20,
                "fullName": "NPham Ngoc Tien",
                "phone": "1234567890",
                "gender": null,
                "birth": "2000-11-20",
                "email": "nguyenvanb@example.com",
                "address": "123 Đường ABC, Quận 1, TP.HN",
                "healthPlanResponse": null,
                "doctorResponse": {
                    "id": 10,
                    "position": "PGS.TS. HOANG VAN G",
                    "available": true
                },
                "departmentResponse": {
                    "id": 2,
                    "name": "Khoa Ngoại tổng quát"
                },
                "date": "2025-09-22",
                "time": "07:00:00",
                "status": "DA_DEN",
                "symptoms": "Đau đầu, chóng mặt trong 2 ngày",
                "patientId": 14
            },
            {
                "id": 22,
                "fullName": "NPham Ngoc Tien",
                "phone": "1234567891",
                "gender": null,
                "birth": "2000-11-20",
                "email": "nguyenvaffnb@example.com",
                "address": "123 Đường ABC, Quận 1, TP.HN",
                "healthPlanResponse": {
                    "id": 10,
                    "name": "GOI DICH VU SIEU CAP VU TRU TAI NHA TAN RANG",
                    "price": 0.0
                },
                "doctorResponse": {
                    "id": 10,
                    "position": "PGS.TS. HOANG VAN G",
                    "available": true
                },
                "departmentResponse": null,
                "date": "2025-09-22",
                "time": "07:00:00",
                "status": "DA_DEN",
                "symptoms": "Đau đầu, chóng mặt trong 2 ngày",
                "patientId": 15
            },
            {
                "id": 23,
                "fullName": "NPham Ngoc Tien",
                "phone": "0395527082",
                "gender": null,
                "birth": "2000-11-20",
                "email": "nguyenvab@example.com",
                "address": "123 Đường ABC, Quận 1, TP.HN",
                "healthPlanResponse": null,
                "doctorResponse": {
                    "id": 10,
                    "position": "PGS.TS. HOANG VAN G",
                    "available": true
                },
                "departmentResponse": null,
                "date": "2025-09-22",
                "time": "07:00:00",
                "status": "DA_DEN",
                "symptoms": "Đau đầu, chóng mặt trong 2 ngày",
                "patientId": 5
            },
            {
                "id": 24,
                "fullName": "NPham Ngoc Tien",
                "phone": "0395527086",
                "gender": null,
                "birth": "2000-11-20",
                "email": "nguyenvab@example.com",
                "address": "123 Đường ABC, Quận 1, TP.HN",
                "healthPlanResponse": null,
                "doctorResponse": {
                    "id": 10,
                    "position": "PGS.TS. HOANG VAN G",
                    "available": true
                },
                "departmentResponse": null,
                "date": "2025-09-22",
                "time": "07:00:00",
                "status": "DA_DEN",
                "symptoms": "Đau đầu, chóng mặt trong 2 ngày",
                "patientId": 16
            },
            {
                "id": 25,
                "fullName": "hehe",
                "phone": "0395527023",
                "gender": null,
                "birth": "2000-11-20",
                "email": "nguyenv22ab@example.com",
                "address": "123 Đường ABC, Quận 1, TP.HN",
                "healthPlanResponse": {
                    "id": 10,
                    "name": "GOI DICH VU SIEU CAP VU TRU TAI NHA TAN RANG",
                    "price": 0.0
                },
                "doctorResponse": null,
                "departmentResponse": null,
                "date": "2025-09-22",
                "time": "07:00:00",
                "status": "DA_DEN",
                "symptoms": "Đau đầu, chóng mặt trong 2 ngày",
                "patientId": 18
            },
            {
                "id": 26,
                "fullName": "NPham Ngoc Tien",
                "phone": "0395527011",
                "gender": null,
                "birth": "2000-11-20",
                "email": "tienhvnhgpt@gmail.com",
                "address": "123 Đường ABC, Quận 1, TP.HN",
                "healthPlanResponse": null,
                "doctorResponse": null,
                "departmentResponse": null,
                "date": "2025-09-22",
                "time": "07:00:00",
                "status": "DA_DEN",
                "symptoms": "Đau đầu, chóng mặt trong 2 ngày",
                "patientId": 19
            },
            {
                "id": 27,
                "fullName": "NPham Ngoc Tien",
                "phone": "0395527011",
                "gender": null,
                "birth": "2000-11-20",
                "email": "tienhvnhgpt@gmail.com",
                "address": "123 Đường ABC, Quận 1, TP.HN",
                "healthPlanResponse": null,
                "doctorResponse": null,
                "departmentResponse": null,
                "date": "2025-09-22",
                "time": "07:00:00",
                "status": "DA_DEN",
                "symptoms": "Đau đầu, chóng mặt trong 2 ngày",
                "patientId": 19
            }
        ],
        "pageable": {
            "pageNumber": 0,
            "pageSize": 10,
            "sort": {
                "sorted": false,
                "unsorted": true,
                "empty": true
            },
            "offset": 0,
            "paged": true,
            "unpaged": false
        },
        "totalPages": 2,
        "totalElements": 18,
        "last": false,
        "size": 10,
        "number": 0,
        "sort": {
            "sorted": false,
            "unsorted": true,
            "empty": true
        },
        "first": true,
        "numberOfElements": 10,
        "empty": false
    },
    "message": "success"
}
```
### Lấy danh sách lịch hẹn của tôi
**Endpoint:** `GET /api/appointments/me`

**Mô tả:** Lấy danh sách lịch hẹn theo bộ lọc

**Query Parameters:**
- `date` (optional): Ngày khám (format: yyyy-MM-dd)
- `status` (optional): Trạng thái (DA_XAC_NHAN, KHONG_DEN, DANG_KHAM)
- `limit default = 10`
- `page default = 1`
**Response:**
```json
{
    "data": {
        "content": [
            {
                "id": 38,
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
                    "position": "PGS. Phạm Tiến",
                    "available": true
                },
                "date": "2025-10-21",
                "time": "15:00:00",
                "status": "DA_XAC_NHAN",
                "symptoms": "Đau họng",
                "qr": null,
                "invoiceCode": "",
                "totalAmount": 0
            },
            {
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
                    "position": "PGS. Phạm Tiến",
                    "available": true
                },
                "date": "2025-10-21",
                "time": "09:00:00",
                "status": "HUY",
                "symptoms": "Đau họng",
                "qr": "123312312",
                "invoiceCode": "",
                "totalAmount": 0
            },
            {
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
                    "position": "PGS. Phạm Tiến",
                    "available": true
                },
                "date": "2025-10-21",
                "time": "09:30:00",
                "status": "HUY",
                "symptoms": "Đau đầu, mệt mỏi, mất ngủ",
                "qr": "00020101021238570010A000000727012700069704220113VQRQAEWAE97710208QRIBFTTA5303704540460005802VN62090805DLK4063044039",
                "invoiceCode": "",
                "totalAmount": 6000
            },
            {
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
                    "name": "Khám Khoa Nội tổng hợp"
                },
                "doctorResponse": null,
                "date": "2025-10-21",
                "time": "10:30:00",
                "status": "HUY",
                "symptoms": "Đau đầu, mệt mỏi, mất ngủ",
                "qr": null,
                "invoiceCode": "",
                "totalAmount": 2000
            }
        ],
        "pageable": {
            "pageNumber": 0,
            "pageSize": 10,
            "sort": {
                "sorted": false,
                "unsorted": true,
                "empty": true
            },
            "offset": 0,
            "paged": true,
            "unpaged": false
        },
        "totalPages": 1,
        "totalElements": 4,
        "last": true,
        "size": 10,
        "number": 0,
        "sort": {
            "sorted": false,
            "unsorted": true,
            "empty": true
        },
        "first": true,
        "numberOfElements": 4,
        "empty": false
    },
    "message": "success"
}
```
---

### 2.3 Xác nhận/Thay đổi trạng thái lịch hẹn
**Endpoint:** `PUT /api/appointments/confirm`

**Mô tả:** Xác nhận hoặc thay đổi trạng thái lịch hẹn

**Request Body:**
```json
{
  "id": 1,
  "status": "DA_XAC_NHAN" // DA_XAC_NHAN, KHONG_DEN, DANG_KHAM
}
```

**Response:**
```json
{
  "data": "",
  "message": "Appointment confirmed successfully"
}
```

---

## 3. Department API

### Base URL: `/api/departments`

### 3.1 Lấy danh sách khoa
**Endpoint:** `GET /api/departments`

**Mô tả:** Lấy tất cả các khoa trong bệnh viện

**Response:**
```json
[
    {
        "id": 1,
        "name": "Khoa Nội tổng hợp",
        "phone": "0901234567",
        "description": "Khám và điều trị các bệnh lý nội khoa"
    },
    {
        "id": 2,
        "name": "Khoa Ngoại tổng quát",
        "phone": "0902345678",
        "description": "Phẫu thuật và điều trị các bệnh ngoại khoa"
    },
    {
        "id": 3,
        "name": "Khoa Nhi",
        "phone": "0903456789",
        "description": "Khám và điều trị bệnh cho trẻ em"
    },
    {
        "id": 4,
        "name": "Khoa Sản",
        "phone": "0904567890",
        "description": "Khám thai, sinh đẻ và chăm sóc sức khỏe sinh sản"
    },
    {
        "id": 5,
        "name": "Khoa Tim mạch",
        "phone": "0905678901",
        "description": "Khám và điều trị các bệnh về tim mạch"
    },
    {
        "id": 6,
        "name": "Khoa Mắt",
        "phone": "0906789012",
        "description": "Khám và điều trị các bệnh lý về mắt"
    },
    {
        "id": 7,
        "name": "Khoa Tai Mũi Họng",
        "phone": "0907890123",
        "description": "Khám và điều trị các bệnh lý về tai, mũi, họng"
    },
    {
        "id": 8,
        "name": "Khoa Răng Hàm Mặt",
        "phone": "0908901234",
        "description": "Khám và điều trị các bệnh lý về răng, hàm, mặt"
    },
    {
        "id": 9,
        "name": "Khoa Da liễu",
        "phone": "0909012345",
        "description": "Khám và điều trị các bệnh ngoài da"
    },
    {
        "id": 10,
        "name": "Khoa Xét nghiệm",
        "phone": "0910123456",
        "description": "Thực hiện các xét nghiệm máu, sinh hóa, vi sinh"
    }
]
```

---

### 3.2 Lấy danh sách bác sĩ theo khoa
**Endpoint:** `GET /api/departments/{id}/doctors`

**Mô tả:** Lấy danh sách bác sĩ thuộc một khoa cụ thể

**Path Parameters:**
- `id`: ID của khoa

**Response:**
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
    },
    {
        "id": 25,
        "position": "TS. PHAM VAN V",
        "examinationFee": 5000,
        "available": true,
        "roomNumber": "103A",
        "roomName": "Phòng khám Nhi khoa"
    }
]
```

---

## 4. Doctor API

### Base URL: `/api/doctors`

### 4.1 Lấy danh sách bác sĩ
**Endpoint:** `GET /api/doctors`

**Mô tả:** Lấy danh sách tất cả bác sĩ

**Response:**
```json
{
  "data": [
        {
            "id": 4,
            "fullName": "BS. NGUYEN VAN A",
            "degreeResponse": {
                "degreeId": 3,
                "degreeName": "Bác sĩ Chuyên khoa II",
                "examinationFee": 5000
            },
            "departmentResponse": {
                "id": 3,
                "name": "abc"
            }
            "position": "TS. NGUYEN VAN A",
            "examinationFee": 5000,
            "available": true,
            "roomNumber": "101A",
            "roomName": "Phòng khám Nội tổng quát"
        },
        {
            "id": 23,
            "fullName": "BS. TRAN VAN T",
            "degreeResponse": {
                "degreeId": 2,
                "degreeName": "Thạc sĩ Y học",
                "examinationFee": 4000
            },
              "departmentResponse": {
                "id": 3,
                "name": "abc"
            }
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

### Api lấy danh sách bằng cấp

**Endpoint:** `GET /api/degrees`
response
{
    "data": [
        {
            "degreeId": 1,
            "degreeName": "Bác sĩ Chuyên khoa I",
            "examinationFee": 3000
        },
        {
            "degreeId": 2,
            "degreeName": "Thạc sĩ Y học",
            "examinationFee": 4000
        },
        {
            "degreeId": 3,
            "degreeName": "Bác sĩ Chuyên khoa II",
            "examinationFee": 5000
        },
        {
            "degreeId": 4,
            "degreeName": "Tiến sĩ Y học",
            "examinationFee": 6000
        },
        {
            "degreeId": 5,
            "degreeName": "Phó Giáo sư",
            "examinationFee": 6000
        },
        {
            "degreeId": 6,
            "degreeName": "Giáo sư",
            "examinationFee": 6000
        }
    ],
    "message": "Fetched all degrees successfully"
}

---

### 4.2 Lấy thông tin bác sĩ hiện tại
**Endpoint:** `GET /api/doctors/me`

**Mô tả:** Lấy thông tin của bác sĩ đang đăng nhập

**Headers:**
- `Authorization`: Bearer {token}

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "Dr. Nguyễn Văn A",
    "specialization": "string",
    "departmentName": "string",
    "phone": "string",
    "email": "string"
  },
  "message": "Fetched my info successfully"
}
```

---

## 5. Patient API

### Base URL: `/api/patients`

### 5.1 Tạo bệnh nhân mới
**Endpoint:** `POST /api/patients`

**Mô tả:** Tạo hồ sơ bệnh nhân mới

**Request Body:**
```json
{
  "phone": null,
  "email": null,
  "fullName": "Pham ngoc Tuan",
  "address": "PHU DIEN HUU HOA THANH TRI TP.HN",
  "cccd": "001204020080",
  "birth": "2030-08-15",
  "gender": "NAM",
  "bloodType": "O",
  "weight": 60.5,
  "height": 176.2,
  "profileImage": "https://example.com/images/patient123.jpg",
  "phoneLink": "0395527333"
}

// phone hoặc phone link đều có thể null (nhưng bắt buộc là cả 2 không được null
```

**Response:**
```json
{
    "data": {
        "id": 61,
        "code": "BN1760451103531",
        "bloodType": "O",
        "weight": 60.5,
        "height": 176.2,
        "registrationDate": "2025-10-14T21:11:43.540331",
        "fullName": "Pham ngoc Tuan",
        "phone": null,
        "address": "PHU DIEN HUU HOA THANH TRI TP.HN",
        "cccd": "001204020030",
        "birth": "2030-08-15",
        "gender": "NAM",
        "profileImage": "https://example.com/images/patient123.jpg",
        "relationship": null,
        "email": null,
        "verified": false
    },
    "message": "Create patient successfully"
}
```

---

### 5.2 Tìm kiếm bệnh nhân
**Endpoint:** `GET /api/patients`

**Mô tả:** Tìm kiếm bệnh nhân theo từ khóa

**Query Parameters:**
- `keyword` (optional): Từ khóa tìm kiếm (tên, số điện thoại, CCCD)
- `limit, page(default = 1)`
**Response:**
{
    "data": {
        "content": [
            {
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
            {
                "id": 6,
                "code": "BN1757509031888",
                "bloodType": "B",
                "weight": 60.50,
                "height": 176.20,
                "registrationDate": "2025-09-10T19:57:13",
                "fullName": "Nguyen Van B",
                "phone": null,
                "address": "ha noi",
                "cccd": "111204020011",
                "birth": "1994-08-15",
                "gender": "NU",
                "profileImage": "https://example.com/images/patient123.jpg",
                "relationship": null,
                "email": null,
                "verified": false
            },
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
                "relationship": null,
                "email": null,
                "verified": false
            }
        ],
        "pageable": {
            "pageNumber": 0,
            "pageSize": 3,
            "sort": {
                "sorted": false,
                "unsorted": true,
                "empty": true
            },
            "offset": 0,
            "paged": true,
            "unpaged": false
        },
        "totalPages": 15,
        "totalElements": 43,
        "last": false,
        "first": true,
        "size": 3,
        "number": 0,
        "sort": {
            "sorted": false,
            "unsorted": true,
            "empty": true
        },
        "numberOfElements": 3,
        "empty": false
    },
    "message": "Find patient successfully"
}

---

### 5.3 Lấy thông tin bệnh nhân theo ID
**Endpoint:** `GET /api/patients/{id}`

**Mô tả:** Lấy chi tiết thông tin bệnh nhân

**Path Parameters:**
- `id`: ID của bệnh nhân

**Response:**
```json
{
    "data": {
        "id": 15,
        "code": "BN1758111539103",
        "bloodType": null,
        "weight": null,
        "height": null,
        "registrationDate": "2025-09-17T19:18:59",
        "fullName": "NPham Ngoc Tien",
        "phone": "0000000092",
        "address": "123 Đường ABC, Quận 1, TP.HN",
        "cccd": null,
        "birth": "2000-11-20",
        "gender": "NAM",
        "profileImage": null,
        "relationship": null,
        "email": null,
        "verified": false
    },
    "message": "Find patient successfully"
}
```

---

### 5.4 Cập nhật thông tin bệnh nhân
**Endpoint:** `PUT /api/patients`

**Mô tả:** Cập nhật thông tin bệnh nhân

**Request Body:**
```json
{
  "id": 49,
  "phone": 1111111111,
  "email": "tuan@gmail.com",
  "fullName": "Pham ngoc Tuan",
  "address": "PHU DIEN HUU HOA THANH TRI TP.HN",
  "cccd": "001204020080",
  "birth": "2030-08-15",
  "gender": "NAM",
  "bloodType": "O",
  "weight": 60.5,
  "height": 176.2,
  "profileImage": "https://example.com/images/patient123.jpg"
}
```

**Response:**
```json
{
    "data": {
        "id": 49,
        "code": "BN1758267777182",
        "bloodType": "O",
        "weight": 60.5,
        "height": 176.2,
        "registrationDate": "2025-09-19T14:42:57",
        "fullName": "Pham ngoc Tuan",
        "phone": "1111111111",
        "address": "PHU DIEN HUU HOA THANH TRI TP.HN",
        "cccd": "001204020080",
        "birth": "2030-08-15",
        "gender": "NAM",
        "profileImage": null,
        "relationship": null,
        "email": null,
        "verified": false
    },
    "message": "Update patient successfully"
}
```
### Xóa bệnh nhân
**Endpoint:** `DELETE /api/patients/{id}`
---

### 5.5 Lấy thông tin bệnh nhân hiện tại
**Endpoint:** `GET /api/patients/me`

**Mô tả:** Lấy thông tin bệnh nhân đang đăng nhập

**Headers:**
- `Authorization`: Bearer {token}

**Response:**
```json
{
    "data": {
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
        "email": "tienolympia2020@gmail.com",
        "verified": false
    },
    "message": "Get my patient successfully"
}
```

---

### 5.6 Lấy danh sách quan hệ bệnh nhân
**Endpoint:** `GET /api/patients/relationships`

**Mô tả:** Lấy danh sách các bệnh nhân liên quan (gia đình)

**Headers:**
- `Authorization`: Bearer {token}

**Response:**
```json
{
    "data": [
        {
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
            "profileImage": "https://cdn-media.sforum.vn/storage/app/media/thanhhuyen/%E1%BA%A3nh%20s%C6%A1n%20t%C3%B9ng%20mtp/anh-son-tung-mtp-thumb.jpg",
            "relationship": "BAN_THAN",
            "email": null,
            "verified": true
        },
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
            "relationship": "CON",
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
            "relationship": "VO\n",
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
            "relationship": "EM",
            "email": null,
            "verified": true
        }
    ],
    "message": "Get all patients successfully"
}
```

---

### 5.7 Thêm quan hệ bệnh nhân
**Endpoint:** `POST /api/patients/relationships`

**Mô tả:** Thêm bệnh nhân vào danh sách quan hệ (yêu cầu xác thực OTP)

**Request Body:**
```json
{
  "cccd": "string",
  "relationship": "string"
}
```

**Response:**
```json
{
  "data": "",
  "message": "Add relationship successfully"
}
```

---

### 5.8 Xác thực quan hệ bệnh nhân
**Endpoint:** `POST /api/patients/relationships/verify`

**Mô tả:** Xác thực OTP để hoàn tất thêm quan hệ

**Request Body:**
```json
{
  "phone": "string",
  "otp": "string"
}
```

**Response:**
```json
{
  "data": "",
  "message": "Verify relationship successfully"
}
```

---

### 5.9 Xóa quan hệ bệnh nhân
**Endpoint:** `DELETE /api/patients/relationships/{patientId}`

**Mô tả:** Xóa bệnh nhân khỏi danh sách quan hệ

**Path Parameters:**
- `patientId`: ID của bệnh nhân cần xóa

**Response:** 
- Status: 204 No Content

---

## 6. Health Plan (Services) API

### Base URL: `/api/services`

### 6.1 Lấy danh sách dịch vụ
**Endpoint:** `GET /api/services`

**Mô tả:** Lấy danh sách các gói khám/dịch vụ

**Query Parameters:**
- `keyword` (optional): Từ khóa tìm kiếm
- `type`(optional) : DICH_VU, XET_NGHIEM,_CHUYEN_KHOA
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

---

### 6.2 Lấy chi tiết dịch vụ
**Endpoint:** `GET /api/services/{id}`

**Mô tả:** Lấy thông tin chi tiết của một dịch vụ

**Path Parameters:**
- `id`: ID của dịch vụ

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "Khám tổng quát",
    "description": "string",
    "price": 500000,
    "duration": 30,
    "details": []
  },
  "message": "success"
}
```
### 6.2 Lấy chi tiết dịch vụ cho trang chi tiết
**Endpoint:** `GET /api/services/optional/{id}`

**Mô tả:** Lấy thông tin chi tiết của một dịch vụ

**Path Parameters:**
- `id`: ID của dịch vụ

**Response:**
```json
{
    "data": {
        "id": 12,
        "code": "DV_001",
        "name": "Gói khám tổng quát",
        "price": 5000.0,
        "description": "Gói khám sức khỏe tổng quát là chương trình khám sức khỏe toàn diện, giúp phát hiện sớm các bệnh lý tiềm ẩn, đánh giá tình trạng sức khỏe hiện tại, tư vấn chế độ sinh hoạt và phòng ngừa bệnh tật. Gói khám bao gồm: Khám lâm sàng tổng quát (khám nội khoa, đo huyết áp, chiều cao, cân nặng, BMI, mạch, nhiệt độ), khám chuyên khoa (tai mũi họng, mắt, răng hàm mặt). Xét nghiệm máu tổng quát (công thức máu, hồng cầu, bạch cầu, tiểu cầu, hemoglobin), xét nghiệm sinh hóa (đường huyết đói, ure, creatinin, AST, ALT, bilirubin, cholesterol, triglycerid, HDL, LDL), xét nghiệm nước tiểu tổng quát. Chẩn đoán hình ảnh: X-quang phổi, điện tim đồ, siêu âm ổ bụng (gan, mật, tụy, lách, thận). Kết quả khám được bác sĩ chuyên khoa tư vấn chi tiết, giải thích các chỉ số, đưa ra khuyến nghị về chế độ ăn uống, tập luyện, sinh hoạt. Phát hiện sớm các bệnh lý về tim mạch, tiểu đường, gan, thận, ung thư để có phương án điều trị kịp thời. Gói khám phù hợp với mọi đối tượng, đặc biệt khuyến khích cho người trên 35 tuổi, người có tiền sử gia đình mắc bệnh mãn tính. Thời gian khám: khoảng 2-3 giờ, có kết quả đầy đủ trong ngày hoặc 1-2 ngày.",
        "type": "DICH_VU",
        "subPlans": [
            {
                "id": 17,
                "code": "XN_NUOC_TIEU",
                "name": "Xét nghiệm nước tiểu tổng quát",
                "price": 2000.0,
                "description": "Xét nghiệm nước tiểu tổng quát là xét nghiệm đơn giản, không xâm lấn, giúp đánh giá chức năng thận và phát hiện các bệnh lý về đường tiết niệu, chuyển hóa. Xét nghiệm gồm 2 phần: Thử nhanh bằng que thử (test strip): đo pH, tỷ trọng, protein niệu, glucose niệu, ketone, bilirubin, urobilinogen, máu trong nước tiểu, bạch cầu esterase, nitrite. Xét nghiệm vi thể (soi kính hiển vi): đếm số lượng hồng cầu, bạch cầu, biểu mô, trụ (trụ hồng cầu, trụ bạch cầu, trụ hạt), vi khuẩn, nấm men, tinh thể (acid uric, oxalate, phosphate). Xét nghiệm giúp chẩn đoán: nhiễm trùng đường tiết niệu (viêm bàng quang, viêm thận, viêm niệu đạo), sỏi thận, bệnh thận mạn, hội chứng thận hư, viêm cầu thận, đái tháo đường (glucose niệu, ketone niệu), bệnh gan mật (bilirubin niệu), máu trong nước tiểu (do sỏi, u bàng quang, chấn thương). Hướng dẫn lấy mẫu: lấy nước tiểu giữa dòng, rửa sạch vùng kín trước khi lấy mẫu, bỏ phần đầu và phần cuối của dòng tiểu, lấy khoảng 30-50ml nước tiểu vào lọ sạch. Tốt nhất là lấy nước tiểu buổi sáng sớm. Có kết quả trong 1-2 giờ.",
                "type": "XET_NGHIEM"
            },
            {
                "id": 19,
                "code": "XN_DONG_MAU",
                "name": "Xét nghiệm đông máu",
                "price": 2000.0,
                "description": "Xét nghiệm đông máu (coagulation test) đánh giá khả năng đông máu và chống đông của cơ thể, rất quan trọng trước phẫu thuật, theo dõi điều trị thuốc chống đông, chẩn đoán các bệnh lý về đông máu. Các xét nghiệm bao gồm: PT (Prothrombin Time - Thời gian prothrombin): đánh giá con đường đông máu ngoại sinh, bình thường 11-13 giây. INR (International Normalized Ratio): chỉ số chuẩn hóa PT, dùng theo dõi điều trị Warfarin, bình thường 0.8-1.2, mục tiêu điều trị 2-3. APTT (Activated Partial Thromboplastin Time - Thời gian thromboplastin từng phần hoạt hóa): đánh giá con đường đông máu nội sinh, bình thường 25-35 giây. Fibrinogen (yếu tố I): protein đông máu quan trọng, bình thường 200-400 mg/dL. D-Dimer: sản phẩm phân hủy fibrin, tăng cao trong huyết khối tĩnh mạch sâu, th栓 huyết phổi. Thời gian chảy máu (Bleeding time), số lượng tiểu cầu (Platelet count), chức năng tiểu cầu. Xét nghiệm giúp chẩn đoán: bệnh máu di truyền (hemophilia A, B, bệnh Von Willebrand), suy giảm Vitamin K, bệnh gan nặng (giảm tổng hợp các yếu tố đông máu), huyết khối tĩnh mạch sâu, thuyên tắc phổi, DIC (đông máu nội mạch lan tỏa). Theo dõi điều trị: thuốc chống đông (Warfarin, Heparin), đánh giá trước và sau phẫu thuật. Không cần nhịn đói, lấy máu tĩnh mạch vào ống chứa Citrate (nắp xanh). Có kết quả trong 2-4 giờ.",
                "type": "XET_NGHIEM"
            },
            {
                "id": 24,
                "code": "ECG",
                "name": "Điện tim đồ (ECG)",
                "price": 2000.0,
                "description": "Điện tim đồ (ECG - Electrocardiogram) là xét nghiệm ghi nhận hoạt động điện của tim, giúp chẩn đoán các bệnh lý tim mạch. Nguyên lý: ghi nhận sự thay đổi điện thế trên bề mặt da khi tim co bóp và dẫn truyền xung điện, thông qua các điện cực đặt trên ngực, tay, chân. Kết quả là đường ghi điện tim với các sóng đặc trưng: sóng P (nhĩ co), phức bộ QRS (tâm thất co), sóng T (tâm thất hồi phục). Các loại ECG: ECG thường (resting ECG): ghi điện tim khi nghỉ ngơi, 12 chuyển đạo chuẩn, thời gian 5-10 phút. ECG gắng sức (exercise stress test): ghi điện tim khi vận động (chạy trên máy chạy bộ hoặc đạp xe), đánh giá khả năng gắng sức của tim, phát hiện thiếu máu cơ tim khi gắng sức. Holter ECG: ghi điện tim liên tục 24-48 giờ trong sinh hoạt thường ngày, phát hiện rối loạn nhịp tim kịch phát. ECG giúp chẩn đoán: Nhồi máu cơ tim cấp (STEMI, NSTEMI): thay đổi đoạn ST, sóng Q bệnh lý. Đau thắt ngực, thiếu máu cơ tim: thay đổi đoạn ST-T khi gắng sức. Rối loạn nhịp tim: nhịp nhanh (tachycardia), nhịp chậm (bradycardia), rung nhĩ, cuồng nhĩ, ngoại tâm thu, block nhĩ thất. Phì đại tim: phì đại nhĩ, phì đại thất. Viêm cơ tim, viêm màng ngoài tim. Rối loạn điện giải (tăng/giảm Kali). Tác dụng phụ của thuốc trên tim. Chỉ định làm ECG: đau ngực, khó thở, hồi hộp đánh trống ngực, chóng mặt, ngất, tiền sử gia đình có bệnh tim, tiền sử bệnh tim mạch, trước phẫu thuật, khám sức khỏe định kỳ ở người trên 40 tuổi. Chuẩn bị: không cần nhịn đói, mặc quần áo thoải mái dễ cởi, không bôi kem dưỡng da vùng ngực. Thời gian: 5-10 phút. An toàn tuyệt đối, không đau, không xâm lấn. Có kết quả ngay.",
                "type": "XET_NGHIEM"
            },
            {
                "id": 1,
                "code": "KB001",
                "name": "khám bệnh",
                "price": 0.0,
                "type": "KHAC"
            }
        ]
    },
    "message": "Fetched service detail successfully"
}
```

---

## 7. Medical Record API

### Base URL: `/api/medical-record`/medi

### 7.1 Lấy danh sách hồ sơ bệnh án
**Endpoint:** `GET /api/medical-record`

**Mô tả:** Lấy danh sách hồ sơ bệnh án với bộ lọc

**Query Parameters:**
- `keyword` (optional): Từ khóa tìm kiếm
- `date` (optional): Ngày khám (yyyy-MM-dd)
- `status` (optional): DANG_KHAM, CHO_XET_NGHIEM ,HOAN_THANH, HUY
- `limit`, `page(default=1)` 

**Response:**
```json
{
    "data": {
        "content": [
            {
                "id": "166",
                "code": "PK1760372403",
                "symptoms": "Đau đầu, chóng mặt trong 2 ngày",
                "clinicalExamination": null,
                "diagnosis": null,
                "treatmentPlan": null,
                "note": null,
                "patientId": 18,
                "patientName": "NPham Ngoc Tien",
                "patientPhone": null,
                "patientAddress": "123 Đường ABC, Quận 1, TP.HN",
                "patientGender": "NAM",
                "date": "2025-10-13T23:20:03",
                "status": "DANG_KHAM",
                "healthPlanId": null,
                "healthPlanName": null,
                "total": 0,
                "paid": null,
                "invoiceDetailsResponse": null
            },
            {
                "id": "165",
                "code": "PK1760371509",
                "symptoms": "Đau đầu, chóng mặt trong 2 ngày",
                "clinicalExamination": null,
                "diagnosis": null,
                "treatmentPlan": null,
                "note": null,
                "patientId": 15,
                "patientName": "NPham Ngoc Tien",
                "patientPhone": "0000000092",
                "patientAddress": "123 Đường ABC, Quận 1, TP.HN",
                "patientGender": "NAM",
                "date": "2025-10-13T23:05:09",
                "status": "DANG_KHAM",
                "healthPlanId": null,
                "healthPlanName": null,
                "total": 0,
                "paid": null,
                "invoiceDetailsResponse": null
            },
            {
                "id": "164",
                "code": "PK1760371334",
                "symptoms": "Đau đầu, chóng mặt trong 2 ngày",
                "clinicalExamination": null,
                "diagnosis": null,
                "treatmentPlan": null,
                "note": null,
                "patientId": 15,
                "patientName": "NPham Ngoc Tien",
                "patientPhone": "0000000092",
                "patientAddress": "123 Đường ABC, Quận 1, TP.HN",
                "patientGender": "NAM",
                "date": "2025-10-13T23:02:15",
                "status": "DANG_KHAM",
                "healthPlanId": null,
                "healthPlanName": null,
                "total": 0,
                "paid": null,
                "invoiceDetailsResponse": null
            }
        ],
        "pageable": {
            "pageNumber": 0,
            "pageSize": 3,
            "sort": {
                "sorted": false,
                "unsorted": true,
                "empty": true
            },
            "offset": 0,
            "paged": true,
            "unpaged": false
        },
        "totalPages": 22,
        "totalElements": 66,
        "last": false,
        "first": true,
        "size": 3,
        "number": 0,
        "sort": {
            "sorted": false,
            "unsorted": true,
            "empty": true
        },
        "numberOfElements": 3,
        "empty": false
    },
    "message": "Get all medical record successfully"
}
```
### Lấy tất cả hồ sơ bệnh án của bác sĩ
**Endpoint:** `GET /api/medical-record/doctor`
**Mô tả:** Lấy danh sách hồ sơ bệnh án với bộ lọc

**Query Parameters:**
- `keyword` (optional): Từ khóa tìm kiếm
- `date` (optional): Ngày khám (yyyy-MM-dd)
- `status` (optional): DANG_KHAM, CHO_XET_NGHIEM ,HOAN_THANH, HUY
- `isAllDepartment` (optional): true(lấy danh sách phiếu khám chỉ định cụ thể), false(chỉ định chung cho khoa)
- `limit`, `page(default=1)` 
**Response:**
```json
{
    "data": {
        "content": [
            {
                "id": "166",
                "code": "PK1760372403",
                "symptoms": "Đau đầu, chóng mặt trong 2 ngày",
                "clinicalExamination": null,
                "diagnosis": null,
                "treatmentPlan": null,
                "note": null,
                "patientId": 18,
                "patientName": "NPham Ngoc Tien",
                "patientPhone": null,
                "patientAddress": "123 Đường ABC, Quận 1, TP.HN",
                "patientGender": "NAM",
                "date": "2025-10-13T23:20:03",
                "status": "DANG_KHAM",
                "healthPlanId": null,
                "healthPlanName": null,
                "total": 0,
                "paid": null,
                "invoiceDetailsResponse": null
            },
            {
                "id": "165",
                "code": "PK1760371509",
                "symptoms": "Đau đầu, chóng mặt trong 2 ngày",
                "clinicalExamination": null,
                "diagnosis": null,
                "treatmentPlan": null,
                "note": null,
                "patientId": 15,
                "patientName": "NPham Ngoc Tien",
                "patientPhone": "0000000092",
                "patientAddress": "123 Đường ABC, Quận 1, TP.HN",
                "patientGender": "NAM",
                "date": "2025-10-13T23:05:09",
                "status": "DANG_KHAM",
                "healthPlanId": null,
                "healthPlanName": null,
                "total": 0,
                "paid": null,
                "invoiceDetailsResponse": null
            },
            {
                "id": "164",
                "code": "PK1760371334",
                "symptoms": "Đau đầu, chóng mặt trong 2 ngày",
                "clinicalExamination": null,
                "diagnosis": null,
                "treatmentPlan": null,
                "note": null,
                "patientId": 15,
                "patientName": "NPham Ngoc Tien",
                "patientPhone": "0000000092",
                "patientAddress": "123 Đường ABC, Quận 1, TP.HN",
                "patientGender": "NAM",
                "date": "2025-10-13T23:02:15",
                "status": "DANG_KHAM",
                "healthPlanId": null,
                "healthPlanName": null,
                "total": 0,
                "paid": null,
                "invoiceDetailsResponse": null
            }
        ],
        "pageable": {
            "pageNumber": 0,
            "pageSize": 3,
            "sort": {
                "sorted": false,
                "unsorted": true,
                "empty": true
            },
            "offset": 0,
            "paged": true,
            "unpaged": false
        },
        "totalPages": 22,
        "totalElements": 66,
        "last": false,
        "first": true,
        "size": 3,
        "number": 0,
        "sort": {
            "sorted": false,
            "unsorted": true,
            "empty": true
        },
        "numberOfElements": 3,
        "empty": false
    },
    "message": "Get all medical record successfully"
}
```
### 7.2 Lấy chi tiết hồ sơ bệnh án
**Endpoint:** `GET /api/medical-record/{id}`

**Mô tả:** Lấy thông tin chi tiết của hồ sơ bệnh án

**Path Parameters:**
- `id`: ID của hồ sơ bệnh án

**Response:**
{
    "data": {
        "id": "111",
        "code": "PK1760023951",
        "symptoms": "Không có triệu chứng",
        "clinicalExamination": null,
        "diagnosis": null,
        "treatmentPlan": null,
        "note": null,
        "patientId": 51,
        "patientName": "tien pro",
        "patientPhone": "0395527777",
        "patientAddress": "121i24j",
        "patientGender": "NAM",
        "date": "2025-10-09T22:32:32",
        "status": "DANG_KHAM",
        "healthPlanId": 10,
        "healthPlanName": "GOI DICH VU SIEU CAP VU TRU TAI NHA TAN RANG",
        "total": 5000,
        "paid": 5000,
        "doctorName":"sdfasdg"
        "invoiceDetailsResponse": [
            {
                "id": 256,
                "healthPlanId": 10,
                "healthPlanName": "GOI DICH VU SIEU CAP VU TRU TAI NHA TAN RANG",
                "healthPlanPrice": 5000,
                "paid": 5000,
                "description": "GOI DICH VU SIEU CAP VU TRU TAI NHA TAN RANG",
                "status": "DA_THANH_TOAN",
                "multipleLab": [
                    {
                        "id": 211,
                        "code": "XN1760023951841",
                        "name": "khám bệnh",
                        "doctorPerforming": "tien",
                        "room": "Phòng khám Nội tổng quát - 101A",
                        "createdAt": "2025-10-09T22:32:32",
                        "status": "CHO_THUC_HIEN"
                    },
                    {
                        "id": 212,
                        "code": "XN1760023951849",
                        "name": "Xét nghiệm công thức máu",
                        "doctorPerforming": null,
                        "room": "Phòng khám Nội tổng quát - 101A",
                        "createdAt": "2025-10-09T22:32:32",
                        "status": "CHO_THUC_HIEN"
                    },
                    {
                        "id": 213,
                        "code": "XN1760023951856",
                        "name": "Nội soi dạ dày",
                        "doctorPerforming": null,
                        "room": "Phòng khám Ngoại chấn thương - 102A",
                        "createdAt": "2025-10-09T22:32:32",
                        "status": "CHO_THUC_HIEN"
                    },
                    {
                        "id": 214,
                        "code": "XN1760023951864",
                        "name": "Chụp X-quang ngực",
                        "doctorPerforming": null,
                        "room": "Phòng khám Nhi khoa - 103A",
                        "createdAt": "2025-10-09T22:32:32",
                        "status": "CHO_THUC_HIEN"
                    },
                    {
                        "id": 215,
                        "code": "XN1760023951871",
                        "name": "Siêu âm ổ bụng tổng quát",
                        "doctorPerforming": null,
                        "room": "Phòng khám Sản phụ khoa - 104A",
                        "createdAt": "2025-10-09T22:32:32",
                        "status": "CHO_THUC_HIEN"
                    },
                    {
                        "id": 216,
                        "code": "XN1760023951879",
                        "name": "khám bệnh",
                        "doctorPerforming": null,
                        "room": "Phòng khám Nội tổng quát - 101A",
                        "createdAt": "2025-10-09T22:32:32",
                        "status": "CHO_THUC_HIEN"
                    }
                      "typeService": "MULTIPLE"
                ],
            },
                        {
                "id": 240,
                "healthPlanId": 2,
                "healthPlanName": "Xét nghiệm máu cơ bản",
                "healthPlanPrice": 2000,
                "paid": 0,
                "description": "Xét nghiệm máu cơ bản",
                "status": "CHUA_THANH_TOAN",
                "multipleLab": null,
                "singleLab": {
                    "id": 186,
                    "code": "XN1759928445540",
                    "name": "Xét nghiệm máu cơ bản",
                    "doctorPerforming": null,
                    "room": "Phòng xét nghiệm  - 204A",
                    "createdAt": "2025-10-08T20:00:46",
                    "status": "CHO_THUC_HIEN"
                },
                "typeService": "SINGLE"
            }
        ]
    },
    "message": "Get medical record by id successfully"
}

### lấy hóa đơn theo phiếu id
/api/medical-record/224/invoice

response
{
    "data": {
        "id": 260,
        "code": "HD1761223541",
        "paymentMethod": "TIEN_MAT",
        "totalAmount": 5000,
        "paidAmount": 5000,
        "status": "DA_THANH_TOAN",
        "date": "2025-10-23T19:45:41"
    },
    "message": "Get invoice by medical record id successfully"
}


### 7.3 Lấy hồ sơ bệnh án theo bệnh nhân
**Endpoint:** `GET /api/medical-record/patient/{id}`

**Mô tả:** Lấy tất cả hồ sơ bệnh án của một bệnh nhân

**Path Parameters:**
- `id`: ID của bệnh nhân

**Response:**
```json
{
    "data": [
        {
            "id": "210",
            "code": "PK1760608163",
            "symptoms": "Khó chịu",
            "clinicalExamination": "",
            "diagnosis": "",
            "treatmentPlan": "",
            "note": "",
            "patientId": 5,
            "patientName": "Nguyen Van A",
            "patientPhone": "0395527082",
            "patientAddress": "123 Đường ABC, Quận 1, TP.HCM",
            "patientGender": "NAM",
            "date": "2025-10-16T16:49:23",
            "status": "CHO_XET_NGHIEM",
            "healthPlanId": 1,
            "healthPlanName": "khám bệnh",
            "doctorName": "tien",
            "total": 6000,
            "paid": 6000,
            "invoiceDetailsResponse": [
                {
                    "id": 390,
                    "healthPlanId": 1,
                    "healthPlanName": "khám bệnh",
                    "healthPlanPrice": 6000,
                    "paid": 6000,
                    "paymentMethod": null,
                    "description": "Phí khám bệnh",
                    "status": "DA_THANH_TOAN",
                    "multipleLab": null,
                    "singleLab": {
                        "id": 457,
                        "code": "XN1760608163053",
                        "name": "khám bệnh",
                        "doctorPerforming": "tien",
                        "room": "Phòng khám Ngoại chấn thương - 102A",
                        "createdAt": "2025-10-16T16:49:23",
                        "status": "HOAN_THANH"
                    },
                    "typeService": "SINGLE"
                }
            ]
        },
        {
            "id": "211",
            "code": "PK1760608174",
            "symptoms": "c",
            "clinicalExamination": null,
            "diagnosis": null,
            "treatmentPlan": null,
            "note": null,
            "patientId": 5,
            "patientName": "Nguyen Van A",
            "patientPhone": "0395527082",
            "patientAddress": "123 Đường ABC, Quận 1, TP.HCM",
            "patientGender": "NAM",
            "date": "2025-10-16T16:49:34",
            "status": "DANG_KHAM",
            "healthPlanId": 10,
            "healthPlanName": "GOI DICH VU SIEU CAP VU TRU TAI NHA TAN RANG",
            "doctorName": null,
            "total": 5000,
            "paid": 5000,
            "invoiceDetailsResponse": [
                {
                    "id": 391,
                    "healthPlanId": 10,
                    "healthPlanName": "GOI DICH VU SIEU CAP VU TRU TAI NHA TAN RANG",
                    "healthPlanPrice": 5000,
                    "paid": 5000,
                    "paymentMethod": null,
                    "description": "GOI DICH VU SIEU CAP VU TRU TAI NHA TAN RANG",
                    "status": "DA_THANH_TOAN",
                    "multipleLab": [
                        {
                            "id": 458,
                            "code": "XN1760608174439",
                            "name": "Xét nghiệm công thức máu",
                            "doctorPerforming": null,
                            "room": "Phòng khám Nội tổng quát - 101A",
                            "createdAt": "2025-10-16T16:49:34",
                            "status": "CHO_THUC_HIEN"
                        },
                        {
                            "id": 459,
                            "code": "XN1760608174445",
                            "name": "Nội soi dạ dày",
                            "doctorPerforming": null,
                            "room": "Phòng khám Ngoại chấn thương - 102A",
                            "createdAt": "2025-10-16T16:49:34",
                            "status": "CHO_THUC_HIEN"
                        },
                        {
                            "id": 460,
                            "code": "XN1760608174451",
                            "name": "Chụp X-quang ngực",
                            "doctorPerforming": null,
                            "room": "Phòng khám Nhi khoa - 103A",
                            "createdAt": "2025-10-16T16:49:34",
                            "status": "CHO_THUC_HIEN"
                        },
                        {
                            "id": 461,
                            "code": "XN1760608174456",
                            "name": "Siêu âm ổ bụng tổng quát",
                            "doctorPerforming": null,
                            "room": "Phòng khám Sản phụ khoa - 104A",
                            "createdAt": "2025-10-16T16:49:34",
                            "status": "CHO_THUC_HIEN"
                        },
                        {
                            "id": 462,
                            "code": "XN1760608174463",
                            "name": "khám bệnh",
                            "doctorPerforming": null,
                            "room": "Phòng khám Nội tổng quát - 101A",
                            "createdAt": "2025-10-16T16:49:34",
                            "status": "HOAN_THANH"
                        }
                    ],
                    "singleLab": null,
                    "typeService": "MULTIPLE"
                }
            ]
        }
    ],
    "message": "Get medical record by id successfully"
}

```

---

### 7.4 Lấy hồ sơ của tôi
**Endpoint:** `GET /api/medical-record/me`

**Mô tả:** Lấy hồ sơ bệnh án của bệnh nhân đang đăng nhập

**Headers:**
- `Authorization`: Bearer {token}

**Response:**
```json
{
    "data": [
        {
            "id": "217",
            "code": "PK1760685100",
            "patientName": "Nguyen Van A",
            "date": "2025-10-17T14:11:40",
            "status": "CHO_KHAM",
            "doctorName": "Bacs six tien",
            "total": 2000,
            "paid": 2000,
        }
    ],
    "message": "Get my medical record successfully"
}
```

---

### 7.5 Lấy hồ sơ người thân theo CCCD
**Endpoint:** `GET /api/medical-record/me/{cccd}`

**Mô tả:** Lấy hồ sơ bệnh án của người thân theo CCCD

**Path Parameters:**
- `cccd`: Số CCCD của người thân

**Headers:**
- `Authorization`: Bearer {token}

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "recordCode": "MR001",
      "date": "2024-12-20",
      "doctorName": "string"
    }
  ],
  "message": "Get medical record by cccd successfully"
}
```

---

### 7.6 Tạo hồ sơ bệnh án
**Endpoint:** `POST /api/medical-record`

**Mô tả:** Tạo hồ sơ bệnh án mới

**Request Body:**
```json
{
  "patientId": 1,
  "healthPlanId": 1,
  "doctorId": 1,
  "symptoms": "string",
  "clinicalExamination": "string",
  "diagnosis": "string",
  "treatmentPlan": "string",
  "note": "string"
}
```

**Response:**
```json
{
  "data": 1,
  "message": "successfully"
}
```

---

### 7.7 Cập nhật hồ sơ bệnh án
**Endpoint:** `PUT /api/medical-record`

**Mô tả:** Cập nhật thông tin hồ sơ bệnh án

**Request Body:**
```json
{
  "id": 1,
  "symptoms": "string",
  "clinicalExamination": "string",
  "diagnosis": "string",
  "treatmentPlan": "string",
  "note": "string"
}
```

**Response:**
```json
{
  "data": "",
  "message": "successfully"
}
```

---

### 7.8 Cập nhật trạng thái hồ sơ
**Endpoint:** `PUT /api/medical-record/status`

**Mô tả:** Cập nhật trạng thái hồ sơ bệnh án

**Request Body:**
```json
{
  "id": 1,
  "status": "DANG_KHAM" // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
}
```

**Response:**
```json
{
  "data": "",
  "message": "successfully"
}
```

---

## 8. Prescription API

### Base URL: `/api/prescriptions`

### 8.1 Lấy đơn thuốc theo hồ sơ bệnh án
**Endpoint:** `GET /api/prescriptions/medical-record/{id}`

**Mô tả:** Lấy các đơn thuốc của một hồ sơ bệnh án

**Path Parameters:**
- `id`: ID của hồ sơ bệnh án

**Response:**
```json
{
    "data": {
        "id": 14,
        "code": "DT1760607145",
        "generalInstructions": null,
        "doctorCreated": "tien",
        "prescriptionDate": "2025-10-16T16:32:26",
        "detailResponses": []
    },
    "message": "Fetch prescriptions successfully"
}
```

---

### 8.2 Tạo đơn thuốc
**Endpoint:** `POST /api/prescriptions`

**Mô tả:** Tạo đơn thuốc mới

**Request Body:**
```json
{
  "medicalRecordId": 1,
  "note": "string"
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "medicalRecordId": 1
  },
  "message": "Create prescription successfully"
}
```

---

### 8.3 Cập nhật đơn thuốc
**Endpoint:** `PUT /api/prescriptions`

**Mô tả:** Cập nhật thông tin đơn thuốc

**Request Body:**
```json
{
  "id": 1,
  "note": "string"
}
```

**Response:**
```json
{
  "data": {
    "id": 1
  },
  "message": "Update prescription successfully"
}
```

---

### 8.4 Thêm chi tiết đơn thuốc
**Endpoint:** `POST /api/prescriptions/details`

**Mô tả:** Thêm thuốc vào đơn thuốc

**Request Body:**
```json
{
	"prescriptionId": 1,
    "medicineId": 2,
    "usageInstructions": "Uống 2 viên sau ăn",
    "quantity": 2
}
```

**Response:**
```json
{
    "data": {
        "id": 42,
        "medicineResponse": {
            "id": 10,
            "name": null,
            "concentration": null,
            "dosageForm": null,
            "description": null,
            "unit": null
        },
        "usageInstructions": "Uống 2 viên sau ăn",
        "quantity": 2
    },
    "message": "Create prescription detail successfully"
}
```

---

### 8.5 Cập nhật chi tiết đơn thuốc
**Endpoint:** `PUT /api/prescriptions/details`

**Mô tả:** Cập nhật thông tin thuốc trong đơn

**Request Body:**
```json
{
    "id": 1,
    "medicineId": 3,
    "usageInstructions": "Uống 2 viên2 sau ăn",
    "quantity": 10
}
```

**Response:**
```json
{
    "data": {
        "id": 1,
        "medicineResponse": {
            "id": 3,
            "name": "Cefuroxime",
            "concentration": "250mg",
            "dosageForm": "Viên nén",
            "description": "",
            "unit": "Vỉ"
        },
        "usageInstructions": "Uống 2 viên2 sau ăn",
        "quantity": 10
    },
    "message": "Update prescription detail successfully"
}
```

---

### 8.6 Xóa chi tiết đơn thuốc
**Endpoint:** `DELETE /api/prescriptions/details/{id}`

**Mô tả:** Xóa thuốc khỏi đơn thuốc

**Path Parameters:**
- `id`: ID của chi tiết đơn thuốc

**Response:**
- Status: 204 No Content

---

## 9. Medicine API

### Base URL: `/api/medicines`

### 9.1 Lấy danh sách thuốc
**Endpoint:** `GET /api/medicines`

**Mô tả:** Lấy danh sách thuốc có thể tìm kiếm

**Query Parameters:**
- `keyword` (optional): Từ khóa tìm kiếm tên thuốc
- `page (default=1)`
- `limit (default=10)`
**Response:**
```json
{
    "data": {
        "content": [
            {
                "id": 1,
                "name": "Paracetamol",
                "concentration": "500mg",
                "dosageForm": "Viên nén",
                "description": "",
                "unit": "Vỉ"
            },
            {
                "id": 2,
                "name": "Amoxicillin",
                "concentration": "500mg",
                "dosageForm": "Viên nang",
                "description": "",
                "unit": "Vỉ"
            },
            {
                "id": 3,
                "name": "Cefuroxime",
                "concentration": "250mg",
                "dosageForm": "Viên nén",
                "description": "",
                "unit": "Vỉ"
            }
        ],
        "pageable": {
            "pageNumber": 0,
            "pageSize": 3,
            "sort": {
                "sorted": false,
                "unsorted": true,
                "empty": true
            },
            "offset": 0,
            "paged": true,
            "unpaged": false
        },
        "totalPages": 10,
        "totalElements": 30,
        "last": false,
        "first": true,
        "size": 3,
        "number": 0,
        "sort": {
            "sorted": false,
            "unsorted": true,
            "empty": true
        },
        "numberOfElements": 3,
        "empty": false
    },
    "message": "Fetch medicines successfully"
}
```

---

## 10. Lab Order API

### Base URL: `/api/lab-orders`

### 10.1 Lấy phiếu xét nghiệm theo mã hồ sơ
**Endpoint:** `GET /api/lab-orders/code/{code}`

**Mô tả:** Lấy các phiếu xét nghiệm theo mã hồ sơ bệnh án

**Path Parameters:**
- `code`: Mã hồ sơ bệnh án

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "testName": "string",
      "status": "PENDING",
      "orderDate": "2024-12-20"
    }
  ],
  "message": "Get lab order by record code successfully"
}
```

---
### Thực hiện xét nghiệm và đánh dấu
**Endpoint:** `GET /api/lab-orders/processing/{id}`
**response**
```json
{
    "data": {
        "id": 478,
        "code": "XN1760685100338",
        "recordId": 217,
        "healthPlanId": 16,
        "healthPlanName": "Xét nghiệm máu tổng quát",
        "room": "Phòng khám khoa xét nghiệm  - 204A",
        "doctorPerformed": "TS. NGUYEN VAN A",
        "doctorPerformedId": null,
        "doctorOrdered": null,
        "status": "CHO_KET_QUA",
        "statusPayment": null,
        "price": 2000.00,
        "orderDate": "2025-10-17T19:34:30",
        "diagnosis": null,
        "expectedResultDate": "2025-10-17T20:34:30",
        "serviceParent": null,
        "labResultResponse": {
            "id": 35,
            "date": "2025-10-17T20:28:33",
            "resultDetails": null,
            "note": null,
            "explanation": null,
            "urls": ["url1", "url2"],
            "paramResults": [
                {
                    "id": 1,
                    "name": "Hồng cầu (RBC)",
                    "value": null,
                    "unit": "T/L",
                    "range": "3.6-5.4",
                    "rangeStatus": "CHUA_XAC_DINH"
                },
                {
                    "id": 2,
                    "name": "Bạch cầu (WBC)",
                    "value": null,
                    "unit": "G/L",
                    "range": "4.0-10.0",
                    "rangeStatus": "CHUA_XAC_DINH"
                },
                {
                    "id": 3,
                    "name": "Tiểu cầu (PLT)",
                    "value": null,
                    "unit": "G/L",
                    "range": "150-400",
                    "rangeStatus": "CHUA_XAC_DINH"
                },
                {
                    "id": 4,
                    "name": "Huyết sắc tố (Hb)",
                    "value": null,
                    "unit": "g/L",
                    "range": "120-170",
                    "rangeStatus": "CHUA_XAC_DINH"
                },
                {
                    "id": 5,
                    "name": "Hematocrit (Hct)",
                    "value": null,
                    "unit": "%",
                    "range": "36-50",
                    "rangeStatus": "CHUA_XAC_DINH"
                },
                {
                    "id": 6,
                    "name": "Đường huyết (Glucose)",
                    "value": null,
                    "unit": "mmol/L",
                    "range": "3.9-6.4",
                    "rangeStatus": "CHUA_XAC_DINH"
                },
                {
                    "id": 7,
                    "name": "Cholesterol toàn phần",
                    "value": null,
                    "unit": "mmol/L",
                    "range": "0-5.2",
                    "rangeStatus": "CHUA_XAC_DINH"
                },
                {
                    "id": 8,
                    "name": "Triglyceride",
                    "value": null,
                    "unit": "mmol/L",
                    "range": "0-1.7",
                    "rangeStatus": "CHUA_XAC_DINH"
                },
                {
                    "id": 9,
                    "name": "HDL – Cholesterol",
                    "value": null,
                    "unit": "mmol/L",
                    "range": "1.0-3.0",
                    "rangeStatus": "CHUA_XAC_DINH"
                },
                {
                    "id": 10,
                    "name": "LDL – Cholesterol",
                    "value": null,
                    "unit": "mmol/L",
                    "range": "0-3.4",
                    "rangeStatus": "CHUA_XAC_DINH"
                },
                {
                    "id": 11,
                    "name": "AST (GOT)",
                    "value": null,
                    "unit": "U/L",
                    "range": "0-40",
                    "rangeStatus": "CHUA_XAC_DINH"
                },
                {
                    "id": 12,
                    "name": "ALT (GPT)",
                    "value": null,
                    "unit": "U/L",
                    "range": "0-40",
                    "rangeStatus": "CHUA_XAC_DINH"
                },
                {
                    "id": 13,
                    "name": "GGT",
                    "value": null,
                    "unit": "U/L",
                    "range": "0-55",
                    "rangeStatus": "CHUA_XAC_DINH"
                },
                {
                    "id": 14,
                    "name": "Ure",
                    "value": null,
                    "unit": "mmol/L",
                    "range": "2.5-7.5",
                    "rangeStatus": "CHUA_XAC_DINH"
                },
                {
                    "id": 15,
                    "name": "Creatinin",
                    "value": null,
                    "unit": "µmol/L",
                    "range": "53-115",
                    "rangeStatus": "CHUA_XAC_DINH"
                },
                {
                    "id": 16,
                    "name": "Acid uric",
                    "value": null,
                    "unit": "µmol/L",
                    "range": "155-428",
                    "rangeStatus": "CHUA_XAC_DINH"
                }
            ]
        }
    },
    "message": "Get lab order successfully"
}
```

### 10.2 Lấy chi tiết phiếu xét nghiệm
**Endpoint:** `GET /api/lab-orders/{id}`

**Mô tả:** Lấy thông tin chi tiết phiếu xét nghiệm

**Path Parameters:**
- `id`: ID của phiếu xét nghiệm

**Response:**
```json
{
    "data": {
        "id": 446,
        "code": "XN1760593761675",
        "recordId": 209,
        "healthPlanId": 1,
        "healthPlanName": "khám bệnh",
        "room": "Phòng khám Nội tổng quát - 101A",
        "doctorPerformed": null,
        "doctorPerformedId": null,
        "doctorOrdered": null,
        "status": "HOAN_THANH",
        "statusPayment": null,
        "price": 0.00,
        "orderDate": "2025-10-16T12:49:22",
        "diagnosis": null,
        "expectedResultDate": "2025-10-16T12:49:22",
        "serviceParent": null,
        "labResultResponse": null
    },
    "message": "Get lab order by id successfully"
}
```

---

### 10.3 Lấy tất cả phiếu xét nghiệm
**Endpoint:** `GET /api/lab-orders`

**Mô tả:** Lấy danh sách tất cả phiếu xét nghiệm

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "testName": "string",
      "patientName": "string",
      "status": "PENDING"
    }
  ],
  "message": "Get all lab orders successfully"
}
```

---

### 10.4 Lấy phiếu xét nghiệm của phòng thuộc bác sĩ
**Endpoint:** `GET /api/lab-orders/doctor`

**Mô tả:** Lấy các phiếu xét nghiệm được phân cho bác sĩ đang đăng nhập

**Query Parameters:**
- `keyword` (optional): Từ khóa tìm kiếm
- `status` (optional): CHO_THUC_HIEN, DANG_THUC_HIEN, HOAN_THANH, HUY_BO, CHO_KET_QUA
- `date` (optional): Ngày (yyyy-MM-dd)
- `limit` default=10
- `page` default=1
**Headers:**
- `Authorization`: Bearer {token}

**Response:**
```json
{
    "data": {
        "content": [
            {
                "id": 459,
                "code": "XN1760608174445",
                "recordId": 211,
                "healthPlanId": 12,
                "healthPlanName": "Nội soi dạ dày",
                "room": "Phòng khám Ngoại chấn thương - 102A",
                "doctorPerformed": null,
                "doctorPerformedId": null,
                "doctorOrdered": null,
                "status": "CHO_THUC_HIEN",
                "statusPayment": null,
                "price": 0.00,
                "orderDate": "2025-10-16T16:49:34",
                "diagnosis": null,
                "expectedResultDate": null,
                "serviceParent": null,
                "labResultResponse": null
            },
            {
                "id": 468,
                "code": "XN1760608367155",
                "recordId": 214,
                "healthPlanId": 12,
                "healthPlanName": "Nội soi dạ dày",
                "room": "Phòng khám Ngoại chấn thương - 102A",
                "doctorPerformed": null,
                "doctorPerformedId": null,
                "doctorOrdered": null,
                "status": "CHO_THUC_HIEN",
                "statusPayment": null,
                "price": 0.00,
                "orderDate": "2025-10-16T16:52:47",
                "diagnosis": null,
                "expectedResultDate": null,
                "serviceParent": null,
                "labResultResponse": null
            }
        ],
        "pageable": {
            "pageNumber": 0,
            "pageSize": 10,
            "sort": {
                "sorted": false,
                "unsorted": true,
                "empty": true
            },
            "offset": 0,
            "paged": true,
            "unpaged": false
        },
        "totalPages": 1,
        "totalElements": 2,
        "last": true,
        "first": true,
        "size": 10,
        "number": 0,
        "sort": {
            "sorted": false,
            "unsorted": true,
            "empty": true
        },
        "numberOfElements": 2,
        "empty": false
    },
    "message": "Get all lab orders of doctor successfully"
}
```

---

### 10.5 Tạo phiếu xét nghiệm
**Endpoint:** `POST /api/lab-orders`

**Mô tả:** Tạo phiếu xét nghiệm mới

**Request Body:**
```json
{
	"recordId": 69,
    "healthPlanId": 11,
    "performingDoctor": 20,
    "diagnosis": "abcdxyzt"
}
```

**Response:**
```json
{
  "data": "",
  "message": "Create lab order successfully"
}
```

---

### 10.6 Cập nhật trạng thái phiếu xét nghiệm
**Endpoint:** `PUT /api/lab-orders/status`

**Mô tả:** Cập nhật trạng thái phiếu xét nghiệm

**Request Body:**
```json
{
  "id": 1,
  "status": "COMPLETED" // PENDING, IN_PROGRESS, COMPLETED
}
```

**Response:**
```json
{
  "data": "",
  "message": "Update lab order status successfully"
}
```

---

### 10.7 Cập nhật phiếu xét nghiệm
**Endpoint:** `PUT /api/lab-orders`

**Mô tả:** Cập nhật thông tin phiếu xét nghiệm

**Request Body:**
```json
{
  "id": 1,
  "doctorPerformingId": null, 
}
// có thể không chọn bác sĩ chỉ định
```

**Response:**
```json
{
  "data": "",
  "message": "Update lab order successfully"
}
```

---

### 10.8 Xóa phiếu xét nghiệm
**Endpoint:** `DELETE /api/lab-orders/{id}`

**Mô tả:** Xóa một hoặc nhiều phiếu xét nghiệm


**Response:**
- Status: 204 No Content

---
### 10.9 Lấy thông số của xét nghiệm 
**Endpoint:** `GET /api/lab-orders/{id}/params`

**Response:**
```json
{
    "data": [
        {
            "id": 21,
            "name": "Hồng cầu (RBC)",
            "unit": "T/L",
            "range": "3.6-5.4"
        },
        {
            "id": 22,
            "name": "Bạch cầu (WBC)",
            "unit": "G/L",
            "range": "4.0-10.0"
        },
        {
            "id": 23,
            "name": "Tiểu cầu (PLT)",
            "unit": "G/L",
            "range": "150-400"
        }
    ],
    "message": "Get lab order params by lab order id successfully"
}
```

### 10.10 Hoàn thành xét nghiệm
**Endpoint:** `PUT /api/lab-orders/complete`

**Mô tả:** Cập nhật thông tin phiếu xét nghiệm

**Request Body:**
```json
{
  "labOrderId": 1,
  "resultDetails": "ok",
  "note": "adkjf",
  "explaination":"oki",
  "summary": "dà",
  "paramDetails":[
    {
        "paramId": 1,
        "value":"2.5"
    },
    {
        "paramId": 1,
        "value":"2.5"
    }
  ] ,
  "urls":["http://gdsf", "http://dslfjsad"]
}
// có thể không chọn bác sĩ chỉ định
```
---
## 11. Lab Result API

### Base URL: `/api/lab-results`

### 11.1 Tạo kết quả xét nghiệm 
**Endpoint:** `POST /api/lab-results` 

**Mô tả:** Tạo kết quả xét nghiệm

**Request Body:**
```json
{
	"labOrderId": 2,
    "resultDetails":"Ket qua binh thuong",
    "note": "khong tim thay bat thuong",
    "summary": "Tong quat co the binh thuong",
    "explanation": "Khong co",
}
```
**Response:**
```json
{
    "data": {
        "id": 22,
        "date": "2025-10-16T21:01:42.094219",
        "status": "CHO_KET_QUA",
        "resultDetails": "Ket qua binh thuong",
        "note": "khong tim thay bat thuong",
        "explanation": "Khong co",
        "isDone": false
    },
    "message": "Create lab result successfully"
}
```
### 11.1 Cập nhật kết quả xét nghiệm 
**Endpoint:** `PUT /api/lab-results` 

**Request Body:**
```json
{
	"labOrderId": 2,
    "resultDetails":"Ket qua binh thuong",
    "note": "khong tim thay bat thuong",
    "summary": "Tong quat co the binh thuong",
    "explanation": "Khong co",
    "isDone": true
}
**Response:**
```json
{
    "data": {
        "id": 22,
        "date": "2025-10-16T21:01:42.094219",
        "status": "CHO_KET_QUA",
        "resultDetails": "Ket qua binh thuong",
        "note": "khong tim thay bat thuong",
        "explanation": "Khong co"
    },
    "message": "Create lab result successfully"
}
```
### 11.2 Xem chỉ số xét nghiệm (chi tiết lab result)
**Endpoint:** `GET /api/lab-results/{id}/details`
- Trạng thái: CAO, THAP, TRUNG_BINH
**Response:**
```json

// xem chỉ số 
{
    "data": [
        {
            "id": 1,
            "name": "acid",
            "value": "1.5",
            "unit": "ml",
            "range": "1.1-2.5",
            "rangeStatus": "TRUNG_BINH"
        },
      {
            "id": 1,
            "name": "acid",
            "value": "1.5",
            "unit": "ml",
            "range": "1.1-2.5",
            "rangeStatus": "TRUNG_BINH"
        }
    ],
    "message" : "success"
}
```
### 11.3 Tạo chỉ số xét nghiệm (chi tiết lab result)
**Endpoint:** `POST /api/lab-results/details`
**Request:**
```json
{
    "labResultId": 123,
    "paramDetails": [
        {
            "paramId": 1,
            "value": "1.5"
        },
          {
            "paramId": 2,
            "value": "1.5"
        }
    ]
}
```
### 11.3 cập nhật chỉ số xét nghiệm (chi tiết lab result)
**Endpoint:** `POST /api/lab-results/details`
**Request:**
```json
{
    "id": 123,
    "value": "2.5"
}
```
---

## 12. Invoice API

### Base URL: `/api/invoices`

### 12.1 Thanh toán tiền mặt
**Endpoint:** `POST /api/invoices/pay-cash`

**Mô tả:** Thanh toán hóa đơn bằng tiền mặt

**Request Body:**
```json
{
  "medicalRecordId": 102,
  "healthPlanIds": [
    10, 2
  ],
  "totalAmount": 3000
}
```

**Response:**
```json
{
  "data": "",
  "message": "Payment successful"
}
```

---

## 13. Payment API

### Base URL: `/api/payments`

### 13.1 Tạo link thanh toán
**Endpoint:** `POST /api/payments/create-link`

**Mô tả:** Tạo link thanh toán online (PayOS)

**Request Body:**
```json
{
  "medicalRecordId": 1,
  "amount": 500000,
  "description": "string",
  "returnUrl": "string",
  "cancelUrl": "string"
}
```

**Response:**
```json
{
  "data": {
    "checkoutUrl": "string",
    "orderCode": 123456,
    "qrCode": "string"
  },
  "message": "Payment link created successfully"
}
```

---

### 13.2 Webhook thanh toán
**Endpoint:** `POST /api/payments/webhook`

**Mô tả:** Nhận webhook từ cổng thanh toán (chỉ dành cho hệ thống)

**Request Body:**
```json
{
  "orderCode": 123456,
  "status": "PAID",
  "transactionId": "string"
}
```

**Response:**
- Status: 200 OK

---

### 13.3 Kiểm tra trạng thái thanh toán
**Endpoint:** `GET /api/payments/status/{orderCode}`

**Mô tả:** Kiểm tra trạng thái đơn hàng thanh toán

**Path Parameters:**
- `orderCode`: Mã đơn hàng

**Response:**
```json
{
  "data": {
    "orderCode": 123456,
    "status": "PAID",
    "amount": 500000,
    "transactionId": "string"
  },
  "message": "Payment status retrieved successfully"
}
```

---

## 14. Schedule API

### Base URL: `/api/schedules`

### 14.1 Tạo lịch làm việc
**Endpoint:** `POST /api/schedules`

**Mô tả:** Tạo lịch làm việc cho bác sĩ

**Request Body:**
```json
{
  "doctorId": 1,
  "date": "2024-12-20",
  "shift": "MORNING", // MORNING, AFTERNOON, EVENING
  "maxPatients": 20
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "doctorId": 1,
    "date": "2024-12-20"
  },
  "message": "create schedule success"
}
```

---

### 14.2 Xóa lịch làm việc
**Endpoint:** `DELETE /api/schedules/{id}`

**Mô tả:** Xóa lịch làm việc

**Path Parameters:**
- `id`: ID của lịch làm việc

**Response:**
```json
{
  "data": "",
  "message": "delete schedule success"
}
```

---

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

---

### 14.4 Lấy lịch nghỉ của tôi
**Endpoint:** `GET /api/schedules/leave/me`

**Mô tả:** Lấy danh sách lịch nghỉ của bác sĩ đang đăng nhập

**Query Parameters:**
- `date` (optional): Ngày (yyyy-MM-dd)
- `status` (optional): Trạng thái (PENDING, APPROVED, REJECTED)

**Headers:**
- `Authorization`: Bearer {token}

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "startDate": "2024-12-20",
      "endDate": "2024-12-22",
      "reason": "string",
      "status": "PENDING"
    }
  ],
  "message": "get my leaves success"
}
```

---

### 14.5 Đăng ký nghỉ phép
**Endpoint:** `POST /api/schedules/leave`

**Mô tả:** Tạo đơn xin nghỉ phép

**Request Body:**
```json
{
  "startDate": "2024-12-20",
  "endDate": "2024-12-22",
  "reason": "string"
}
```

**Response:**
```json
{
  "data": "",
  "message": "create leave success"
}
```

---

### 14.6 Cập nhật lịch nghỉ
**Endpoint:** `PUT /api/schedules/leave`

**Mô tả:** Cập nhật hoặc duyệt đơn nghỉ phép

**Request Body:**
```json
{
  "id": 1,
  "status": "APPROVED", // PENDING, APPROVED, REJECTED
  "note": "string"
}
```

**Response:**
```json
{
  "data": "",
  "message": "update schedule success"
}
```

---

### 14.7 Xóa lịch nghỉ
**Endpoint:** `DELETE /api/schedules/leave`

**Mô tả:** Hủy đơn nghỉ phép

**Request Body:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "data": "",
  "message": "delete leave success"
}
```

---

## 15. Receptionist API

### Base URL: `/api/receptionists`

### 15.1 Xác nhận lịch hẹn
**Endpoint:** `POST /api/receptionists/confirm`

**Mô tả:** Xác nhận và xử lý lịch hẹn (dành cho lễ tân)

**Request Body:**
```json
{
  "id": 1,
  "status": "CONFIRMED"
}
```

**Response:**
```json
{
  "data": "",
  "message": "Appointment confirmed successfully"
}
```

---

## 16. User API

### Base URL: `/api/users`

### 16.1 Tạo người dùng
**Endpoint:** `POST /api/users`

**Mô tả:** Tạo tài khoản người dùng mới (admin)

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string",
  "role": "BAC_SI", // BAC_SI, LE_TAN, BENH_NHAN, etc.
  "name": "string"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "role": "BAC_SI"
}
```

---

### 16.2 Lấy thông tin người dùng theo ID
**Endpoint:** `GET /api/users/{id}`

**Mô tả:** Lấy thông tin người dùng

**Path Parameters:**
- `id`: ID của người dùng

**Response:**
```json
{
  "data": {
    "id": 1,
    "username": "string",
    "email": "string",
    "role": "BAC_SI"
  },
  "message": "Get info successfully"
}
```

---

### 16.3 Lấy thông tin người dùng hiện tại
**Endpoint:** `GET /api/users/me`

**Mô tả:** Lấy thông tin người dùng đang đăng nhập

**Headers:**
- `Authorization`: Bearer {token}
**Response:** `trường hợp nếu là ADMIN`
```json
{
    "data": {
        "id": 3,
        "email": "admin@gmail.com",
        "name": "Quan tỉ vine",
        "role": "ADMIN",
        "status": true,
        "createdAt": "2025-09-09T14:21:07"
    },
    "message": "Get info successfully"
}
```
**Response:** `trường hợp nếu là lễ tân`
```json
{
    "data": {
        "id": 3,
        "email": "letan@gmail.com",
        "name": "anh ngoc",
        "role": "LE_TAN",
        "status": true,
        "createdAt": "2025-09-09T14:21:07"
    },
    "message": "Get info successfully"
}
```
**Response:** `trường hợp nếu là Bác sĩ`
```json
{
    "data": {
        "id": 39,
        "email": "bacsi01@gmail.com",
        "name": "",
        "role": "BAC_SI",
        "status": true,
        "createdAt": "2025-09-12T13:07:40",
        "doctor": {
            "id": 32,
            "fullName": "BS. LE THI CC",
            "phone": "0900000039",
            "address": "BẮC NINH",
            "birth": "1993-08-20",
            "gender": "NU",
            "profileImage": "https://i.pravatar.cc/150?img=39",
            "exp": 5,
            "position": "ThS. LE THI CC",
            "available": true
        }
    },
    "message": "Get info successfully"
}
```
**Response:** `trường hợp nếu là bệnh nhân`
```json
{
    "data": {
        "id": 1,
        "email": "tienolympia2020@gmail.com",
        "phone": "0395527082",
        "name": "",
        "role": "BENH_NHAN",
        "status": true,
        "createdAt": "2025-09-09T08:58:19"
    },
    "message": "Get info successfully"
}
```

### 16.4 Xóa người dùng
**Endpoint:** `DELETE /api/users/{id}`

**Mô tả:** Xóa tài khoản người dùng

**Path Parameters:**
- `id`: ID của người dùng

**Response:**
- Status: 204 No Content

---

## 17. HTML Export API

### Base URL: `/api/html`

### 17.1 Xuất HTML phiếu khám
**Endpoint:** `GET /api/html/medical-record/{id}`

**Mô tả:** Xuất phiếu khám bệnh dưới dạng HTML

**Path Parameters:**
- `id`: ID của hồ sơ bệnh án

**Response:**
- Content-Type: text/html
- Body: HTML content của phiếu khám

---

### 17.2 Xuất HTML hóa đơn
**Endpoint:** `GET /api/html/invoice/{medicalRecordId}`

**Mô tả:** Xuất hóa đơn thanh toán dưới dạng HTML

**Path Parameters:**
- `medicalRecordId`: ID của hồ sơ bệnh án

**Response:**
- Content-Type: text/html
- Body: HTML content của hóa đơn

---


## 18. upload image api
**Endpoint:** ``/api/files/multiple ``
**mô tả** upload nhiều ảnh

body dạng form data
files, type (xn,avatars)

**response**
```
{
    "data": [
        "https://files.tienpndev.id.vn/phongkham/xn/xn/af3a6cd8-0015-4836-ae5e-6621f2644d9f.png",
        "https://files.tienpndev.id.vn/phongkham/xn/xn/1ecd5ac9-676a-4b06-bc13-6e2d60723dab.jpeg"
    ],
    "message": "Upload files successfully"
}
```
## 19. send email
**Endpoint:** ``/api/emails/contact ``
request
{
    "name":"a",
    "email": "b",
    "title":"c",
    "message":"d"
}

## Thông tin chung

### Authentication
Hầu hết các endpoint yêu cầu authentication thông qua JWT token:
```
Authorization: Bearer {token}
```

### Error Response Format
```json
{
  "error": "string",
  "message": "string",
  "status": 400
}
```

### Status Codes
- `200`: Thành công
- `201`: Tạo mới thành công
- `204`: Xóa thành công (No Content)
- `400`: Lỗi request không hợp lệ
- `401`: Chưa xác thực
- `403`: Không có quyền truy cập
- `404`: Không tìm thấy
- `500`: Lỗi server

### Date/Time Format
- Date: `yyyy-MM-dd` (VD: 2024-12-20)
- Time: `HH:mm:ss` (VD: 09:30:00)
- DateTime: `yyyy-MM-dd'T'HH:mm:ss` (VD: 2024-12-20T09:30:00)

### Enums
#### Trạng thái
#### Gender
NAM,NU

#### Appointment Status
DA_XAC_NHAN, KHONG_DEN, DANG_KHAM

#### Medical Record Status
CHO_KHAM, DANG_KHAM, CHO_XET_NGHIEM, HOAN_THANH, HUY, CHO_KET_QUA

#### Lab Order Status
CHO_THUC_HIEN, DANG_THUC_HIEN, HOAN_THANH, HUY_BO

#### Leave Status
CHO_DUYET, DA_DUYET, TU_CHOI

#### Shift
SANG, CHIEU, TOI
#### User Roles
- `BENH_NHAN`: Bệnh nhân
- `BAC_SI`: Bác sĩ
- `LE_TAN`: Lễ tân
- `ADMIN`: Quản trị viên

---

## Ghi chú
- Tài liệu này mô tả tất cả API endpoints của hệ thống quản lý phòng khám
- Một số endpoint có thể yêu cầu quyền đặc biệt tùy theo role của user

