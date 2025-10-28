import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import appointmentService from '../../services/appointmentService';
import './ProfileModals.css';

const EditProfileModal = ({ isOpen, onClose, profile, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        phone: '',
        email: '',
        fullName: '',
        address: '',
        cccd: '',
        birth: '',
        gender: '',
        bloodType: '',
        weight: '',
        height: '',
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                id: profile.id || '',
                phone: profile.phone || '',
                email: profile.email || '',
                fullName: profile.fullName || '',
                address: profile.address || '',
                cccd: profile.cccd || '',
                birth: profile.birth ? profile.birth.split('T')[0] : '',
                gender: profile.gender || '',
                bloodType: profile.bloodType || '',
                weight: profile.weight || '',
                height: profile.height || '',
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            // Prepare data - keep phone as string, convert weight/height to numbers
            const updateData = {
                ...formData,
                phone: formData.phone || null,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                height: formData.height ? parseFloat(formData.height) : null,
            };

            await appointmentService.updatePatient(updateData);
            toast.success('Cập nhật thông tin thành công!');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.message || 'Cập nhật thông tin thất bại');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Cập nhật thông tin cá nhân</h3>
                    <button className="btn-close" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Họ và tên <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Số điện thoại</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>CMND/CCCD</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="cccd"
                                        value={formData.cccd}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Ngày sinh <span className="required">*</span></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="birth"
                                        value={formData.birth}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Giới tính <span className="required">*</span></label>
                                    <select
                                        className="form-control"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-- Chọn giới tính --</option>
                                        <option value="NAM">Nam</option>
                                        <option value="NU">Nữ</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Nhóm máu</label>
                                    <select
                                        className="form-control"
                                        name="bloodType"
                                        value={formData.bloodType}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Chọn nhóm máu --</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="AB">AB</option>
                                        <option value="O">O</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Cân nặng (kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="form-control"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Chiều cao (cm)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="form-control"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="col-md-12">
                                <div className="form-group">
                                    <label>Địa chỉ</label>
                                    <textarea
                                        className="form-control"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="3"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;

