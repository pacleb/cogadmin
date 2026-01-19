import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Sidebar.css";

// Minimal flat SVG icons
const Icons = {
  dashboard: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  concerns: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  reports: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  settings: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  user: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  ),
};

export function Sidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isSettingsActive = location.pathname.startsWith("/settings");

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">Admin</h1>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon">{Icons.dashboard}</span>
          <span className="nav-label">Dashboard</span>
        </NavLink>
        <NavLink
          to="/concerns"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon">{Icons.concerns}</span>
          <span className="nav-label">Concerns</span>
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon">{Icons.reports}</span>
          <span className="nav-label">Reports</span>
        </NavLink>

        <div className={`nav-group ${isSettingsActive ? "expanded" : ""}`}>
          <NavLink
            to="/settings/account"
            className={() =>
              `nav-item nav-parent ${isSettingsActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">{Icons.settings}</span>
            <span className="nav-label">Settings</span>
          </NavLink>

          {isSettingsActive && (
            <div className="nav-submenu">
              <NavLink
                to="/settings/account"
                className={({ isActive }) =>
                  `nav-item nav-sub ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-label">Account</span>
              </NavLink>
              <NavLink
                to="/settings/groups"
                className={({ isActive }) =>
                  `nav-item nav-sub ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-label">Groups</span>
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <span className="user-avatar">{Icons.user}</span>
          <span className="user-email">{user?.email}</span>
        </div>
        <button className="sign-out-btn" onClick={signOut}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
