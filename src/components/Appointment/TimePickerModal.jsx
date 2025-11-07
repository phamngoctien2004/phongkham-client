import { useState } from 'react';
import './TimePickerModal.css';

const TimePickerModal = ({
    isOpen,
    onClose,
    onSelectTime,
    morningSlots,
    afternoonSlots,
    eveningSlots,
    isTimeSlotAvailable,
    selectedTime
}) => {
    const [activeShift, setActiveShift] = useState('morning');

    if (!isOpen) return null;

    const handleTimeSelect = (timeValue) => {
        onSelectTime(timeValue);
        onClose();
    };

    const renderTimeSlots = (slots, shift) => {
        return slots
            .filter((slot) => {
                // Chỉ hiển thị các slot khả dụng, ẩn hoàn toàn các slot không hợp lệ
                const isAvailable = isTimeSlotAvailable(slot.value, shift);
                return isAvailable;
            })
            .map((slot) => {
                const isSelected = selectedTime === slot.value;

                return (
                    <button
                        key={slot.value}
                        type="button"
                        className={`time-slot-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleTimeSelect(slot.value)}
                    >
                        {slot.label}
                    </button>
                );
            });
    };

    return (
        <div className="time-picker-overlay" onClick={onClose}>
            <div className="time-picker-modal" onClick={(e) => e.stopPropagation()}>
                <div className="time-picker-header">
                    <h3>Chọn giờ khám</h3>
                    <button className="btn-close-modal" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="time-picker-body">
                    {/* Shift Selector */}
                    <div className="shift-tabs">
                        <button
                            type="button"
                            className={`shift-tab ${activeShift === 'morning' ? 'active' : ''}`}
                            onClick={() => setActiveShift('morning')}
                        >
                            <i className="bi bi-sunrise"></i>
                            <span>Buổi sáng</span>
                            <small>7:00 - 12:00</small>
                        </button>
                        <button
                            type="button"
                            className={`shift-tab ${activeShift === 'afternoon' ? 'active' : ''}`}
                            onClick={() => setActiveShift('afternoon')}
                        >
                            <i className="bi bi-sun"></i>
                            <span>Buổi chiều</span>
                            <small>13:00 - 17:00</small>
                        </button>
                        <button
                            type="button"
                            className={`shift-tab ${activeShift === 'evening' ? 'active' : ''}`}
                            onClick={() => setActiveShift('evening')}
                        >
                            <i className="bi bi-moon-stars"></i>
                            <span>Buổi tối</span>
                            <small>17:00 - 23:00</small>
                        </button>
                    </div>

                    {/* Time Slots */}
                    <div className="time-slots-container">
                        {activeShift === 'morning' && (
                            <div className="time-slots-grid">
                                {renderTimeSlots(morningSlots, 'SANG')}
                            </div>
                        )}
                        {activeShift === 'afternoon' && (
                            <div className="time-slots-grid">
                                {renderTimeSlots(afternoonSlots, 'CHIEU')}
                            </div>
                        )}
                        {activeShift === 'evening' && (
                            <div className="time-slots-grid">
                                {renderTimeSlots(eveningSlots, 'TOI')}
                            </div>
                        )}
                    </div>
                </div>

                <div className="time-picker-footer">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimePickerModal;
