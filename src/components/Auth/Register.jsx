import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [step, setStep] = useState(1); // 1: nhập phone & gửi OTP, 2: xác thực OTP, 3: form đăng ký
    const [formData, setFormData] = useState({
        phone: '',
        otp: '',
        email: '',
        name: '',
        birth: '',
        gender: 'NAM',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0); // Đếm ngược thời gian gửi lại OTP (giây)
    const countdownInterval = useRef(null);

    // Key cho localStorage (dùng phone number để tránh conflict)
    const getOTPTimerKey = (phone) => `otp_timer_register_${phone}`;

    // Khôi phục countdown từ localStorage khi component mount hoặc phone thay đổi
    useEffect(() => {
        const checkStoredTimer = () => {
            const phone = formData.phone;
            if (!phone) return;

            const timerKey = getOTPTimerKey(phone);
            const storedTime = localStorage.getItem(timerKey);

            if (storedTime) {
                const expiryTime = parseInt(storedTime, 10);
                const now = Date.now();
                const remainingSeconds = Math.floor((expiryTime - now) / 1000);

                if (remainingSeconds > 0) {
                    startCountdown(remainingSeconds);
                } else {
                    // Hết hạn, xóa khỏi localStorage
                    localStorage.removeItem(timerKey);
                }
            }
        };

        checkStoredTimer();
    }, [formData.phone]);

    // Cleanup countdown interval khi component unmount
    useEffect(() => {
        return () => {
            if (countdownInterval.current) {
                clearInterval(countdownInterval.current);
            }
        };
    }, []);

    // Bắt đầu đếm ngược và lưu vào localStorage
    const startCountdown = (seconds) => {
        const phone = formData.phone;
        if (!phone) return;

        // Tính thời gian hết hạn (timestamp)
        const expiryTime = Date.now() + seconds * 1000;
        const timerKey = getOTPTimerKey(phone);

        // Lưu vào localStorage
        localStorage.setItem(timerKey, expiryTime.toString());

        setCountdown(seconds);

        if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
        }

        countdownInterval.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval.current);
                    // Xóa khỏi localStorage khi hết thời gian
                    localStorage.removeItem(timerKey);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Format thời gian countdown (mm:ss)
    const formatCountdown = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Bước 1: Gửi OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();

        // Kiểm tra nếu đang trong thời gian chờ
        if (countdown > 0) {
            toast.warning(`Vui lòng đợi ${formatCountdown(countdown)} để gửi lại OTP`);
            return;
        }

        setLoading(true);

        try {
            await authService.sendRegisterOTP(formData.phone);
            toast.success('Mã OTP đã được gửi đến số điện thoại của bạn');
            setStep(2);
            startCountdown(300); // 5 phút = 300 giây
        } catch (err) {
            toast.error(err.message || 'Gửi OTP thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Gửi lại OTP
    const handleResendOTP = async () => {
        // Kiểm tra nếu đang trong thời gian chờ
        if (countdown > 0) {
            toast.warning(`Vui lòng đợi ${formatCountdown(countdown)} để gửi lại OTP`);
            return;
        }

        setLoading(true);

        try {
            await authService.sendRegisterOTP(formData.phone);
            toast.success('Mã OTP mới đã được gửi đến số điện thoại của bạn');
            startCountdown(300); // 5 phút = 300 giây
        } catch (err) {
            toast.error(err.message || 'Gửi lại OTP thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Bước 2: Xác thực OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.verifyOTP(formData.phone, formData.otp);

            if (response.data) {
                toast.success('Xác thực OTP thành công! Vui lòng hoàn tất thông tin đăng ký');
                setStep(3);
            } else {
                toast.error('Mã OTP không chính xác');
            }
        } catch (err) {
            toast.error(err.message || 'Xác thực OTP thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Bước 3: Đăng ký tài khoản
    const handleRegister = async (e) => {
        e.preventDefault();

        // Validate
        if (formData.password !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);

        try {
            const userData = {
                phone: formData.phone,
                email: formData.email,
                name: formData.name,
                birth: formData.birth,
                gender: formData.gender,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            };

            await register(userData);
            toast.success('Đăng ký thành công! Đang chuyển hướng...');

            setTimeout(() => {
                navigate('/');
            }, 1200);
        } catch (err) {
            toast.error(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const goBackToStep1 = () => {
        setStep(1);
        setFormData({ ...formData, otp: '' });
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <h1>Phòng khám đa khoa Thái Hà</h1>
                    </Link>
                    <h2>Đăng ký tài khoản</h2>
                    <p>Tạo tài khoản mới tại Phòng khám đa khoa Thái Hà</p>
                </div>

                <div className="step-indicator">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Số điện thoại</span>
                    </div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Xác thực OTP</span>
                    </div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">Thông tin</span>
                    </div>
                </div>

                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="phone">Số điện thoại *</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className="form-control"
                                placeholder="Nhập số điện thoại"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading || countdown > 0}>
                            {loading ? 'Đang gửi...' : countdown > 0 ? `Đợi ${formatCountdown(countdown)}` : 'Gửi mã OTP'}
                        </button>

                        {countdown > 0 && (
                            <div className="countdown-notice">
                                <small>Bạn có thể gửi lại OTP sau {formatCountdown(countdown)}</small>
                            </div>
                        )}
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="otp">Mã OTP *</label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                className="form-control"
                                placeholder="Nhập mã OTP"
                                value={formData.otp}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                maxLength="6"
                            />
                            <small className="form-text text-muted">
                                Mã OTP đã được gửi đến số điện thoại {formData.phone}
                            </small>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Đang xác thực...' : 'Xác nhận OTP'}
                        </button>

                        <button
                            type="button"
                            className="btn btn-link btn-block"
                            onClick={handleResendOTP}
                            disabled={loading || countdown > 0}
                        >
                            {countdown > 0 ? `Gửi lại sau ${formatCountdown(countdown)}` : 'Gửi lại mã OTP'}
                        </button>

                        {countdown > 0 && (
                            <div className="countdown-notice">
                                <small>⏱️ Vui lòng đợi {formatCountdown(countdown)} để gửi lại OTP</small>
                            </div>
                        )}
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleRegister} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="name">Họ và tên *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                placeholder="Nhập họ và tên"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                placeholder="Nhập email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="birth">Ngày sinh *</label>
                            <input
                                type="date"
                                id="birth"
                                name="birth"
                                className="form-control"
                                value={formData.birth}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">Giới tính *</label>
                            <select
                                id="gender"
                                name="gender"
                                className="form-control"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            >
                                <option value="NAM">Nam</option>
                                <option value="NU">Nữ</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                minLength="6"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-control"
                                placeholder="Nhập lại mật khẩu"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Đang đăng ký...' : 'Hoàn tất đăng ký'}
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    <p>
                        Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
