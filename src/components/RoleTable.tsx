import { useState } from "react";
import type { Role } from "../types/Role";
import "./RoleTable.css";

interface RoleTableProps {
  roles: Role[];
  loading: boolean;
  onAdd: (role: {
    code: string;
    name: string;
    weight?: number;
  }) => Promise<void>;
  onUpdate: (
    id: string,
    updates: { code?: string; name?: string; weight?: number },
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function RoleTable({
  roles,
  loading,
  onAdd,
  onUpdate,
  onDelete,
}: RoleTableProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ code: "", name: "", weight: 0 });
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!formData.code.trim() || !formData.name.trim()) return;

    try {
      setSaving(true);
      await onAdd({
        code: formData.code.trim(),
        name: formData.name.trim(),
        weight: formData.weight,
      });
      setFormData({ code: "", name: "", weight: 0 });
      setIsAdding(false);
    } catch {
      // Error handled in hook
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.code.trim() || !formData.name.trim()) return;

    try {
      setSaving(true);
      await onUpdate(id, {
        code: formData.code.trim(),
        name: formData.name.trim(),
        weight: formData.weight,
      });
      setEditingId(null);
      setFormData({ code: "", name: "", weight: 0 });
    } catch {
      // Error handled in hook
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    try {
      await onDelete(id);
    } catch {
      // Error handled in hook
    }
  };

  const startEditing = (role: Role) => {
    setEditingId(role.id);
    setFormData({ code: role.code, name: role.name, weight: role.weight });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ code: "", name: "", weight: 0 });
  };

  if (loading) {
    return (
      <div className="role-table-loading">
        <div className="loading-spinner"></div>
        <span>Loading roles...</span>
      </div>
    );
  }

  return (
    <div className="role-table-container">
      <div className="role-table-header">
        <h3>Roles</h3>
        {!isAdding && !editingId && (
          <button
            className="btn-add-role"
            onClick={() => {
              setIsAdding(true);
              setFormData({ code: "", name: "", weight: 0 });
            }}
          >
            + Add Role
          </button>
        )}
      </div>

      <table className="role-table">
        <thead>
          <tr>
            <th className="weight-col">Weight</th>
            <th>Code</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isAdding && (
            <tr className="editing-row">
              <td>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weight: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  className="weight-input"
                  autoFocus
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="Code"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Name"
                />
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-save"
                    onClick={handleAdd}
                    disabled={
                      saving || !formData.code.trim() || !formData.name.trim()
                    }
                  >
                    {saving ? "..." : "Save"}
                  </button>
                  <button className="btn-cancel" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          )}
          {roles.length === 0 && !isAdding ? (
            <tr>
              <td colSpan={4} className="empty-message">
                No roles yet. Click "Add Role" to create one.
              </td>
            </tr>
          ) : (
            roles.map((role) => (
              <tr key={role.id}>
                {editingId === role.id ? (
                  <>
                    <td>
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            weight: parseInt(e.target.value) || 0,
                          })
                        }
                        className="weight-input"
                        autoFocus
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({ ...formData, code: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-save"
                          onClick={() => handleUpdate(role.id)}
                          disabled={
                            saving ||
                            !formData.code.trim() ||
                            !formData.name.trim()
                          }
                        >
                          {saving ? "..." : "Save"}
                        </button>
                        <button className="btn-cancel" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="weight-cell">{role.weight}</td>
                    <td>{role.code}</td>
                    <td>{role.name}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => startEditing(role)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(role.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
