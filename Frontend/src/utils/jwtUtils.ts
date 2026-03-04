import { jwtDecode } from 'jwt-decode';

/**
 * Interface for JWT payload structure from backend
 */
export interface JWTPayload {
  sub: string; // username
  role: 'READER' | 'STAFF' | 'ADMIN';
  username: string; // username (duplicate of sub)
  phone: string; // user's phone number
  status: 'ACTIVE' | 'LOCKED'; // account status
  iat?: number; // issued at
  exp?: number; // expiration time
  [key: string]: any; // additional claims
}

/**
 * Decode JWT token and extract payload
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Get role from JWT token
 */
export const getRoleFromToken = (token: string): string | null => {
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

/**
 * Get username/phone from JWT token
 */
export const getUsernameFromToken = (token: string): string | null => {
  const decoded = decodeToken(token);
  return decoded?.sub || null;
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Get token expiration time
 */
export const getTokenExpirationTime = (token: string): Date | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  
  return new Date(decoded.exp * 1000);
};
