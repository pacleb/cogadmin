import { useAuth } from "../contexts/AuthContext";
import "./SettingsPage.css";

export function AccountPage() {
  const { user } = useAuth();

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1>Account</h1>
        <p>Manage your account information</p>
      </header>

      <section className="settings-section">
        <h2>Profile</h2>
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
    </div>
  );
}
