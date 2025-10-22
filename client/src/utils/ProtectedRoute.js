// client/src/utils/ProtectedRoute.js
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // Check if user is authenticated
  const isAuthenticated = !!(token && user);

  if (!isAuthenticated) {
    // Redirect to login while saving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Validate token format (basic check)
  try {
    if (token && token.length < 10) {
      console.warn("Token seems invalid");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Token validation error:", error);
    return <Navigate to="/login" replace />;
  }

  return children;
}