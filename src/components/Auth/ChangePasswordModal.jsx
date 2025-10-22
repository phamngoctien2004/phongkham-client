import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';
import Modal from '../ui/Modal';
import authService from '../../services/authService';
import './ChangePasswordModal.css';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const validateForm = () => {
        if (!formData.oldPassword) {
            toast.error('Vui lòng nhập mật khẩu hiện tại');
            return false;
        }

        if (!formData.newPassword) {
            toast.error('Vui lòng nhập mật khẩu mới');
            return false;
        }

        if (formData.newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
            return false;
        }

        if (!formData.confirmPassword) {
            toast.error('Vui lòng xác nhận mật khẩu mới');
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return false;
        }

        if (formData.oldPassword === formData.newPassword) {
            toast.error('Mật khẩu mới phải khác mật khẩu hiện tại');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Lấy userId từ localStorage
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                toast.error('Không tìm thấy thông tin người dùng');
                return;
            }

            const user = JSON.parse(userStr);
            const userId = user?.id;

            if (!userId) {
                toast.error('Không tìm thấy ID người dùng');
                return;
            }

            await authService.changePassword(
                userId,
                formData.oldPassword,
                formData.newPassword,
                formData.confirmPassword
            );

            toast.success('Đổi mật khẩu thành công');
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            onClose();
        } catch (error) {
            console.error('Change password error:', error);
            toast.error(error.message || 'Đổi mật khẩu thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setShowPassword({
                old: false,
                new: false,
                confirm: false,
            });
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Đổi mật khẩu" size="md">
            <form onSubmit={handleSubmit} className="change-password-form">
                <div className="form-group">
                    <label htmlFor="oldPassword">
                        Mật khẩu hiện tại <span className="required">*</span>
                    </label>
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword.old ? 'text' : 'password'}
                            id="oldPassword"
                            name="oldPassword"
                            className="form-control"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu hiện tại"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => togglePasswordVisibility('old')}
                            disabled={loading}
                        >
                            <i className={`bi bi-eye${showPassword.old ? '-slash' : ''}`}></i>
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="newPassword">
                        Mật khẩu mới <span className="required">*</span>
                    </label>
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword.new ? 'text' : 'password'}
                            id="newPassword"
                            name="newPassword"
                            className="form-control"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => togglePasswordVisibility('new')}
                            disabled={loading}
                        >
                            <i className={`bi bi-eye${showPassword.new ? '-slash' : ''}`}></i>
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">
                        Xác nhận mật khẩu mới <span className="required">*</span>
                    </label>
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword.confirm ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Nhập lại mật khẩu mới"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => togglePasswordVisibility('confirm')}
                            disabled={loading}
                        >
                            <i className={`bi bi-eye${showPassword.confirm ? '-slash' : ''}`}></i>
                        </button>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg me-2"></i>
                                Đổi mật khẩu
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

ChangePasswordModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ChangePasswordModal;
