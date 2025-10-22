import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./Navbar";
import AuthNavbar from "./AuthNavbar";
import Todo from "./Todo";
import Dashboard from "./components/Dashboard";
import FocusTimer from "./components/FocusTimer";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";

// ProtectedRoute ensures the user is logged in
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// PublicRoute blocks access to login/signup if already logged in
function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/tasks" replace />;
  }
  return children;
}

// Layout handles showing Navbar vs AuthNavbar
function Layout() {
  const location = useLocation();
  const authRoutes = ["/", "/login", "/signup"];
  const showAuthNavbar = authRoutes.includes(location.pathname);

  return (
    <>
      {showAuthNavbar ? <AuthNavbar /> : <Navbar />}
      <div className="container" style={{ padding: "20px", textAlign: "center" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* Protected Routes */}
          <Route path="/tasks" element={<ProtectedRoute><Todo /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/focus" element={<ProtectedRoute><FocusTimer /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/tasks" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
