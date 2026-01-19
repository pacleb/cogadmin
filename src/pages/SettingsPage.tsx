import { useAuth } from "../contexts/AuthContext";
import "./SettingsPage.css";

export function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </header>

      <section className="settings-section">
        <h2>Account</h2>
        <div className="settings-card">
          <div className="setting-item">
            <label>Email</label>
            <span className="setting-value">{user?.email}</span>
          </div>
          <div className="setting-item">
            <label>User ID</label>
            <span className="setting-value setting-id">{user?.id}</span>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2>Preferences</h2>
        <div className="coming-soon-small">
          <p>⚙️ More settings coming soon...</p>
        </div>
      </section>
    </div>
  );
}
