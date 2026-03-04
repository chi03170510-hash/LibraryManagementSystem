import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { decodeToken } from '../utils/jwtUtils';
import './AuthForm.css';

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await authApi.login({
        username: phone,
        password: password,
      });

      console.log("✅ Login response:", response);

      // Save token
      sessionStorage.setItem("token", response.token);
      
      // Decode token to get role and user info
      const tokenPayload = decodeToken(response.token);
      
      console.log("========================================");
      console.log("🔓 JWT TOKEN DECODED:");
      console.log("========================================");
      console.log("📋 Full Payload:", tokenPayload);
      if (tokenPayload) {
        console.log("📊 Extracted Info:");
        console.log("  - Role:", tokenPayload.role);
        console.log("  - Username:", tokenPayload.sub);
        console.log("  - Phone:", tokenPayload.phone || 'N/A');
        console.log("  - Status:", tokenPayload.status || 'N/A');
        if (tokenPayload.exp) {
          const expDate = new Date(tokenPayload.exp * 1000);
          console.log("  - Expiration:", expDate.toLocaleString('vi-VN'));
        }
      }
      console.log("========================================");
      
      if (tokenPayload) {
        // Save role from token (more secure)
        sessionStorage.setItem("role", tokenPayload.role);
        
        // Save username/phone from token
        if (tokenPayload.sub) {
          sessionStorage.setItem("userPhone", tokenPayload.sub);
        }
        
        // Save additional info if available
        if (tokenPayload.phone) {
          sessionStorage.setItem("phone", tokenPayload.phone);
        }
        if (tokenPayload.status) {
          sessionStorage.setItem("status", tokenPayload.status);
        }
        
        // Navigate based on role from token
        console.log(`🚀 Navigating to: ${tokenPayload.role === "STAFF" ? "/staff" : "/reader"}`);
        
        if (tokenPayload.role === "STAFF" || tokenPayload.role === "ADMIN") {
          navigate("/staff");
        } else if (tokenPayload.role === "READER") {
          navigate("/reader");
        } else {
          // Default fallback
          navigate("/");
        }
      } else {
        // Fallback: use response data if token decode fails
        console.warn("⚠️ Token decode failed, using response data");
        sessionStorage.setItem("role", response.role);
        
        if (response.user?.phone) {
          sessionStorage.setItem("userPhone", response.user.phone);
        } else {
          sessionStorage.setItem("userPhone", phone);
        }
        
        if (response.role === "STAFF" || response.role === "ADMIN") {
          navigate("/staff");
        } else if (response.role === "READER") {
          navigate("/reader");
        } else {
          navigate("/");
        }
      }
    } catch (err: any) {
      console.error("⚠️ Lỗi đăng nhập:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      
      // Handle specific error messages from backend
      if (err.response?.data === "Account is not active") {
        alert("Tài khoản của bạn đã bị khóa tạm thời!");
      } else if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else if (err.response?.status === 401) {
        alert("Sai số điện thoại hoặc mật khẩu");
      } else if (err.response?.status === 500) {
        alert("Lỗi máy chủ. Vui lòng thử lại sau");
      } else if (!err.response) {
        alert("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng");
      } else {
        alert("Đăng nhập thất bại. Vui lòng thử lại");
      }
    }
  };


  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập/ Số điện thoại</label>
            <input
              type="text"
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-btn">
            Đăng nhập
          </button>
        </form>
        <p className="switch-form">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="switch-btn">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
