import { useGroups } from "../hooks/useGroups";
import { GroupTable } from "../components/GroupTable";
import "./SettingsPage.css";

export function GroupsPage() {
  const { groups, loading, addGroup, updateGroup, deleteGroup } = useGroups();

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1>Groups</h1>
        <p>Manage department groups</p>
      </header>

      <section className="settings-section">
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
