import { useAuth } from "../contexts/AuthContext";
import { useGroups } from "../hooks/useGroups";
import { GroupTable } from "../components/GroupTable";
import "./SettingsPage.css";

export function SettingsPage() {
  const { user } = useAuth();
  const { groups, loading, addGroup, updateGroup, deleteGroup } = useGroups();

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
        <h2>Groups</h2>
        <GroupTable
          groups={groups}
          loading={loading}
          onAdd={addGroup}
          onUpdate={updateGroup}
          onDelete={deleteGroup}
        />
      </section>
    </div>
  );
}
