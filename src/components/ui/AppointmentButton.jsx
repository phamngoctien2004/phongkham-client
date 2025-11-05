import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AppointmentButton.css';

const AppointmentButton = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleClick = () => {
        if (isAuthenticated) {
            // Đã đăng nhập -> đi đến trang đặt lịch
            navigate('/dat-lich');
        } else {
            // Chưa đăng nhập -> đi đến trang login
            navigate('/login');
        }
    };

    return (
        <div className="appointment-button-wrapper">
            <button
                onClick={handleClick}
                className="appointment-button"
                aria-label="Đặt lịch khám"
            >
                <i className="bi bi-calendar-check"></i>
            </button>
        </div>
    );
};

export default AppointmentButton;
