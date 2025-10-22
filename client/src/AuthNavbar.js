import { Link,  useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function AuthNavbar() {
  
  const navigate = useNavigate();
  const [userInitials, setUserInitials] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load user initials safely from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const { name } = JSON.parse(storedUser);
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2); // limit to 2 letters
        setUserInitials(initials);
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      setUserInitials("");
    }
  }, []);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserInitials("");
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .navbar-custom { background: white; padding: 20px 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-bottom: 1px solid #e0e0e0; width: 100%; }
        .navbar-container { display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 40px; }
        .navbar-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: #2d3748; font-weight: 700; font-size: 1.5rem; margin: 0; }
        .brand-icon { width: 32px; height: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; }

        .nav-right { display: flex; align-items: center; gap: 12px; position: relative; }
        .auth-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          background: #667eea;
          color: white;
          cursor: pointer;
          font-weight: 500;
          transition: 0.3s;
        }
        .auth-btn:hover { background: #5a67d8; }

        .profile-circle {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: 0.3s;
        }
        .profile-circle:hover { opacity: 0.9; }

        .dropdown-menu {
          position: absolute;
          top: 50px;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 100;
        }
        .dropdown-menu button {
          padding: 10px 20px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          transition: 0.2s;
        }
        .dropdown-menu button:hover {
          background-color: #f7fafc;
        }
      `}</style>

      <nav className="navbar-custom">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <div className="brand-icon">✓</div>
            TaskFlow
          </Link>

          <div className="nav-right" ref={dropdownRef}>
            {userInitials ? (
              <>
                <div
                  className="profile-circle"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {userInitials}
                </div>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <button onClick={() => navigate("/profile")}>Profile</button>
                    <button onClick={handleLogout}>Sign Out</button>
                  </div>
                )}
              </>
            ) : (
              <>
                <button className="auth-btn" onClick={() => navigate("/login")}>
                  Login
                </button>
                <button className="auth-btn" onClick={() => navigate("/signup")}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
