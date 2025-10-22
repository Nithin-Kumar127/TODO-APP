import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error parsing user:", err);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  if (!user) {
    return (
      <div className="loading">
        <div className="loader"></div>
        <p>Loading your profile...</p>
        <style>{`
          .loading {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(120deg, #141e30, #243b55);
            color: #fff;
          }
          .loader {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
          }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const initials =
    user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ||
    user.email?.[0].toUpperCase() ||
    "U";

  return (
    <div className="profile-page">
      <header className="profile-hero">
        <div className="avatar-container">
          <div className="avatar-glow"></div>
          <div className="avatar">{initials}</div>
        </div>
        <div className="profile-info">
          <h1>{user.name || "User"}</h1>
          <p>{user.email}</p>
        </div>
      </header>

      <main className="profile-main">
        <section className="profile-section fadein">
          <h2>📋 Account Details</h2>
          <div className="details-grid">
            <div>
              <label>User ID</label>
              <span>{user._id || "N/A"}</span>
            </div>
            <div>
              <label>Joined</label>
              <span>{new Date(user.createdAt || Date.now()).toDateString()}</span>
            </div>
            <div>
              <label>Last Login</label>
              <span>{new Date(user.lastLogin || Date.now()).toLocaleString()}</span>
            </div>
            </div>
     </section>

        <section className="profile-section fadein delay-1">
          <h2>⚙️ Actions</h2>
          <div className="actions">
            <button className="btn secondary" onClick={() => navigate("/tasks")}>View Tasks</button>
            <button className="btn danger" onClick={handleLogout}>Logout</button>
          </div>
        </section>
      </main>

      <style>{`
        .profile-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: #f1f5f9;
          font-family: 'Inter', sans-serif;
        }
        .profile-hero {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 80px 20px;
          background: radial-gradient(circle at top, #6366f1, #3730a3);
          position: relative;
        }
        .avatar-container { position: relative; }
        .avatar {
          width: 120px;
          height: 120px;
          background: rgba(255,255,255,0.15);
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 700;
          backdrop-filter: blur(8px);
          color: #fff;
          z-index: 2;
        }
        .avatar-glow {
          position: absolute;
          top: 0; left: 0;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.3), transparent);
          animation: pulse 2.5s infinite alternate;
          z-index: 1;
        }
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.5; }
          100% { transform: scale(1.2); opacity: 1; }
        }
        .profile-info { margin-top: 25px; text-align: center; }
        .profile-info h1 { font-size: 2rem; margin: 5px 0; }
        .profile-info p { opacity: 0.85; }
        .profile-main { padding: 50px 10%; }
        .profile-section { margin-bottom: 60px; background: rgba(255,255,255,0.05); padding: 30px; border-radius: 16px; box-shadow: 0 2px 20px rgba(0,0,0,0.15); backdrop-filter: blur(10px); transition: transform 0.3s ease; }
        .profile-section:hover { transform: translateY(-3px); }
        .profile-section h2 { color: #a5b4fc; margin-bottom: 20px; font-size: 1.4rem; }
        .details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .details-grid label { display: block; font-weight: 600; color: #cbd5e1; margin-bottom: 5px; }
        .actions { display: flex; flex-wrap: wrap; gap: 15px; }
        .btn { padding: 12px 20px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .btn.secondary { background: rgba(255,255,255,0.15); color: white; }
        .btn.secondary:hover { background: rgba(255,255,255,0.25); }
        .btn.danger { background: #ef4444; color: white; }
        .btn.danger:hover { background: #dc2626; }
        .fadein { opacity: 0; transform: translateY(20px); animation: fadein 0.8s forwards; }
        .fadein.delay-1 { animation-delay: 0.2s; }
        @keyframes fadein { to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) { .profile-main { padding: 30px 5%; } }
      `}</style>
    </div>
  );
}
