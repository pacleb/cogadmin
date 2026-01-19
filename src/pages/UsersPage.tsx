import { useUsers } from "../hooks/useUsers";
import { useRoles } from "../hooks/useRoles";
import { useGroups } from "../hooks/useGroups";
import { UserTable } from "../components/UserTable";
import "./SettingsPage.css";

export function UsersPage() {
  const { users, loading, createUser, updateUser, deleteUser } = useUsers();
  const { roles } = useRoles();
  const { groups } = useGroups();

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1>Users</h1>
        <p>Manage user accounts and roles</p>
      </header>

      <section className="settings-section">
        <UserTable
          users={users}
          roles={roles}
          groups={groups}
          loading={loading}
          onAdd={createUser}
          onUpdate={updateUser}
          onDelete={deleteUser}
        />
      </section>
    </div>
  );
}
