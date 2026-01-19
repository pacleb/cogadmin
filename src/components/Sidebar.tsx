import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Sidebar.css";

interface SidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

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
  system: (
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
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  menu: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  chevron: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
};

export function Sidebar({ onCollapsedChange }: SidebarProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Notify parent when collapsed state changes
  useEffect(() => {
    onCollapsedChange?.(sidebarCollapsed);
  }, [sidebarCollapsed, onCollapsedChange]);

  const isConcernsActive = location.pathname.startsWith("/concerns");
  const isSettingsActive = location.pathname.startsWith("/settings");
  const isSystemActive = location.pathname.startsWith("/system");

  // Auto-expand active menus
  useEffect(() => {
    const expanded: string[] = [];
    if (isConcernsActive) expanded.push("concerns");
    if (isSettingsActive) expanded.push("settings");
    if (isSystemActive) expanded.push("system");
    setExpandedMenus(expanded);
  }, [isConcernsActive, isSettingsActive, isSystemActive]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu],
    );
  };

  const isMenuExpanded = (menu: string) => expandedMenus.includes(menu);

  const renderNavContent = () => (
    <>
      <NavLink
        to="/"
        end
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      >
        <span className="nav-icon">{Icons.dashboard}</span>
        <span className="nav-label">Dashboard</span>
      </NavLink>

      <div
        className={`nav-group ${isMenuExpanded("concerns") ? "expanded" : ""}`}
      >
        <button
          type="button"
          className={`nav-item nav-parent ${isConcernsActive ? "active" : ""}`}
          onClick={() => toggleMenu("concerns")}
        >
          <span className="nav-icon">{Icons.concerns}</span>
          <span className="nav-label">Concerns</span>
          <span
            className={`nav-chevron ${isMenuExpanded("concerns") ? "rotated" : ""}`}
          >
            {Icons.chevron}
          </span>
        </button>

        {isMenuExpanded("concerns") && (
          <div className="nav-submenu">
            <NavLink
              to="/concerns/assigned-to-me"
              className={({ isActive }) =>
                `nav-item nav-sub ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-label">Assigned to Me</span>
            </NavLink>
            <NavLink
              to="/concerns/assigned-to-group"
              className={({ isActive }) =>
                `nav-item nav-sub ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-label">Assigned to My Group</span>
            </NavLink>
          </div>
        )}
      </div>

      <NavLink
        to="/reports"
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      >
        <span className="nav-icon">{Icons.reports}</span>
        <span className="nav-label">Reports</span>
      </NavLink>

      <div
        className={`nav-group ${isMenuExpanded("settings") ? "expanded" : ""}`}
      >
        <button
          type="button"
          className={`nav-item nav-parent ${isSettingsActive ? "active" : ""}`}
          onClick={() => toggleMenu("settings")}
        >
          <span className="nav-icon">{Icons.settings}</span>
          <span className="nav-label">Settings</span>
          <span
            className={`nav-chevron ${isMenuExpanded("settings") ? "rotated" : ""}`}
          >
            {Icons.chevron}
          </span>
        </button>

        {isMenuExpanded("settings") && (
          <div className="nav-submenu">
            <NavLink
              to="/settings/account"
              className={({ isActive }) =>
                `nav-item nav-sub ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-label">Account</span>
            </NavLink>
          </div>
        )}
      </div>

      <div
        className={`nav-group ${isMenuExpanded("system") ? "expanded" : ""}`}
      >
        <button
          type="button"
          className={`nav-item nav-parent ${isSystemActive ? "active" : ""}`}
          onClick={() => toggleMenu("system")}
        >
          <span className="nav-icon">{Icons.system}</span>
          <span className="nav-label">System</span>
          <span
            className={`nav-chevron ${isMenuExpanded("system") ? "rotated" : ""}`}
          >
            {Icons.chevron}
          </span>
        </button>

        {isMenuExpanded("system") && (
          <div className="nav-submenu">
            <NavLink
              to="/system/users"
              className={({ isActive }) =>
                `nav-item nav-sub ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-label">Users</span>
            </NavLink>
            <NavLink
              to="/system/groups"
              className={({ isActive }) =>
                `nav-item nav-sub ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-label">Groups</span>
            </NavLink>
            <NavLink
              to="/system/roles"
              className={({ isActive }) =>
                `nav-item nav-sub ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-label">Roles</span>
            </NavLink>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <header className="mobile-header">
        <h1 className="mobile-logo">Admin</h1>
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          {Icons.menu}
        </button>
      </header>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <h1 className="sidebar-logo">Admin</h1>
          <button
            className="mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            {Icons.close}
          </button>
        </div>
        <nav className="sidebar-nav">{renderNavContent()}</nav>
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

      {/* Desktop Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-logo">Admin</h1>
          <button
            className="sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
            title={sidebarCollapsed ? "Expand" : "Collapse"}
          >
            {sidebarCollapsed ? "›" : "‹"}
          </button>
        </div>

        <nav className="sidebar-nav">{renderNavContent()}</nav>

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
    </>
  );
}
