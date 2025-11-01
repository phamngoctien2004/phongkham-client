import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import appointmentService from '../services/appointmentService';
import aiService from '../services/aiService';
import './AIChatPage.css';
import '../components/Appointment/Appointment.css'; // Import appointment styles
import 'bootstrap-icons/font/bootstrap-icons.css';

function AIChatPage() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Xin chào! Tôi là trợ lý AI y tế của phòng khám. Tôi có thể giúp bạn:\n- Tư vấn về triệu chứng bệnh\n- Cung cấp kiến thức y học\n- Đề xuất bác sĩ phù hợp\n\nBạn đang gặp vấn đề gì về sức khỏe?'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [expandedSlots, setExpandedSlots] = useState({});
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [chatHistory, setChatHistory] = useState([
        { id: 1, title: 'Cuộc trò chuyện hiện tại', date: new Date().toLocaleDateString('vi-VN') }
    ]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState(null);

    // Form states
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [symptoms, setSymptoms] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const shouldScrollRef = useRef(false); // Flag để kiểm soát scroll

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        // Chỉ scroll khi shouldScrollRef được set là true (khi user gửi tin nhắn)
        if (shouldScrollRef.current) {
            scrollToBottom();
            shouldScrollRef.current = false; // Reset flag
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        shouldScrollRef.current = true; // Bật scroll khi user gửi tin nhắn

        try {
            const data = await aiService.sendChatMessage(input, messages);

            // Console log toàn bộ response từ AI
            console.log('=== AI RESPONSE ===');
            console.log('Full data:', data);
            console.log('Response text:', data.response);
            console.log('Sources:', data.sources);
            console.log('Needs appointment:', data.needs_appointment);
            console.log('Recommended doctors:', data.recommended_doctors);

            // Log chi tiết từng doctor nếu có
            if (data.recommended_doctors && data.recommended_doctors.length > 0) {
                data.recommended_doctors.forEach((doctor, index) => {
                    console.log(`\n--- Doctor ${index + 1} ---`);
                    console.log('Doctor ID:', doctor.doctor_id);
                    console.log('Doctor Name:', doctor.doctor_name);
                    console.log('Specialty:', doctor.specialty);
                    console.log('Confidence:', doctor.confidence);
                    console.log('Available slots:', doctor.available_slots);

                    // Log chi tiết từng slot
                    if (doctor.available_slots && doctor.available_slots.length > 0) {
                        doctor.available_slots.forEach((slot, slotIndex) => {
                            console.log(`  Slot ${slotIndex + 1}:`, {
                                date: slot.date,
                                shift: slot.shift,
                                total_slots: slot.total_slots,
                                available_times: slot.available_times,
                                invalidTimes: slot.invalidTimes,
                                available: slot.available
                            });
                        });
                    }
                });
            }
            console.log('==================\n');

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response,
                sources: data.sources,
                needsAppointment: data.needs_appointment,
                recommendedDoctors: data.recommended_doctors || []
            }]);

        } catch (error) {
            console.error('API Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '⚠️ Không thể kết nối đến server backend.\n\nVui lòng đảm bảo:\n1. Backend đang chạy tại http://localhost:8000\n2. Chạy: python chatbot_backend.py\n\nLỗi: ' + error.message,
                error: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleSlotSelection = (messageIdx, doctorId, date, shift, time, doctorName) => {
        const slotKey = `${messageIdx}_${doctorId}_${date}_${shift}_${time}`;
        setSelectedSlot({
            key: slotKey,
            messageIndex: messageIdx,
            doctorId,
            doctorName,
            date,
            shift,
            time
        });
    };

    const handleBookAppointment = (doctor, messageIdx) => {
        const slotInfo = selectedSlot;
        if (!slotInfo || slotInfo.messageIndex !== messageIdx || slotInfo.doctorId !== doctor.doctor_id) {
            alert('⚠️ Vui lòng chọn khung giờ khám trước!');
            return;
        }

        // Mở modal với thông tin đã chọn
        setBookingData({
            doctor,
            slot: slotInfo
        });
        setShowBookingModal(true);
        loadPatients(); // Load danh sách bệnh nhân
    };

    const loadPatients = async () => {
        try {
            setFormLoading(true);
            const response = await appointmentService.getPatients();
            console.log('Patients response:', response); // Debug log

            // Xử lý cả hai trường hợp: response.data hoặc response trực tiếp
            const patientsList = response.data || response || [];
            console.log('Patients list:', patientsList); // Debug log

            setPatients(patientsList);
        } catch (error) {
            toast.error('Không thể tải danh sách bệnh nhân');
            console.error('Load patients error:', error);
        } finally {
            setFormLoading(false);
        }
    };

    const handleConfirmBooking = async () => {
        if (!selectedPatient) {
            toast.error('Vui lòng chọn bệnh nhân');
            return;
        }

        try {
            setFormLoading(true);

            // Chuẩn bị dữ liệu giống AppointmentForm
            const appointmentData = {
                patientId: selectedPatient.id,
                date: bookingData.slot.date,
                time: bookingData.slot.time,
                symptoms: symptoms || bookingData.doctor.reason || '',
                doctorId: bookingData.doctor.doctor_id,
                healthPlanId: null // Vì là khám chuyên khoa
            };

            // Bước 1: Tạo lịch hẹn
            const appointmentResponse = await appointmentService.createAppointment(appointmentData);
            const appointmentId = appointmentResponse.data.id;

            // Bước 2: Xác nhận lịch hẹn (cập nhật trạng thái sang DA_XAC_NHAN)
            await appointmentService.confirmAppointment(appointmentId, 'DA_XAC_NHAN');

            // Bước 3: Clear cache lịch khám của bác sĩ trong AI chatbot
            try {
                await aiService.clearDoctorScheduleCache(bookingData.doctor.doctor_id);
                console.log(`✅ Cleared AI cache for doctor ${bookingData.doctor.doctor_id}`);
            } catch (cacheError) {
                // Không fail nếu clear cache thất bại, chỉ log warning
                console.warn('⚠️ Failed to clear AI cache:', cacheError);
            }

            toast.success('✅ Đặt lịch thành công!');

            // Reset states
            setSelectedSlot(null);
            setSelectedPatient(null);
            setSymptoms('');
            setShowBookingModal(false);

            // Chuyển sang trang thanh toán
            navigate(`/dat-lich/thanh-toan/${appointmentId}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đặt lịch thất bại. Vui lòng thử lại!');
            console.error(error);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="ai-chat-page">
            <div className="ai-chat-layout">
                {/* Sidebar - Chat History */}
                <div className={`ai-sidebar-history ${sidebarOpen ? 'open' : 'closed'}`}>
                    <div className="sidebar-header">
                        <button
                            onClick={() => navigate(-1)}
                            className="ai-back-button-sidebar"
                            aria-label="Quay lại"
                        >
                            <i className="bi bi-arrow-left back-icon"></i>
                            <span className="back-text">Quay lại</span>
                        </button>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="sidebar-toggle"
                            aria-label="Toggle sidebar"
                        >
                            <i className={`bi bi-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
                        </button>
                    </div>

                    {sidebarOpen && (
                        <>
                            <button className="new-chat-button">
                                <i className="bi bi-plus"></i> Cuộc trò chuyện mới
                            </button>

                            <div className="chat-history-list">
                                <h3 className="history-title">Lịch sử</h3>
                                {chatHistory.map((chat) => (
                                    <div key={chat.id} className="chat-history-item active">
                                        {/* <i className="bi bi-chat-dots chat-icon"></i> */}
                                        <div className="chat-info">
                                            <p className="chat-title">{chat.title}</p>
                                            {/* <p className="chat-date">{chat.date}</p> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Main Chat Area */}
                <div className="ai-chat-main">
                    {/* Header */}
                    <div className="ai-chat-header">
                        {!sidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="sidebar-toggle-header"
                                aria-label="Mở sidebar"
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        )}
                        <div className="ai-header-content">
                            <div className="ai-header-icon">
                                <i className="bi bi-heart-pulse-fill stethoscope-icon"></i>
                            </div>
                            <div className="ai-header-text">
                                <h1 className="ai-header-title">AI Tư Vấn Y Tế</h1>
                                <p className="ai-header-subtitle">Trợ lý thông minh của phòng khám</p>
                            </div>
                        </div>
                        {/* <div className="ai-header-warning">
                            <i className="bi bi-exclamation-triangle-fill warning-icon"></i>
                            <p className="warning-text">
                                <strong>Lưu ý:</strong> Đây là tư vấn tham khảo, không thay thế chẩn đoán y khoa. Vui lòng gặp bác sĩ để được khám chính xác.
                            </p>
                        </div> */}
                    </div>

                    {/* Messages */}
                    <div className="ai-messages-container">
                        <div className="ai-messages-wrapper">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`ai-message ${msg.role === 'user' ? 'ai-message-user' : ''}`}
                                >
                                    {/* Avatar */}
                                    <div className={`ai-avatar ${msg.role === 'user'
                                        ? 'ai-avatar-user'
                                        : msg.error
                                            ? 'ai-avatar-error'
                                            : 'ai-avatar-bot'
                                        }`}>
                                        {msg.role === 'user' ? (
                                            <i className="bi bi-person-fill avatar-icon"></i>
                                        ) : (
                                            <i className="bi bi-robot avatar-icon"></i>
                                        )}
                                    </div>

                                    {/* Message Content */}
                                    <div className={`ai-message-content-wrapper ${msg.role === 'user' ? 'text-right' : ''}`}>
                                        <div className={`ai-message-bubble ${msg.role === 'user'
                                            ? 'ai-bubble-user'
                                            : msg.error
                                                ? 'ai-bubble-error'
                                                : 'ai-bubble-assistant'
                                            }`}>
                                            <p className="ai-message-text">{msg.content}</p>

                                            {/* Appointment Badge
                                            {msg.needsAppointment && (
                                                <div className="ai-appointment-badge">
                                                    <i className="bi bi-calendar-check badge-icon"></i>
                                                    <span>Nên đặt lịch khám</span>
                                                </div>
                                            )} */}

                                            {/* Sources */}
                                            {msg.sources && msg.sources.length > 0 && (
                                                <div className="ai-sources">
                                                    <p className="ai-sources-label"><i className="bi bi-journals"></i> Nguồn tham khảo (click để xem PDF):</p>
                                                    {msg.sources.map((source, i) => {
                                                        const pdfFilename = source.pdf_filename ||
                                                            source.document_name.replace(/_structure$/, '') + '.pdf';
                                                        const pdfUrl = `http://localhost:8000/api/pdfs/${pdfFilename}`;

                                                        return (
                                                            <a
                                                                key={i}
                                                                href={pdfUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="ai-source-link"
                                                                title="Click để mở PDF trong tab mới"
                                                            >
                                                                📄 {source.document_name} (Trang {source.page})
                                                            </a>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Recommended Doctors - Display in message */}
                                            {msg.recommendedDoctors && msg.recommendedDoctors.length > 0 && (
                                                <div className="ai-doctors-section">
                                                    <h3 className="ai-doctors-section-title">
                                                        <i className="bi bi-person-badge doctors-title-icon"></i>
                                                        Bác Sĩ Đề Xuất ({msg.recommendedDoctors.length})
                                                    </h3>

                                                    <div className="ai-doctors-list-inline">
                                                        {(() => {
                                                            const doctorsExpandKey = `msg${idx}_doctors`;
                                                            const visibleDoctors = expandedSlots[doctorsExpandKey]
                                                                ? msg.recommendedDoctors
                                                                : msg.recommendedDoctors.slice(0, 2);

                                                            return (
                                                                <>
                                                                    {visibleDoctors.map((doctor, doctorIdx) => {
                                                                        const doctorKey = `msg${idx}_doctor${doctorIdx}`;

                                                                        return (
                                                                            <div key={doctorIdx} className="ai-doctor-card-inline">
                                                                                <div className="ai-doctor-header-inline">
                                                                                    <div className="ai-doctor-info-inline">
                                                                                        <h4 className="ai-doctor-name-inline">
                                                                                            {doctor.position || 'BS. ' + doctor.doctor_name}
                                                                                        </h4>
                                                                                        <p className="ai-doctor-specialty-inline">{doctor.specialty}</p>
                                                                                    </div>
                                                                                    <span className="ai-confidence-badge-inline">
                                                                                        {Math.round(doctor.confidence * 100)}%
                                                                                    </span>
                                                                                </div>

                                                                                {/* <p className="ai-doctor-reason-inline">💡 {doctor.reason}</p> */}

                                                                                {doctor.examination_fee && (
                                                                                    <p className="ai-doctor-fee-inline">
                                                                                        Phí khám: {doctor.examination_fee.toLocaleString('vi-VN')} VNĐ
                                                                                    </p>
                                                                                )}

                                                                                {/* Available Slots */}
                                                                                {doctor.available_slots && doctor.available_slots.length > 0 && (() => {
                                                                                    const slotsByDate = {};
                                                                                    doctor.available_slots.forEach(slot => {
                                                                                        if (!slotsByDate[slot.date]) {
                                                                                            slotsByDate[slot.date] = [];
                                                                                        }
                                                                                        slotsByDate[slot.date].push(slot);
                                                                                    });

                                                                                    const dateEntries = Object.entries(slotsByDate);
                                                                                    const dateExpandKey = `${doctorKey}_dates`;
                                                                                    const visibleDates = expandedSlots[dateExpandKey] ? dateEntries : dateEntries.slice(0, 3);

                                                                                    return (
                                                                                        <div className="ai-slots-inline">


                                                                                            {visibleDates.map(([date, shifts], dateIdx) => {
                                                                                                const dateObj = new Date(date);
                                                                                                const dateStr = dateObj.toLocaleDateString('vi-VN', {
                                                                                                    weekday: 'short',
                                                                                                    day: '2-digit',
                                                                                                    month: '2-digit'
                                                                                                });
                                                                                                const totalSlotsInDay = shifts.reduce((sum, s) => sum + s.total_slots, 0);

                                                                                                return (
                                                                                                    <div key={dateIdx} className="ai-date-card-inline">
                                                                                                        <div className="ai-date-header-inline">
                                                                                                            <span className="ai-date-text-inline">{dateStr}</span>
                                                                                                        </div>

                                                                                                        {/* Shifts for this date */}
                                                                                                        <div className="ai-shifts-list-inline">
                                                                                                            {shifts.map((shift, shiftIdx) => {
                                                                                                                const shiftName = shift.shift === 'SANG' ? 'Sáng' :
                                                                                                                    shift.shift === 'CHIEU' ? 'Chiều' : ' Tối';

                                                                                                                return (
                                                                                                                    <div key={shiftIdx} className="ai-shift-item-inline">
                                                                                                                        <div className="ai-shift-header-inline">
                                                                                                                            <span className="ai-shift-name-inline">{shiftName}</span>
                                                                                                                            <span className="ai-shift-count-inline">{shift.total_slots} slots</span>
                                                                                                                        </div>

                                                                                                                        {shift.available_times && shift.available_times.length > 0 && (
                                                                                                                            <div className="ai-times-grid-inline">
                                                                                                                                {shift.available_times
                                                                                                                                    .filter(time => {
                                                                                                                                        // Lọc bỏ các giờ trong invalidTimes (nằm trong shift object)
                                                                                                                                        if (shift.invalidTimes && Array.isArray(shift.invalidTimes) && shift.invalidTimes.length > 0) {
                                                                                                                                            return !shift.invalidTimes.includes(time);
                                                                                                                                        }
                                                                                                                                        return true;
                                                                                                                                    })
                                                                                                                                    .map((time, timeIdx) => {
                                                                                                                                        const slotKey = `${idx}_${doctor.doctor_id}_${date}_${shift.shift}_${time}`;
                                                                                                                                        const isSelected = selectedSlot?.key === slotKey;

                                                                                                                                        return (
                                                                                                                                            <button
                                                                                                                                                key={timeIdx}
                                                                                                                                                onClick={() => handleSlotSelection(idx, doctor.doctor_id, date, shift.shift, time, doctor.doctor_name)}
                                                                                                                                                className={`ai-time-button-inline ${isSelected ? 'ai-time-selected-inline' : ''}`}
                                                                                                                                            >
                                                                                                                                                {time}
                                                                                                                                            </button>
                                                                                                                                        );
                                                                                                                                    })}
                                                                                                                            </div>
                                                                                                                        )}
                                                                                                                    </div>
                                                                                                                );
                                                                                                            })}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                );
                                                                                            })}

                                                                                            {/* Show More Dates Button */}
                                                                                            {dateEntries.length > 3 && (
                                                                                                <button
                                                                                                    onClick={(e) => {
                                                                                                        e.preventDefault();
                                                                                                        setExpandedSlots(prev => ({ ...prev, [dateExpandKey]: !prev[dateExpandKey] }));
                                                                                                    }}
                                                                                                    className="ai-expand-dates-button-inline"
                                                                                                >
                                                                                                    {expandedSlots[dateExpandKey]
                                                                                                        ? '▲ Thu gọn'
                                                                                                        : `▼ Xem thêm ${dateEntries.length - 3} ngày`
                                                                                                    }
                                                                                                </button>
                                                                                            )}
                                                                                        </div>
                                                                                    );
                                                                                })()}

                                                                                {/* Book Appointment Button */}
                                                                                <button
                                                                                    onClick={() => handleBookAppointment(doctor, idx)}
                                                                                    className={`ai-book-button-inline ${selectedSlot?.messageIndex === idx && selectedSlot?.doctorId === doctor.doctor_id ? 'ai-book-selected-inline' : ''}`}
                                                                                >
                                                                                    <i className="bi bi-calendar-check book-icon"></i>
                                                                                    {selectedSlot?.messageIndex === idx && selectedSlot?.doctorId === doctor.doctor_id
                                                                                        ? `✓ Đặt lịch: ${selectedSlot.time} - ${new Date(selectedSlot.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}`
                                                                                        : 'Chọn giờ & Đặt lịch'
                                                                                    }
                                                                                </button>
                                                                            </div>
                                                                        );
                                                                    })}

                                                                    {/* Nút Xem thêm bác sĩ */}
                                                                    {msg.recommendedDoctors.length > 2 && (
                                                                        <button
                                                                            className="ai-show-more-doctors-button"
                                                                            onClick={() => {
                                                                                const doctorsExpandKey = `msg${idx}_doctors`;
                                                                                setExpandedSlots(prev => ({ ...prev, [doctorsExpandKey]: !prev[doctorsExpandKey] }));
                                                                            }}
                                                                        >
                                                                            {expandedSlots[`msg${idx}_doctors`]
                                                                                ? '▲ Thu gọn'
                                                                                : `▼ Xem thêm ${msg.recommendedDoctors.length - 2} bác sĩ`
                                                                            }
                                                                        </button>
                                                                    )}
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="ai-message">
                                    <div className="ai-avatar ai-avatar-bot">
                                        <i className="bi bi-robot avatar-icon"></i>
                                    </div>
                                    <div className="ai-message-content-wrapper">
                                        <div className="ai-message-bubble ai-bubble-assistant">
                                            <div className="ai-loading-dots">
                                                <div className="ai-dot"></div>
                                                <div className="ai-dot"></div>
                                                <div className="ai-dot"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="ai-input-container">
                        <div className="ai-input-wrapper">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Mô tả triệu chứng của bạn..."
                                className="ai-textarea"
                                rows="2"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || loading}
                                className="ai-send-button"
                            >
                                <i className="bi bi-send-fill send-icon"></i>
                                {loading && <span className="sending-text">Đang trả lời...</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && bookingData && (
                <div className="ai-booking-modal-overlay" onClick={() => setShowBookingModal(false)}>
                    <div className="ai-booking-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ai-booking-modal-header">
                            <h2 style={{ color: '#1e88e5', fontSize: '24px', fontWeight: '700', margin: 0 }}>
                                <i className="bi bi-calendar-check-fill"></i> ĐĂNG KÝ KHÁM BỆNH
                            </h2>
                            <button className="ai-modal-close" onClick={() => setShowBookingModal(false)}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="ai-booking-modal-body">
                            {/* Chọn bệnh nhân */}
                            <div className="form-section">
                                <div className="form-group">
                                    <label>
                                        Chọn bệnh nhân <span className="required">*</span>
                                        <span style={{ marginLeft: '10px', color: '#666', fontSize: '12px' }}>
                                            (Tổng: {patients?.length || 0} bệnh nhân)
                                        </span>
                                    </label>
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

                            {/* Thông tin bệnh nhân */}
                            {selectedPatient && (
                                <div className="form-section" style={{ marginTop: '15px' }}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Họ và tên</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={selectedPatient.fullName || ''}
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
                                                    value={selectedPatient.birth ? new Date(selectedPatient.birth).toLocaleDateString('vi-VN') : ''}
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
                                                    value={selectedPatient.gender === 'NAM' ? 'Nam' : selectedPatient.gender === 'NU' ? 'Nữ' : ''}
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
                                                    value={selectedPatient.email || ''}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Thông tin đặt lịch */}
                            <div className="form-section" style={{ marginTop: '15px' }}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label>Loại khám</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value="Khám chuyên khoa"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label>Bác sĩ</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={bookingData.doctor.doctor_name}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Chuyên khoa</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={bookingData.doctor.specialty}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Phí khám</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={`${bookingData.doctor.examination_fee?.toLocaleString('vi-VN')} VNĐ`}
                                                readOnly
                                                style={{ fontWeight: 'bold', color: '#1e88e5' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Ngày khám</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={new Date(bookingData.slot.date).toLocaleDateString('vi-VN')}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Ca khám</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={bookingData.slot.shift === 'SANG' ? 'Sáng' : bookingData.slot.shift === 'CHIEU' ? 'Chiều' : 'Tối'}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Giờ khám</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={bookingData.slot.time}
                                                readOnly
                                                style={{ fontWeight: 'bold', color: '#1e88e5' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label>Lý do khám</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                placeholder="Nhập triệu chứng hoặc lý do khám..."
                                                value={symptoms || bookingData.doctor.reason}
                                                onChange={(e) => setSymptoms(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ai-booking-modal-footer">
                            <button
                                className="ai-modal-btn ai-modal-btn-cancel"
                                onClick={() => {
                                    setShowBookingModal(false);
                                    setSelectedPatient(null);
                                    setSymptoms('');
                                }}
                                disabled={formLoading}
                            >
                                <i className="bi bi-x-circle"></i> Hủy
                            </button>
                            <button
                                className="ai-modal-btn ai-modal-btn-confirm"
                                onClick={handleConfirmBooking}
                                disabled={formLoading || !selectedPatient}
                            >
                                {formLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-circle-fill"></i> Xác nhận đặt lịch
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AIChatPage;
