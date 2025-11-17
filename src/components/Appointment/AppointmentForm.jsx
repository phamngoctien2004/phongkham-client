import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import appointmentService from '../../services/appointmentService';
import TimePickerModal from './TimePickerModal';
import DatePickerModal from './DatePickerModal';
import './Appointment.css';

const APPOINTMENT_TYPES = [
    { value: 'CHUYEN_KHOA', label: 'Khám chuyên khoa', icon: 'bi-hospital' },
    { value: 'XET_NGHIEM', label: 'Xét nghiệm', icon: 'bi-clipboard-pulse' },
    { value: 'DICH_VU', label: 'Gói khám', icon: 'bi-boxes' },
];

// Tạo các khung giờ 30 phút
const generateTimeSlots = (startHour, startMinute, endHour, endMinute) => {
    const slots = [];
    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
        const nextMinute = currentMinute + 30;
        const nextHour = nextMinute >= 60 ? currentHour + 1 : currentHour;
        const adjustedMinute = nextMinute >= 60 ? nextMinute - 60 : nextMinute;

        const startTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        const endTime = `${nextHour.toString().padStart(2, '0')}:${adjustedMinute.toString().padStart(2, '0')}`;

        slots.push({
            value: `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:00`,
            label: `${startTime} - ${endTime}`
        });

        currentHour = nextHour;
        currentMinute = adjustedMinute;

        // Dừng nếu đã đến slot cuối cùng
        if (currentHour === endHour && currentMinute === endMinute) break;
    }

    return slots;
};

// Sáng: 7:00-7:30 đến 11:30-12:00
const TIME_SLOTS_MORNING = generateTimeSlots(7, 0, 11, 30);
// Chiều: 13:00-13:30 đến 16:30-17:00
const TIME_SLOTS_AFTERNOON = generateTimeSlots(13, 0, 16, 30);
// Tối: giữ nguyên hoặc xóa nếu không dùng
const TIME_SLOTS_EVENING = generateTimeSlots(17, 0, 23, 0);

const AppointmentForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showTimePickerModal, setShowTimePickerModal] = useState(false);
    const [showDatePickerModal, setShowDatePickerModal] = useState(false);

    // Step 1: Chọn bệnh nhân
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Step 2: Chọn loại khám
    const [appointmentType, setAppointmentType] = useState('');
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    // Step 3: Chọn ngày giờ
    // Ngày mặc định là trống (không chọn)
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedShift, setSelectedShift] = useState(''); // Tự động xác định dựa trên giờ chọn
    const [selectedTime, setSelectedTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]); // Lưu dữ liệu từ API (tất cả các ca)

    // Triệu chứng
    const [symptoms, setSymptoms] = useState('');

    // Load danh sách bệnh nhân khi component mount
    useEffect(() => {
        loadPatients();
    }, []);

    // Auto-select doctor if coming from doctor card
    useEffect(() => {
        if (location.state?.selectedDoctor) {
            const doctor = location.state.selectedDoctor;
            // Tự động chọn loại khám chuyên khoa
            setAppointmentType('CHUYEN_KHOA');

            // Nếu bác sĩ có thông tin khoa, tự động chọn khoa
            if (doctor.departmentResponse) {
                setSelectedDepartment(doctor.departmentResponse);
            }

            // Tự động chọn bác sĩ
            setSelectedDoctor(doctor);
            // Chỉ hiển thị 1 thông báo duy nhất
            toast.success(`Đặt lịch khám với ${doctor.fullName}`);
        }
    }, [location.state]);

    // Auto-select service if coming from service detail page
    useEffect(() => {
        if (location.state?.selectedService) {
            const service = location.state.selectedService;
            setAppointmentType(service.type);
            setSelectedService(service);
            toast.success(`Đã chọn dịch vụ: ${service.name}`);
        }
    }, [location.state]);

    const loadPatients = async () => {
        try {
            const response = await appointmentService.getPatients();
            setPatients(response.data || []);
        } catch (error) {
            toast.error('Không thể tải danh sách bệnh nhân');
            console.error(error);
        }
    };

    // Load danh sách bác sĩ hoặc dịch vụ khi chọn loại khám
    useEffect(() => {
        if (appointmentType === 'CHUYEN_KHOA') {
            loadDepartments();
        } else if (appointmentType) {
            loadServices(appointmentType);
        }
    }, [appointmentType]);

    const loadDepartments = async () => {
        try {
            setLoading(true);
            const response = await appointmentService.getDepartments();
            setDepartments(response || []);
        } catch (error) {
            toast.error('Không thể tải danh sách chuyên khoa');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Load doctors when department is selected OR when coming from doctor card
    useEffect(() => {
        if (appointmentType === 'CHUYEN_KHOA' && selectedDepartment && departments.length > 0) {
            loadDoctorsByDepartment();
        }
    }, [selectedDepartment, appointmentType, departments]);

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

    const loadServices = async (type) => {
        try {
            setLoading(true);
            const response = await appointmentService.getServices(type);
            // Handle response structure - could be array or object with data property
            let processedData = Array.isArray(response) ? response : (response?.data || []);
            // Lọc theo type để đảm bảo chỉ hiển thị đúng loại dịch vụ
            const filteredServices = processedData.filter(service => service.type === type);
            setServices(filteredServices);
        } catch (error) {
            toast.error('Không thể tải danh sách dịch vụ');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Load available schedules when conditions change for CHUYEN_KHOA
    useEffect(() => {
        // CHỈ gọi API khi đã chọn bác sĩ + ngày
        if (appointmentType === 'CHUYEN_KHOA' && selectedDoctor && selectedDate) {
            loadAvailableSchedules();
        } else {
            // Nếu chưa chọn bác sĩ → clear availableSlots để tất cả giờ đều available
            setAvailableSlots([]);
        }
    }, [selectedDate, appointmentType, selectedDoctor]);

    // ⭐ Kiểm tra giờ đã chọn có còn hợp lệ không sau khi availableSlots thay đổi
    useEffect(() => {
        if (appointmentType === 'CHUYEN_KHOA' && selectedDoctor && selectedDate && selectedTime && availableSlots.length > 0) {
            const hour = parseInt(selectedTime.split(':')[0]);
            let shift;
            if (hour >= 7 && hour < 13) {
                shift = 'SANG';
            } else if (hour >= 13 && hour < 17) {
                shift = 'CHIEU';
            } else {
                shift = 'TOI';
            }

            const doctorSlot = availableSlots.find(s =>
                s.id === selectedDoctor.id && s.shift === shift
            );

            if (doctorSlot) {
                const isInvalid = !doctorSlot.available || doctorSlot.invalidTimes.includes(selectedTime);
                if (isInvalid) {
                    toast.warning(`Khung giờ ${selectedTime.substring(0, 5)} không hợp lệ cho bác sĩ này. Vui lòng chọn khung giờ khác.`);
                    setSelectedTime(''); // Reset time
                }
            } else {
                // Không tìm thấy ca này
                toast.warning(`Bác sĩ không có lịch làm việc trong ca này. Vui lòng chọn khung giờ khác.`);
                setSelectedTime('');
            }
        }
    }, [availableSlots, appointmentType, selectedDoctor, selectedDate, selectedTime]);

    // Load available schedules based on current selections
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
            };

            const response = await appointmentService.getAvailableSchedules(params);
            if (response.data && response.data.length > 0) {
                const dayData = response.data[0];
                // Lưu tất cả shifts available của bác sĩ trong ngày
                const slots = dayData.doctors || [];
                console.log('📅 Available Slots từ API:', slots);
                setAvailableSlots(slots);
            } else {
                setAvailableSlots([]);
            }
        } catch (error) {
            console.error('Error loading available schedules:', error);
            setAvailableSlots([]);
        }
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getTimeSlotsByShift = (shift) => {
        switch (shift) {
            case 'MORNING':
            case 'SANG':
                return TIME_SLOTS_MORNING;
            case 'AFTERNOON':
            case 'CHIEU':
                return TIME_SLOTS_AFTERNOON;
            case 'EVENING':
            case 'TOI':
                return TIME_SLOTS_EVENING;
            default:
                return [];
        }
    };

    // KHÔNG BAO GIỜ DISABLE BÁC SĨ - chỉ disable khung giờ
    // Hàm này không còn dùng nữa, giữ lại để tránh lỗi
    const isDoctorAvailable = (doctorId) => {
        return true; // Luôn cho phép chọn bác sĩ
    };

    // Check if time slot is available
    const isTimeSlotAvailable = (timeValue, shiftName) => {
        // Chưa chọn ngày → tất cả giờ đều available
        if (!selectedDate || appointmentType !== 'CHUYEN_KHOA') {
            return true;
        }

        // CHƯA CHỌN BÁC SĨ → tất cả giờ đều available
        if (!selectedDoctor) {
            return true;
        }

        // ĐÃ CHỌN BÁC SĨ → kiểm tra schedule của bác sĩ đó
        if (availableSlots.length === 0) {
            return false;
        }

        const doctorSlot = availableSlots.find(s =>
            s.id === selectedDoctor.id && s.shift === shiftName
        );

        console.log(`🕐 Checking time ${timeValue} (shift: ${shiftName}):`, {
            doctorSlot,
            available: doctorSlot?.available,
            invalidTimes: doctorSlot?.invalidTimes,
            isInvalid: doctorSlot?.invalidTimes?.includes(timeValue)
        });

        // Không tìm thấy slot cho ca này → unavailable
        if (!doctorSlot) {
            return false;
        }

        // Ca không available → disable toàn bộ ca
        if (!doctorSlot.available) {
            return false;
        }

        // Kiểm tra invalidTimes (09:00:00 = khung 9:00-9:30)
        // Chuẩn hóa format để so sánh (có thể backend trả về 09:00 hoặc 09:00:00)
        const normalizedTime = timeValue.includes(':00:00') ? timeValue : `${timeValue}:00`;
        const invalidTimes = doctorSlot.invalidTimes || [];

        // Normalize cả mảng invalidTimes để so sánh
        const normalizedInvalidTimes = invalidTimes.map(time => {
            if (typeof time === 'string') {
                return time.includes(':00:00') ? time : `${time}:00`;
            }
            return time;
        });

        const isInvalid = normalizedInvalidTimes.includes(normalizedTime);

        console.log(`🕐 Final check ${timeValue}:`, {
            normalizedTime,
            normalizedInvalidTimes,
            isInvalid
        });

        return !isInvalid;
    };

    const handleSubmit = () => {
        // Validation
        if (!selectedPatient) {
            toast.error('Vui lòng chọn bệnh nhân');
            return;
        }
        if (!appointmentType) {
            toast.error('Vui lòng chọn loại khám');
            return;
        }
        if (appointmentType === 'CHUYEN_KHOA') {
            if (!selectedDepartment) {
                toast.error('Vui lòng chọn chuyên khoa');
                return;
            }
            if (!selectedDoctor) {
                toast.error('Vui lòng chọn bác sĩ');
                return;
            }

            // ⭐ VALIDATION MỚI: Kiểm tra giờ có hợp lệ với bác sĩ không
            if (selectedDate && selectedTime) {
                const hour = parseInt(selectedTime.split(':')[0]);
                let shift;
                if (hour >= 7 && hour < 13) {
                    shift = 'SANG';
                } else if (hour >= 13 && hour < 17) {
                    shift = 'CHIEU';
                } else {
                    shift = 'TOI';
                }

                const doctorSlot = availableSlots.find(s =>
                    s.id === selectedDoctor.id && s.shift === shift
                );

                if (doctorSlot) {
                    const isInvalid = !doctorSlot.available || doctorSlot.invalidTimes.includes(selectedTime);
                    if (isInvalid) {
                        toast.error('Khung giờ đã chọn không hợp lệ cho bác sĩ này. Vui lòng chọn khung giờ khác.');
                        return;
                    }
                } else if (availableSlots.length > 0) {
                    // Có availableSlots nhưng không tìm thấy ca này → bác sĩ không làm ca này
                    toast.error('Bác sĩ không có lịch làm việc trong ca này. Vui lòng chọn khung giờ khác.');
                    return;
                }
            }
        }
        if (appointmentType !== 'CHUYEN_KHOA' && !selectedService) {
            toast.error('Vui lòng chọn dịch vụ');
            return;
        }
        if (!selectedDate) {
            toast.error('Vui lòng chọn ngày khám');
            return;
        }
        if (!selectedTime) {
            toast.error('Vui lòng chọn giờ khám');
            return;
        }

        setShowConfirmModal(true);
    };

    const handleConfirmAppointment = async () => {
        try {
            setLoading(true);
            setShowConfirmModal(false);

            const appointmentData = {
                patientId: selectedPatient.id,
                date: selectedDate,
                time: selectedTime,
                symptoms: symptoms || '',
            };

            if (appointmentType === 'CHUYEN_KHOA') {
                appointmentData.doctorId = selectedDoctor.id;
                appointmentData.healthPlanId = null;
            } else {
                appointmentData.doctorId = null;
                appointmentData.healthPlanId = selectedService.id;
            }

            // Tạo lịch hẹn
            const appointmentResponse = await appointmentService.createAppointment(appointmentData);
            const appointmentId = appointmentResponse.data.id;

            // Gửi email thông báo đặt lịch thành công (không block flow nếu lỗi)
            try {
                await appointmentService.sendEmailSuccess(appointmentId);
                console.log(`✉️ Sent appointment success email for ${appointmentId}`);
            } catch (emailErr) {
                console.warn('Failed to send appointment success email:', emailErr);
            }

            toast.success('Đặt lịch thành công!');

            // Chuyển sang trang thanh toán
            navigate(`/dat-lich/thanh-toan/${appointmentId}`);
        } catch (error) {
            toast.error(error.message || 'Đặt lịch thất bại. Vui lòng thử lại.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTime = (timeValue) => {
        // Kiểm tra validation trước khi set time
        if (selectedDoctor && selectedDate && timeValue) {
            const hour = parseInt(timeValue.split(':')[0]);
            let shift;
            if (hour >= 7 && hour < 13) {
                shift = 'SANG';
            } else if (hour >= 13 && hour < 17) {
                shift = 'CHIEU';
            } else {
                shift = 'TOI';
            }

            const doctorSlot = availableSlots.find(s =>
                s.id === selectedDoctor.id && s.shift === shift
            );

            if (doctorSlot) {
                // Chuẩn hóa format để so sánh
                const normalizedTime = timeValue.includes(':00:00') ? timeValue : `${timeValue}:00`;
                const invalidTimes = doctorSlot.invalidTimes || [];
                const normalizedInvalidTimes = invalidTimes.map(time => {
                    if (typeof time === 'string') {
                        return time.includes(':00:00') ? time : `${time}:00`;
                    }
                    return time;
                });

                const isInvalid = !doctorSlot.available || normalizedInvalidTimes.includes(normalizedTime);

                console.log(`⚠️ Validation khi chọn giờ ${timeValue}:`, {
                    timeValue,
                    normalizedTime,
                    available: doctorSlot.available,
                    invalidTimes: doctorSlot.invalidTimes,
                    normalizedInvalidTimes,
                    isInvalid
                });

                if (isInvalid) {
                    toast.warning('Khung giờ này không hợp lệ cho bác sĩ đã chọn. Vui lòng chọn khung giờ khác.');
                    return;
                }
            }
        }

        setSelectedTime(timeValue);
        // Tự động xác định ca khám dựa trên giờ được chọn
        const hour = parseInt(timeValue.split(':')[0]);
        if (hour >= 7 && hour < 13) {
            setSelectedShift('SANG');
        } else if (hour >= 13 && hour < 17) {
            setSelectedShift('CHIEU');
        } else {
            setSelectedShift('TOI');
        }
    };

    const getSelectedDoctorOrServiceName = () => {
        if (appointmentType === 'CHUYEN_KHOA' && selectedDoctor) {
            return selectedDoctor.fullName;
        } else if (selectedService) {
            return selectedService.name;
        }
        return '';
    };

    return (
        <section id="dat-lich" className="appointment section pt-0">
            <div className="appointment-page">
                <div className="container">
                    <div className="appointment-header" >
                        <h1 style={{ color: '#1e88e5', fontSize: '28px', fontWeight: '700', marginBottom: '10px' }}>
                            ĐĂNG KÝ KHÁM BỆNH
                        </h1>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '30px' }}>
                            Quý khách hàng có nhu cầu đặt hẹn khám tại Hệ thống phòng khám đa khoa Thái Hà
                        </p>
                    </div>

                    <div className="appointment-form-container">
                        <form className="appointment-form" style={{ padding: '30px', maxWidth: '700px', margin: '0 auto' }}>
                            {/* Chọn bệnh nhân */}
                            <div className="form-section">
                                <div className="form-group">
                                    <label>Chọn bệnh nhân <span className="required">*</span></label>
                                    <select
                                        className="form-control"
                                        value={selectedPatient?.id || ''}
                                        onChange={(e) => {
                                            const patient = patients.find(p => p.id === parseInt(e.target.value));
                                            setSelectedPatient(patient);
                                        }}
                                        required
                                    >
                                        <option value="">-- Chọn bệnh nhân --</option>
                                        {patients.map((patient) => (
                                            <option key={patient.id} value={patient.id}>
                                                {patient.fullName} - {patient.code}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Thông tin bệnh nhân - Hiển thị luôn */}
                            <div className="form-section" style={{ marginTop: '20px' }}>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Họ và tên</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Họ & tên"
                                                value={selectedPatient?.fullName || ''}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Ngày sinh</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ngày sinh"
                                                value={selectedPatient?.birth ? new Date(selectedPatient.birth).toLocaleDateString('vi-VN') : ''}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Giới tính</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Giới tính"
                                                value={selectedPatient?.gender === 'NAM' ? 'Nam' : selectedPatient?.gender === 'NU' ? 'Nữ' : ''}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Email"
                                                value={selectedPatient?.email || ''}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chọn loại khám - Hiển thị luôn */}
                            <div className="form-section">
                                <div className="form-group">
                                    <label>Chọn loại khám <span className="required">*</span></label>
                                    <select
                                        className="form-control"
                                        value={appointmentType}
                                        onChange={(e) => {
                                            const newType = e.target.value;
                                            setAppointmentType(newType);
                                            // Chỉ reset nếu thay đổi type khác với type đã auto-select
                                            if (!location.state?.selectedDoctor || newType !== 'CHUYEN_KHOA') {
                                                setSelectedDoctor(null);
                                                setSelectedDepartment(null);
                                                setDoctors([]);
                                            }
                                            setSelectedService(null);
                                            setAvailableSlots([]);
                                            // DON'T reset date and time - they should persist
                                        }}
                                        required
                                    >
                                        <option value="">-- Chọn loại khám --</option>
                                        {APPOINTMENT_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Chọn chuyên khoa (only for CHUYEN_KHOA) */}
                                {appointmentType === 'CHUYEN_KHOA' && (
                                    <div className="form-group">
                                        <label>Chọn chuyên khoa <span className="required">*</span></label>
                                        <select
                                            className="form-control"
                                            value={selectedDepartment?.id || ''}
                                            onChange={(e) => {
                                                const dept = departments.find(d => d.id === parseInt(e.target.value));
                                                setSelectedDepartment(dept);
                                                // Chỉ reset doctor nếu người dùng thay đổi department khác
                                                if (!location.state?.selectedDoctor || dept?.id !== location.state.selectedDoctor.departmentResponse?.id) {
                                                    setSelectedDoctor(null);
                                                }
                                                setDoctors([]); // Reset doctors list to reload
                                                setAvailableSlots([]); // Reset available slots
                                                // DON'T reset date and time
                                            }}
                                            required
                                        >
                                            <option value="">-- Chọn chuyên khoa --</option>
                                            {departments.map((dept) => (
                                                <option key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Chọn bác sĩ hoặc dịch vụ - Hiển thị luôn */}
                                <div className="form-group">
                                    <label>
                                        {appointmentType === 'CHUYEN_KHOA' ? 'Chọn bác sĩ' :
                                            appointmentType === 'XET_NGHIEM' ? 'Chọn xét nghiệm' :
                                                appointmentType === 'DICH_VU' ? 'Chọn gói khám' :
                                                    'Chọn dịch vụ'}
                                        <span className="required">*</span>
                                    </label>
                                    {appointmentType === 'CHUYEN_KHOA' ? (
                                        <select
                                            className="form-control"
                                            value={selectedDoctor?.id || ''}
                                            onChange={(e) => {
                                                const doctorId = e.target.value;

                                                // Nếu chọn "-- Chọn bác sĩ --" (value = "")
                                                if (!doctorId) {
                                                    setSelectedDoctor(null);
                                                    setAvailableSlots([]); // Clear slots → tất cả giờ available
                                                    return;
                                                }

                                                const doctor = doctors.find(d => d.id === parseInt(doctorId));
                                                setSelectedDoctor(doctor);

                                                // useEffect sẽ tự động kiểm tra và cảnh báo nếu giờ không hợp lệ
                                            }}
                                            required
                                            disabled={!appointmentType || (appointmentType === 'CHUYEN_KHOA' && !selectedDepartment)}
                                        >
                                            <option value="">-- Chọn bác sĩ --</option>
                                            {doctors.map((doctor) => (
                                                <option
                                                    key={doctor.id}
                                                    value={doctor.id}
                                                >
                                                    {doctor.fullName} - {doctor.position}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <select
                                            className="form-control"
                                            value={selectedService?.id || ''}
                                            onChange={(e) => {
                                                const service = services.find(s => s.id === parseInt(e.target.value));
                                                setSelectedService(service);
                                            }}
                                            required
                                            disabled={!appointmentType || appointmentType === 'CHUYEN_KHOA'}
                                        >
                                            <option value="">
                                                {appointmentType === 'XET_NGHIEM' ? '-- Chọn xét nghiệm --' :
                                                    appointmentType === 'DICH_VU' ? '-- Chọn gói khám --' :
                                                        '-- Chọn dịch vụ --'}
                                            </option>
                                            {services.map((service) => (
                                                <option key={service.id} value={service.id}>
                                                    {service.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            {/* Chọn ngày và giờ khám - Hiển thị luôn */}
                            <div className="form-section">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Ngày khám</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="-- Chọn ngày khám --"
                                                value={selectedDate ? (() => {
                                                    const date = new Date(selectedDate);
                                                    return date.toLocaleDateString('vi-VN', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit'
                                                    });
                                                })() : ''}
                                                readOnly
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setShowDatePickerModal(true)}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Giờ khám</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="-- Chọn giờ khám --"
                                                value={selectedTime ? (() => {
                                                    const allSlots = [...TIME_SLOTS_MORNING, ...TIME_SLOTS_AFTERNOON, ...TIME_SLOTS_EVENING];
                                                    const slot = allSlots.find(s => s.value === selectedTime);
                                                    return slot ? slot.label : selectedTime.substring(0, 5);
                                                })() : ''}
                                                readOnly
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setShowTimePickerModal(true)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Nhập vấn đề sức khỏe - Hiển thị luôn */}
                            <div className="form-section">
                                <div className="form-group">
                                    <label>Nhập vấn đề sức khỏe cần khám</label>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        placeholder="Nhập tình trạng sức khỏe của bạn"
                                        value={symptoms}
                                        onChange={(e) => setSymptoms(e.target.value)}
                                        style={{ resize: 'vertical', minHeight: '120px' }}
                                    ></textarea>
                                </div>
                            </div>

                            {/* Submit button */}
                            <div className="form-actions" style={{ marginTop: '30px' }}>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-lg w-100"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    style={{
                                        backgroundColor: '#1e88e5',
                                        border: 'none',
                                        padding: '14px',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        borderRadius: '4px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.6 : 1
                                    }}
                                >
                                    {loading ? 'Đang xử lý...' : 'ĐẶT LỊCH'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Confirmation Modal */}
                {showConfirmModal && (
                    <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Xác nhận đặt lịch</h3>
                                <button className="btn-close" onClick={() => setShowConfirmModal(false)}>
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="confirm-info">
                                    <div className="confirm-item">
                                        <strong>Bệnh nhân:</strong>
                                        <span>{selectedPatient?.fullName}</span>
                                    </div>
                                    <div className="confirm-item">
                                        <strong>Loại khám:</strong>
                                        <span>{APPOINTMENT_TYPES.find(t => t.value === appointmentType)?.label}</span>
                                    </div>
                                    <div className="confirm-item">
                                        <strong>{appointmentType === 'CHUYEN_KHOA' ? 'Bác sĩ' : 'Dịch vụ'}:</strong>
                                        <span>{getSelectedDoctorOrServiceName()}</span>
                                    </div>
                                    <div className="confirm-item">
                                        <strong>Ngày khám:</strong>
                                        <span>{new Date(selectedDate).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="confirm-item">
                                        <strong>Giờ khám:</strong>
                                        <span>{
                                            (() => {
                                                // Tìm label của time slot từ value
                                                const allSlots = [...TIME_SLOTS_MORNING, ...TIME_SLOTS_AFTERNOON, ...TIME_SLOTS_EVENING];
                                                const slot = allSlots.find(s => s.value === selectedTime);
                                                return slot ? slot.label : selectedTime.substring(0, 5);
                                            })()
                                        }</span>
                                    </div>
                                    {symptoms && (
                                        <div className="confirm-item">
                                            <strong>Triệu chứng:</strong>
                                            <span>{symptoms}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowConfirmModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleConfirmAppointment}
                                    disabled={loading}
                                >
                                    {loading ? 'Đang xử lý...' : 'Xác nhận'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Time Picker Modal */}
                <TimePickerModal
                    isOpen={showTimePickerModal}
                    onClose={() => setShowTimePickerModal(false)}
                    onSelectTime={handleSelectTime}
                    morningSlots={TIME_SLOTS_MORNING}
                    afternoonSlots={TIME_SLOTS_AFTERNOON}
                    eveningSlots={TIME_SLOTS_EVENING}
                    isTimeSlotAvailable={isTimeSlotAvailable}
                    selectedTime={selectedTime}
                />

                {/* Date Picker Modal */}
                <DatePickerModal
                    isOpen={showDatePickerModal}
                    onClose={() => setShowDatePickerModal(false)}
                    onSelectDate={(date) => {
                        setSelectedDate(date);
                    }}
                    selectedDate={selectedDate}
                    minDate={formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000))}
                    maxDate={formatDate(new Date(Date.now() + 8 * 24 * 60 * 60 * 1000))}
                />
            </div>
        </section>
    );
};

export default AppointmentForm;
