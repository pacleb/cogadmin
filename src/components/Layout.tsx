import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import "./Layout.css";

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="layout">
      <Sidebar onCollapsedChange={setSidebarCollapsed} />
      <main
        className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <Outlet />
      </main>
    </div>
  );
}
