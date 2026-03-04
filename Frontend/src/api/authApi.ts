// ============================================
// PUBLIC AUTH API SERVICE
// ============================================
import axios from "axios";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../types/api.types";
import { getRoleFromToken, isTokenExpired, decodeToken } from "../utils/jwtUtils";

const authApi = {
  /**
   * POST /public/login
   * Đăng nhập
   * Backend returns plain text token, not JSON
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Use axios directly because backend returns text/plain, not JSON
    const response = await axios.post<string>("/api/public/login", data, {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: 'text',
      transformResponse: [(data) => data], // Don't parse as JSON
    });
    
    // Backend returns plain text token
    const token = response.data;
    
    console.log("📦 Raw token from backend:", token);
    console.log("📏 Token length:", token.length);
    
    // Decode token to get role
    const payload = decodeToken(token);
    
    // Create AuthResponse object from token
    return {
      token: token,
      role: payload?.role || 'READER',
      user: undefined
    };
  },

  /**
   * POST /public/register
   * Đăng ký tài khoản mới
   * Backend also returns plain text token
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axios.post<string>("/api/public/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: 'text',
      transformResponse: [(data) => data],
    });
    
    const token = response.data;
    const payload = decodeToken(token);
    
    return {
      token: token,
      role: payload?.role || 'READER',
      user: undefined
    };
  },

  /**
   * Logout - clear local session
   */
  logout: () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("userPhone");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const token = sessionStorage.getItem("token");
    if (!token) return false;
    
    // Check if token is expired
    return !isTokenExpired(token);
  },

  /**
   * Get current user role from token
   */
  getRole: (): string | null => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;
    
    // Get role from token (more secure than sessionStorage)
    return getRoleFromToken(token);
  },
};

export default authApi;
