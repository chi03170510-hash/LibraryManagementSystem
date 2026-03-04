import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { isTokenExpired } from "../utils/jwtUtils";

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const token = sessionStorage.getItem("token");
  
  // Check if token exists and is not expired
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    // Clear session and redirect to login
    sessionStorage.clear();
    console.warn("⚠️ Token expired, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default PrivateRoute;
