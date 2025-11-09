import { useState } from 'react';
import './Login.css';
import logo from '../../assets/logo.png';
import { authService } from '../../services/apiService';
import { ROUTES, STORAGE_KEYS } from '../../constants';

export default function Login() {
  const [email, setEmail] = useState('admin@medify.vn');
  const [password, setPassword] = useState('Admin@123');
  const [err, setErr] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
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
      // Redirect to home
      window.location.href = ROUTES.HOME;
    } catch (e: any) {
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

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo Section */}
        <div className="logo-section">
          <img src={logo} alt="Medify Logo" className="login-logo" />
        </div>
        
        <div className="welcome-section">
          <h2 className="welcome-text">Chào mừng trở lại</h2>
          <p className="welcome-description">
            Đăng nhập vào hệ thống quản lý Medify
          </p>
        </div>

        <form onSubmit={submit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Tài khoản
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@medify.vn"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="form-input"
              required
            />
          </div>

          <div className="form-footer">
            <a href="#" className="forgot-password">
              Quên mật khẩu?
            </a>
          </div>

          {err && <div className="error-message">{err}</div>}

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}

