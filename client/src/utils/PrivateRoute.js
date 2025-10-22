// utils/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // send cookies if using sessions
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(!!data.user); // true if user exists
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  // If user is logged in, redirect to dashboard
  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

  // Otherwise, show the public page (login/signup)
  return children;
}
