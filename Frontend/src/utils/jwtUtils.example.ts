/**
 * ========================================
 * HƯỚNG DẪN SỬ DỤNG JWT UTILS
 * ========================================
 */

import { 
  decodeToken, 
  getRoleFromToken, 
  getUsernameFromToken,
  isTokenExpired,
  getTokenExpirationTime 
} from '../utils/jwtUtils';

// ========================================
// 1. Decode toàn bộ token
// ========================================
const token = sessionStorage.getItem("token");
if (token) {
  const payload = decodeToken(token);
  console.log("Token payload:", payload);
  /**
   * Output example:
   * {
   *   sub: "0987654321",
   *   role: "READER",
   *   iat: 1698765432,
   *   exp: 1698851832
   * }
   */
}

// ========================================
// 2. Lấy role từ token
// ========================================
if (token) {
  const role = getRoleFromToken(token);
  console.log("User role:", role); // "READER" | "STAFF" | "ADMIN"
  
  // Sử dụng role để điều hướng
  if (role === "STAFF") {
    // Navigate to staff dashboard
  } else if (role === "READER") {
    // Navigate to reader dashboard
  }
}

// ========================================
// 3. Lấy username/phone từ token
// ========================================
if (token) {
  const username = getUsernameFromToken(token);
  console.log("Username/Phone:", username);
}

// ========================================
// 4. Kiểm tra token hết hạn chưa
// ========================================
if (token) {
  const expired = isTokenExpired(token);
  if (expired) {
    console.log("Token đã hết hạn, cần đăng nhập lại");
    // Clear session and redirect to login
    sessionStorage.clear();
    window.location.href = "/login";
  } else {
    console.log("Token còn hợp lệ");
  }
}

// ========================================
// 5. Lấy thời gian hết hạn của token
// ========================================
if (token) {
  const expirationDate = getTokenExpirationTime(token);
  if (expirationDate) {
    console.log("Token sẽ hết hạn lúc:", expirationDate.toLocaleString());
    
    // Tính thời gian còn lại
    const timeLeft = expirationDate.getTime() - Date.now();
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    console.log(`Token còn ${hoursLeft} giờ nữa hết hạn`);
  }
}

// ========================================
// 6. Tích hợp vào component
// ========================================
/*
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeToken, isTokenExpired } from '../utils/jwtUtils';

function MyComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    
    if (!token || isTokenExpired(token)) {
      // Token không tồn tại hoặc đã hết hạn
      navigate('/login');
      return;
    }

    const payload = decodeToken(token);
    if (payload) {
      console.log("Current user role:", payload.role);
      console.log("Current user:", payload.sub);
    }
  }, [navigate]);

  return <div>Protected Component</div>;
}
*/

// ========================================
// 7. Tự động refresh token trước khi hết hạn
// ========================================
/*
import { useEffect } from 'react';
import { getTokenExpirationTime } from '../utils/jwtUtils';

function useTokenRefresh() {
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const expirationDate = getTokenExpirationTime(token);
    if (!expirationDate) return;

    // Refresh token 5 phút trước khi hết hạn
    const timeUntilRefresh = expirationDate.getTime() - Date.now() - (5 * 60 * 1000);

    if (timeUntilRefresh > 0) {
      const timeoutId = setTimeout(() => {
        // Call refresh token API here
        console.log("Time to refresh token!");
      }, timeUntilRefresh);

      return () => clearTimeout(timeoutId);
    }
  }, []);
}
*/

export {};
