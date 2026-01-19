import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Sidebar.css";

export function Sidebar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">📋 Admin</h1>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Dashboard</span>
        </NavLink>
        <NavLink
          to="/concerns"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon">📝</span>
          <span className="nav-label">Concerns</span>
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Reports</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <span className="user-avatar">👤</span>
          <span className="user-email">{user?.email}</span>
        </div>
        <button className="sign-out-btn" onClick={signOut}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
