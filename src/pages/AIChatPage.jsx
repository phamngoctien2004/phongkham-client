import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import appointmentService from '../services/appointmentService';
import aiService from '../services/aiService';
import chatService from '../services/chatService';
import './AIChatPage.css';
import '../components/Appointment/Appointment.css'; // Import appointment styles
import 'bootstrap-icons/font/bootstrap-icons.css';

function AIChatPage() {
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading } = useAuth();

    // AI Conversation states
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [conversationsLoading, setConversationsLoading] = useState(false);

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
    const [selectedDoctorPerMessage, setSelectedDoctorPerMessage] = useState({}); // Track selected doctor for each message
    const [selectedDatePerMessage, setSelectedDatePerMessage] = useState({}); // Track selected date for each message
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState(null);

    // Form states
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [symptoms, setSymptoms] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Check authentication
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            // Không hiển thị toast, chỉ redirect
            navigate('/login');
        }
    }, [authLoading, isAuthenticated, navigate]);

    // Always scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load AI conversations on mount
    useEffect(() => {
        if (isAuthenticated) {
            loadAIConversations();
        }
    }, [isAuthenticated]);

    const loadAIConversations = async () => {
        try {
            console.log('[AI Chat] Starting to load conversations...');
            setConversationsLoading(true);

            // Try to load from API
            try {
                const data = await chatService.getAIConversations();
                console.log('[AI Chat] API response:', data);
                console.log('[AI Chat] Data type:', typeof data, 'Is Array:', Array.isArray(data));
                setConversations(data || []);
                console.log('[AI Chat] Conversations state updated');
            } catch (apiError) {
                console.warn('[AI Chat] API not available, using empty array:', apiError);
                // If API fails, just use empty array (no conversations yet)
                setConversations([]);
            }
        } catch (error) {
            console.error('[AI Chat] Failed to load conversations:', error);
            console.error('[AI Chat] Error details:', error.response || error.message);
            setConversations([]);
        } finally {
            setConversationsLoading(false);
            console.log('[AI Chat] Loading completed');
        }
    };

    const handleNewChat = () => {
        // Reset to new conversation
        setActiveConversation(null);
        setMessages([
            {
                role: 'assistant',
                content: 'Xin chào! Tôi là trợ lý AI y tế của phòng khám. Tôi có thể giúp bạn:\n- Tư vấn về triệu chứng bệnh\n- Cung cấp kiến thức y học\n- Đề xuất bác sĩ phù hợp\n\nBạn đang gặp vấn đề gì về sức khỏe?'
            }
        ]);
        setSelectedSlot(null);
    };

    const handleSelectConversation = async (conversation) => {
        try {
            setLoading(true);
            setActiveConversation(conversation);

            // Load messages from backend
            const data = await chatService.getAIMessages(conversation.id);
            console.log('[AI Chat] Loaded messages:', data);

            // Convert backend messages to component format
            const loadedMessages = (data.messages || []).map(msg => ({
                role: msg.senderId ? 'user' : 'assistant', // Adjust based on your backend structure
                content: msg.message,
                sources: msg.sources,
                needsAppointment: msg.needsAppointment,
                recommendedDoctors: msg.recommendedDoctors || []
            }));

            setMessages(loadedMessages.length > 0 ? loadedMessages : [
                {
                    role: 'assistant',
                    content: 'Xin chào! Tôi là trợ lý AI y tế của phòng khám. Tôi có thể giúp bạn:\n- Tư vấn về triệu chứng bệnh\n- Cung cấp kiến thức y học\n- Đề xuất bác sĩ phù hợp\n\nBạn đang gặp vấn đề gì về sức khỏe?'
                }
            ]);
        } catch (error) {
            console.error('Failed to load conversation messages:', error);
            // Không hiển thị toast khi load dữ liệu thất bại
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            // Log what we're sending to Python API
            console.log('=== SENDING TO PYTHON API ===');
            console.log('Message:', currentInput);
            console.log('Conversation History:', messages);
            console.log('Conversation ID:', activeConversation?.id || null);
            console.log('============================\n');

            // Send conversationId (null for new chat, or existing conversation id)
            const data = await aiService.sendChatMessage(
                currentInput,
                messages,
                activeConversation?.id || null
            );

            // Console log toàn bộ response từ AI
            console.log('=== AI RESPONSE ===');
            console.log('Full data:', data);
            console.log('Response text:', data.response);
            console.log('Conversation ID:', data.conversation_id);
            console.log('Conversation Name:', data.conversation_name);
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

            // Update or create conversation
            if (data.conversation_id && !activeConversation) {
                // New conversation created by backend
                const newConversation = {
                    id: data.conversation_id,
                    patientName: data.conversation_name || 'New Chat',
                    responder: 'AI'
                };
                setActiveConversation(newConversation);

                // Add to conversations list
                setConversations(prev => [newConversation, ...prev]);
            }

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
            // Không hiển thị toast khi load dữ liệu thất bại
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
                symptoms: symptoms || '',
                doctorId: bookingData.doctor.doctor_id,
                healthPlanId: null // Vì là khám chuyên khoa
            };

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

            // Clear cache lịch khám của bác sĩ trong AI chatbot
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

    // Show loading state while checking authentication
    if (authLoading) {
        return (
            <div className="ai-chat-page" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: '#f8f9fa'
            }}>
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p style={{ margin: 0, color: '#666' }}>Đang kiểm tra đăng nhập...</p>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated (will redirect)
    if (!isAuthenticated) {
        return null;
    }

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
                            <button className="new-chat-button" onClick={handleNewChat}>
                                <i className="bi bi-plus"></i> Cuộc trò chuyện mới
                            </button>

                            <div className="chat-history-list">
                                <h3 className="history-title">Lịch sử</h3>
                                {conversationsLoading ? (
                                    <div className="loading-conversations">
                                        <i className="bi bi-hourglass-split"></i>
                                        <p>Đang tải...</p>
                                    </div>
                                ) : conversations.length === 0 ? (
                                    <div className="no-conversations">
                                        <i className="bi bi-chat-dots"></i>
                                        <p>Chưa có lịch sử trò chuyện</p>
                                    </div>
                                ) : (
                                    conversations.map((conversation) => (
                                        <div
                                            key={conversation.id}
                                            className={`chat-history-item ${activeConversation?.id === conversation.id ? 'active' : ''}`}
                                            onClick={() => handleSelectConversation(conversation)}
                                        >
                                            <div className="chat-info">
                                                <p className="chat-title">{conversation.patientName || 'AI Chat'}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
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
                                <i className="bi bi-robot stethoscope-icon"></i>
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
                                                        Chọn Bác Sĩ
                                                    </h3>
                                                    <p className="ai-booking-date">Ngày khám: {
                                                        msg.recommendedDoctors[0]?.available_slots?.[0]?.date
                                                            ? new Date(msg.recommendedDoctors[0].available_slots[0].date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                                            : new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                                    }</p>

                                                    {/* Danh sách bác sĩ ngang */}
                                                    <div className="ai-doctors-horizontal-scroll">
                                                        {msg.recommendedDoctors.map((doctor, doctorIdx) => {
                                                            const messageKey = `msg${idx}`;
                                                            const isSelected = selectedDoctorPerMessage[messageKey] === doctorIdx ||
                                                                (selectedDoctorPerMessage[messageKey] === undefined && doctorIdx === 0);

                                                            return (
                                                                <div
                                                                    key={doctorIdx}
                                                                    className={`ai-doctor-card-horizontal ${isSelected ? 'selected' : ''}`}
                                                                    onClick={() => {
                                                                        setSelectedDoctorPerMessage(prev => ({
                                                                            ...prev,
                                                                            [messageKey]: doctorIdx
                                                                        }));
                                                                        // Reset selected slot when changing doctor
                                                                        setSelectedSlot(null);
                                                                    }}
                                                                >
                                                                    <div className="ai-doctor-avatar">
                                                                        {doctor.gender === 'FEMALE' ? '👩‍⚕️' : '👨‍⚕️'}
                                                                    </div>
                                                                    <div className="ai-doctor-details">
                                                                        <h4 className="ai-doctor-name-horizontal">
                                                                            {doctor.position || 'BS.'} {doctor.doctor_name}
                                                                        </h4>
                                                                        <p className="ai-doctor-specialty-horizontal">{doctor.specialty}</p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Chọn Giờ Khám - Only show for selected doctor */}
                                                    {(() => {
                                                        const messageKey = `msg${idx}`;
                                                        const selectedDoctorIdx = selectedDoctorPerMessage[messageKey] ?? 0; // Default to first doctor
                                                        const selectedDoctor = msg.recommendedDoctors[selectedDoctorIdx];

                                                        if (!selectedDoctor) return null;

                                                        return (
                                                            <div className="ai-time-selection-section">
                                                                <h3 className="ai-time-section-title">
                                                                    Chọn Giờ Khám - {selectedDoctor.position || 'BS.'} {selectedDoctor.doctor_name}
                                                                </h3>

                                                                {selectedDoctor.available_slots && selectedDoctor.available_slots.length > 0 && (() => {
                                                                    // Group slots by date
                                                                    const slotsByDate = {};
                                                                    selectedDoctor.available_slots.forEach(slot => {
                                                                        if (!slotsByDate[slot.date]) {
                                                                            slotsByDate[slot.date] = [];
                                                                        }
                                                                        slotsByDate[slot.date].push(slot);
                                                                    });

                                                                    const availableDates = Object.keys(slotsByDate);
                                                                    const selectedDateKey = `${messageKey}_date`;
                                                                    const currentSelectedDate = selectedDatePerMessage[selectedDateKey] || availableDates[0];
                                                                    const shiftsForDate = slotsByDate[currentSelectedDate] || [];

                                                                    return (
                                                                        <>
                                                                            {/* Date Selector */}
                                                                            <div className="ai-date-selector">
                                                                                {availableDates.map((date, dateIdx) => {
                                                                                    const dateObj = new Date(date);
                                                                                    const dayOfWeek = dateObj.toLocaleDateString('vi-VN', { weekday: 'short' });
                                                                                    const dayOfMonth = dateObj.getDate();
                                                                                    const month = dateObj.getMonth() + 1;
                                                                                    const isSelected = date === currentSelectedDate;

                                                                                    return (
                                                                                        <button
                                                                                            key={dateIdx}
                                                                                            onClick={() => {
                                                                                                setSelectedDatePerMessage(prev => ({
                                                                                                    ...prev,
                                                                                                    [selectedDateKey]: date
                                                                                                }));
                                                                                                // Reset selected slot when changing date
                                                                                                setSelectedSlot(null);
                                                                                            }}
                                                                                            className={`ai-date-button ${isSelected ? 'selected' : ''}`}
                                                                                        >
                                                                                            <div className="ai-date-month">{month}/{dayOfMonth}</div>
                                                                                            <div className="ai-date-day">{dayOfWeek}</div>
                                                                                        </button>
                                                                                    );
                                                                                })}
                                                                            </div>

                                                                            <div className="ai-shifts-container">
                                                                                {shiftsForDate.map((shift, shiftIdx) => {
                                                                                    const shiftIcon = shift.shift === 'SANG' ? '🌅' :
                                                                                        shift.shift === 'CHIEU' ? '☀️' : '🌙';
                                                                                    const shiftName = shift.shift === 'SANG' ? 'Ca Sáng' :
                                                                                        shift.shift === 'CHIEU' ? 'Ca Chiều' : 'Ca Tối';

                                                                                    return (
                                                                                        <div key={shiftIdx} className="ai-shift-section">
                                                                                            <div className="ai-shift-header">
                                                                                                <span className="ai-shift-icon">{shiftIcon}</span>
                                                                                                <span className="ai-shift-name">{shiftName}</span>
                                                                                            </div>

                                                                                            {shift.available_times && shift.available_times.length > 0 && (
                                                                                                <div className="ai-time-slots-grid">
                                                                                                    {shift.available_times
                                                                                                        .filter(time => {
                                                                                                            // Lọc bỏ các giờ trong invalidTimes
                                                                                                            if (shift.invalidTimes && Array.isArray(shift.invalidTimes) && shift.invalidTimes.length > 0) {
                                                                                                                return !shift.invalidTimes.includes(time);
                                                                                                            }
                                                                                                            return true;
                                                                                                        })
                                                                                                        .map((time, timeIdx) => {
                                                                                                            const slotKey = `${idx}_${selectedDoctor.doctor_id}_${currentSelectedDate}_${shift.shift}_${time}`;
                                                                                                            const isSelected = selectedSlot?.key === slotKey;

                                                                                                            return (
                                                                                                                <button
                                                                                                                    key={timeIdx}
                                                                                                                    onClick={() => handleSlotSelection(idx, selectedDoctor.doctor_id, currentSelectedDate, shift.shift, time, selectedDoctor.doctor_name)}
                                                                                                                    className={`ai-time-slot ${isSelected ? 'selected' : ''}`}
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
                                                                        </>
                                                                    );
                                                                })()}

                                                                {/* Book Appointment Button */}
                                                                <button
                                                                    onClick={() => handleBookAppointment(selectedDoctor, idx)}
                                                                    className={`ai-book-appointment-btn ${selectedSlot?.messageIndex === idx && selectedSlot?.doctorId === selectedDoctor.doctor_id ? 'has-selection' : ''}`}
                                                                >
                                                                    <i className="bi bi-calendar-check"></i>
                                                                    {selectedSlot?.messageIndex === idx && selectedSlot?.doctorId === selectedDoctor.doctor_id
                                                                        ? `Đặt lịch: ${selectedSlot.time} - ${new Date(selectedSlot.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}`
                                                                        : 'Chọn giờ để đặt lịch'
                                                                    }
                                                                </button>
                                                            </div>
                                                        );
                                                    })()}
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
                                                value={symptoms}
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
