import { useRoles } from "../hooks/useRoles";
import { RoleTable } from "../components/RoleTable";
import "./SettingsPage.css";

export function RolesPage() {
  const { roles, loading, addRole, updateRole, deleteRole } = useRoles();

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1>Roles</h1>
        <p>Manage user roles</p>
      </header>

      <section className="settings-section">
        <RoleTable
          roles={roles}
          loading={loading}
          onAdd={addRole}
          onUpdate={updateRole}
          onDelete={deleteRole}
        />
      </section>
    </div>
  );
}
