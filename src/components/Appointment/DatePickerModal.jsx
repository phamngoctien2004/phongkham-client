import './TimePickerModal.css';

const DatePickerModal = ({
    isOpen,
    onClose,
    onSelectDate,
    selectedDate,
    minDate,
    maxDate
}) => {
    if (!isOpen) return null;

    // Tạo danh sách các ngày từ minDate đến maxDate
    const generateDateOptions = () => {
        const dates = [];
        const start = new Date(minDate);
        const end = new Date(maxDate);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d));
        }

        return dates;
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDateDisplay = (date) => {
        const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        const dayOfWeek = days[date.getDay()];
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        // Kiểm tra nếu là hôm nay hoặc ngày mai
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);

        if (checkDate.getTime() === today.getTime()) {
            return `Hôm nay - ${day}/${month}/${year}`;
        } else if (checkDate.getTime() === tomorrow.getTime()) {
            return `Ngày mai - ${day}/${month}/${year}`;
        }

        return `${dayOfWeek}, ${day}/${month}/${year}`;
    };

    const handleDateSelect = (date) => {
        onSelectDate(formatDate(date));
        onClose();
    };

    const dateOptions = generateDateOptions();

    return (
        <div className="time-picker-overlay" onClick={onClose}>
            <div className="time-picker-modal date-picker-modal" onClick={(e) => e.stopPropagation()}>
                <div className="time-picker-header">
                    <h3>Chọn ngày khám</h3>
                    <button className="btn-close-modal" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="time-picker-body">
                    <div className="date-list">
                        {dateOptions.map((date) => {
                            const dateValue = formatDate(date);
                            const isSelected = selectedDate === dateValue;

                            return (
                                <button
                                    key={dateValue}
                                    type="button"
                                    className={`date-option-btn ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleDateSelect(date)}
                                >
                                    <i className="bi bi-calendar3"></i>
                                    <span>{formatDateDisplay(date)}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="time-picker-footer">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DatePickerModal;
