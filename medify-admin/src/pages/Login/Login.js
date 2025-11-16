import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../assets/logo.png';
import { authService } from '../../services/apiService';
import { ROUTES, STORAGE_KEYS } from '../../constants';
export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('admin@medify.vn');
    const [password, setPassword] = useState('Admin@123');
    const [err, setErr] = useState();
    const [loading, setLoading] = useState(false);
    // Redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
            navigate(ROUTES.HOME, { replace: true });
        }
    }, [navigate]);
    const submit = async (e) => {
        e.preventDefault();
        setErr(undefined);
        setLoading(true);
        console.log('🔐 Bắt đầu đăng nhập...', { email });
        try {
            console.log('📡 Đang gọi API login...');
            const data = await authService.login(email, password);
            console.log('✅ Nhận được response:', data);
            if (!data || !data.access_token) {
                throw new Error('Không nhận được token từ server');
            }
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.access_token);
            console.log('💾 Đã lưu token');
            // Save user data if available
            if (data.user) {
                localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
                console.log('💾 Đã lưu user data');
            }
            console.log('🔄 Đang chuyển hướng...');
            // Redirect to home using React Router
            navigate(ROUTES.HOME, { replace: true });
        }
        catch (e) {
            console.error('❌ Login error:', e);
            console.error('Error details:', {
                message: e.message,
                name: e.name,
                stack: e.stack
            });
            // Show specific error message
            const errorMessage = e.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
            setErr(errorMessage);
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "login-container", children: _jsxs("div", { className: "login-card", children: [_jsx("div", { className: "logo-section", children: _jsx("img", { src: logo, alt: "Medify Logo", className: "login-logo", onError: (e) => {
                            // Fallback if logo fails to load
                            const target = e.target;
                            target.style.display = 'none';
                        } }) }), _jsxs("div", { className: "welcome-section", children: [_jsx("h2", { className: "welcome-text", children: "Ch\u00E0o m\u1EEBng tr\u1EDF l\u1EA1i" }), _jsx("p", { className: "welcome-description", children: "\u0110\u0103ng nh\u1EADp v\u00E0o h\u1EC7 th\u1ED1ng qu\u1EA3n l\u00FD Medify" })] }), _jsxs("form", { onSubmit: submit, className: "login-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", className: "form-label", children: "T\u00E0i kho\u1EA3n" }), _jsx("input", { id: "email", type: "text", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "example@medify.vn", className: "form-input", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", className: "form-label", children: "M\u1EADt kh\u1EA9u" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "form-input", required: true })] }), _jsx("div", { className: "form-footer", children: _jsx("a", { href: "#", className: "forgot-password", children: "Qu\u00EAn m\u1EADt kh\u1EA9u?" }) }), err && _jsx("div", { className: "error-message", children: err }), _jsx("button", { type: "submit", className: "submit-button", disabled: loading, children: loading ? 'Đang đăng nhập...' : 'Đăng nhập' })] })] }) }));
}
