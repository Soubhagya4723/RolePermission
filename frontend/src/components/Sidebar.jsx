
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { hasPermission } from "../utils/hasPermission";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "sidebar-item active"
      : "sidebar-item";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* ===== BRAND ===== */}
      <div className="sidebar-brand">
        <span className="brand-icon">🔐</span>
        <span className="brand-text">MyApp</span>
      </div>

      {/* ===== MENU ===== */}
      <div className="sidebar-menu">
        {hasPermission("dashboard-view") && (
          <div
            className={isActive("/dashboard")}
            onClick={() => navigate("/dashboard")}
          >
            📊 Dashboard
          </div>
        )}

        {hasPermission("post-view") && (
          <div
            className={isActive("/posts")}
            onClick={() => navigate("/posts")}
          >
            📄 Posts
          </div>
        )}

        {hasPermission("marksheet-view") && (
          <div
            className={isActive("/marksheets")}
            onClick={() => navigate("/marksheets")}
          >
            🎓 Marksheets
          </div>
        )}

        {hasPermission("team-view") && (
          <div
            className={isActive("/teams")}
            onClick={() => navigate("/teams")}
          >
            👥 Teams
          </div>
        )}

        {/* ADMIN ONLY */}
        {role === "admin" && (
          <div
            className={isActive("/roles")}
            onClick={() => navigate("/roles")}
          >
            🛡️ Roles
          </div>
        )}
      </div>

      {/* ===== USER AREA ===== */}
      <div
        className="sidebar-user"
        onClick={() => setOpen(!open)}
      >
        <div className="user-avatar">
          {(user?.name || "A").charAt(0).toUpperCase()}
        </div>

        <div className="user-info">
          <div className="user-name">
            {user?.name || "Admin"}
          </div>
          <div className="user-role">
            {role}
          </div>
        </div>
      </div>

      {/* ===== LOGOUT ===== */}
      {open && (
        <div className="sidebar-dropdown">
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;


