import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../utils/jwtUtils";

/**
 * Component to redirect users to appropriate dashboard based on their role
 */
const RoleBasedRedirect = () => {
  const token = sessionStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  const role = getRoleFromToken(token);
  
  console.log("🔀 Role-based redirect: ", role);
  
  switch (role) {
    case "STAFF":
    case "ADMIN":
      return <Navigate to="/staff" replace />;
    case "READER":
      return <Navigate to="/reader" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RoleBasedRedirect;
