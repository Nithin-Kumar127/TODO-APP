// client/src/Navbar.js
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userInitials, setUserInitials] = useState("U");
  const [userName, setUserName] = useState("User");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Load user initials and name safely
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.name) {
          setUserName(user.name);
          const initials = user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
          setUserInitials(initials);
        } else if (user.email) {
          setUserName(user.email);
          setUserInitials(user.email[0].toUpperCase());
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
        setUserInitials("U");
        setUserName("User");
      }
    }
  }, [location]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserInitials("U");
    setUserName("User");
    setDropdownOpen(false);
    navigate("/login", { replace: true });
  };

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

  return (
    <>
      <style>{`
        .navbar-custom { 
          background: white; 
          padding: 20px 40px; 
          box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
          border-bottom: 1px solid #e0e0e0; 
          width: 100%; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
        }
        .navbar-brand { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          text-decoration: none; 
          color: #2d3748; 
          font-weight: 700; 
          font-size: 1.5rem; 
        }
        .brand-icon { 
          width: 32px; 
          height: 32px; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          border-radius: 8px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: white; 
          font-size: 1.2rem; 
        }
        .nav-links { 
          display: flex; 
          gap: 30px; 
          align-items: center; 
          list-style: none; 
          margin: 0 auto; 
          padding: 0; 
          flex-grow: 1; 
          justify-content: center; 
        }
        .nav-item { 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          padding: 10px 20px; 
          border-radius: 10px; 
          text-decoration: none; 
          color: #718096; 
          font-weight: 500; 
          font-size: 1rem; 
          transition: all 0.3s ease; 
          cursor: pointer; 
          border: none; 
          background: transparent; 
        }
        .nav-item:hover { 
          color: #667eea; 
          background: #f7fafc; 
        }
        .nav-item.active { 
          background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); 
          color: #667eea; 
          font-weight: 600; 
        }
        .profile-container { 
          display: flex; 
          justify-content: flex-end; 
          flex: 0 0 auto; 
          position: relative; 
        }
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
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3); 
        }
        .profile-circle:hover { 
          opacity: 0.9; 
          transform: scale(1.05); 
        }
        .dropdown { 
          position: absolute; 
          top: 55px; 
          right: 0; 
          background: white; 
          border: 1px solid #e0e0e0; 
          border-radius: 10px; 
          box-shadow: 0 5px 15px rgba(0,0,0,0.15); 
          min-width: 180px; 
          z-index: 1000; 
          overflow: hidden; 
        }
        .dropdown-header { 
          padding: 12px 16px; 
          border-bottom: 1px solid #e0e0e0; 
          background: #f7fafc; 
        }
        .dropdown-username { 
          font-weight: 600; 
          color: #2d3748; 
          font-size: 0.95rem; 
          margin-bottom: 2px; 
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dropdown-label { 
          font-size: 0.75rem; 
          color: #718096; 
        }
        .dropdown button { 
          width: 100%; 
          padding: 12px 16px; 
          border: none; 
          background: transparent; 
          cursor: pointer; 
          text-align: left; 
          font-weight: 500; 
          color: #2d3748; 
          transition: all 0.2s; 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          font-size: 0.9rem; 
        }
        .dropdown button:hover { 
          background: #f7fafc; 
          color: #667eea; 
        }
        .dropdown-divider { 
          height: 1px; 
          background: #e0e0e0; 
          margin: 4px 0; 
        }
      `}</style>

      <nav className="navbar-custom">
        <Link to="/tasks" className="navbar-brand">
          <div className="brand-icon">✓</div>
          TaskFlow
        </Link>

        <ul className="nav-links">
          <li>
            <Link
              to="/tasks"
              className={`nav-item ${location.pathname === "/tasks" ? "active" : ""}`}
            >
              📝 Tasks
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}
            >
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/focus"
              className={`nav-item ${location.pathname === "/focus" ? "active" : ""}`}
            >
              ⏱️ Focus Timer
            </Link>
          </li>
        </ul>

        <div className="profile-container" ref={dropdownRef}>
          <div
            className="profile-circle"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title={userName}
          >
            {userInitials}
          </div>
          {dropdownOpen && (
            <div className="dropdown">
              <div className="dropdown-header">
                <div className="dropdown-username">{userName}</div>
                <div className="dropdown-label">Account</div>
              </div>
              <button onClick={() => {
                setDropdownOpen(false);
                navigate("/profile");
              }}>
                👤 Profile
              </button>
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout}>
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
