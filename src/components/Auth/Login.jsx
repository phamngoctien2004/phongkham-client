import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [loginType, setLoginType] = useState('password'); // 'password' or 'otp'
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        otp: '',
    });
    const [step, setStep] = useState(1); // 1: nhập phone, 2: nhập OTP
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0); // Đếm ngược thời gian gửi lại OTP (giây)
    const countdownInterval = useRef(null);

    // Key cho localStorage (dùng phone number để tránh conflict)
    const getOTPTimerKey = (phone) => `otp_timer_login_${phone}`;

    // Khôi phục countdown từ localStorage khi component mount
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

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData.phone, formData.password, 'PASSWORD');
            toast.success('Đăng nhập thành công!');
            setTimeout(() => {
                navigate('/');
            }, 800);
        } catch (err) {
            toast.error(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();

        // Kiểm tra nếu đang trong thời gian chờ
        if (countdown > 0) {
            toast.warning(`Vui lòng đợi ${formatCountdown(countdown)} để gửi lại OTP`);
            return;
        }

        setLoading(true);

        try {
            await authService.sendLoginOTP(formData.phone);
            toast.success('Mã OTP đã được gửi đến số điện thoại của bạn');
            setStep(2);
            startCountdown(300); // 5 phút = 300 giây
        } catch (err) {
            toast.error(err.message || 'Gửi OTP thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Gọi API login với OTP - API sẽ tự xác thực OTP
            await login(formData.phone, formData.otp, 'OTP');
            toast.success('Đăng nhập thành công!');
            setTimeout(() => {
                navigate('/');
            }, 800);
        } catch (err) {
            toast.error(err.message || 'Mã OTP không chính xác. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const switchLoginType = () => {
        setLoginType(loginType === 'password' ? 'otp' : 'password');
        setFormData({ phone: '', password: '', otp: '' });
        setStep(1);
        // Reset countdown khi chuyển mode
        setCountdown(0);
        if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
        }
    };

    const handleResendOTP = async () => {
        // Kiểm tra nếu đang trong thời gian chờ
        if (countdown > 0) {
            toast.warning(`Vui lòng đợi ${formatCountdown(countdown)} để gửi lại OTP`);
            return;
        }

        setLoading(true);

        try {
            await authService.sendLoginOTP(formData.phone);
            toast.success('Mã OTP mới đã được gửi đến số điện thoại của bạn');
            startCountdown(300); // 5 phút = 300 giây
        } catch (err) {
            toast.error(err.message || 'Gửi lại OTP thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <h1>Phòng khám đa khoa Thái Hà</h1>
                    </Link>
                    <h2>Đăng nhập</h2>
                    <p>Chào mừng bạn đến với Phòng khám đa khoa Thái Hà</p>
                </div>

                {loginType === 'password' ? (
                    <form onSubmit={handlePasswordLogin} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="phone">Số điện thoại</label>
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

                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                placeholder="Nhập mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>

                        <div className="auth-switch-mode">
                            <button type="button" onClick={switchLoginType} disabled={loading}>
                                Đăng nhập bằng OTP
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        {step === 1 ? (
                            <form onSubmit={handleSendOTP} className="auth-form">
                                <div className="form-group">
                                    <label htmlFor="phone-otp">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        id="phone-otp"
                                        name="phone"
                                        className="form-control"
                                        placeholder="Nhập số điện thoại"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <button type="submit" className="btn-submit" disabled={loading || countdown > 0}>
                                    {loading ? 'Đang gửi...' : countdown > 0 ? `Đợi ${formatCountdown(countdown)}` : 'Gửi mã OTP'}
                                </button>

                                {countdown > 0 && (
                                    <div className="countdown-notice">
                                        <small>Bạn có thể gửi lại OTP sau {formatCountdown(countdown)}</small>
                                    </div>
                                )}

                                <div className="auth-switch-mode">
                                    <button type="button" onClick={switchLoginType} disabled={loading}>
                                        Đăng nhập bằng mật khẩu
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleOTPLogin} className="auth-form">
                                <div className="form-group">
                                    <label htmlFor="otp">Mã OTP</label>
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
                                        maxLength={6}
                                    />
                                    <small className="form-text pt-3">
                                        Mã OTP đã được gửi đến số điện thoại {formData.phone}
                                    </small>
                                </div>

                                <button type="submit" className="btn-submit" disabled={loading}>
                                    {loading ? 'Đang xác thực...' : 'Xác nhận'}
                                </button>

                                <div className="auth-actions">
                                    <button
                                        type="button"
                                        className="btn-link"
                                        onClick={handleResendOTP}
                                        disabled={loading || countdown > 0}
                                    >
                                        {countdown > 0 ? `Gửi lại sau ${formatCountdown(countdown)}` : 'Gửi lại mã OTP'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-link"
                                        onClick={switchLoginType}
                                        disabled={loading}
                                    >
                                        Đăng nhập bằng mật khẩu
                                    </button>
                                </div>

                                {countdown > 0 && (
                                    <div className="countdown-notice">
                                        <small>⏱️ Vui lòng đợi {formatCountdown(countdown)} để gửi lại OTP</small>
                                    </div>
                                )}
                            </form>
                        )}
                    </>
                )}

                <div className="auth-footer">
                    <p>
                        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
