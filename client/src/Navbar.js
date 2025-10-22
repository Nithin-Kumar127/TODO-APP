import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation(); // Get current path

  return (
    <>
      <style>{`
        .navbar-custom { background: white; padding: 20px 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-bottom: 1px solid #e0e0e0; width: 100%; }
        .navbar-container { display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 40px; }
        .navbar-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: #2d3748; font-weight: 700; font-size: 1.5rem; margin: 0; }
        .brand-icon { width: 32px; height: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; }
        .nav-links { display: flex; gap: 15px; align-items: center; list-style: none; margin: 0; padding: 0; }
        .nav-item { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px; text-decoration: none; color: #718096; font-weight: 500; font-size: 1rem; transition: all 0.3s ease; cursor: pointer; border: none; background: transparent; }
        .nav-item:hover { color: #667eea; background: #f7fafc; }
        .nav-item.active { background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); color: #667eea; font-weight: 600; }
        .nav-icon { font-size: 1.1rem; }
      `}</style>

      <nav className="navbar-custom">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <div className="brand-icon">✓</div>
            TaskFlow
          </Link>

          <ul className="nav-links">
            <li>
              <Link
                to="/"
                className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
              >
                <span className="nav-icon">📝</span>
                Tasks
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}
              >
                <span className="nav-icon">📊</span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/focus"
                className={`nav-item ${location.pathname === "/focus" ? "active" : ""}`}
              >
                <span className="nav-icon">⏱️</span>
                Focus Timer
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
