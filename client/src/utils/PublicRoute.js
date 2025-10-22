// utils/PublicRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PublicRoute({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // send cookies if using sessions
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(!!data.user); // true if user exists
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  // If already logged in, redirect to saved location or tasks
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/tasks";
    return <Navigate to={from} replace />;
  }

  // Otherwise, allow access to login/signup page
  return children;
}
