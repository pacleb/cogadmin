import { useState } from "react";
import type { Group } from "../types/Group";
import "./GroupTable.css";

interface GroupTableProps {
  groups: Group[];
  loading: boolean;
  onAdd: (group: { code: string; name: string }) => Promise<void>;
  onUpdate: (
    id: string,
    updates: { code?: string; name?: string },
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function GroupTable({
  groups,
  loading,
  onAdd,
  onUpdate,
  onDelete,
}: GroupTableProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ code: "", name: "" });
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!formData.code.trim() || !formData.name.trim()) return;

    try {
      setSaving(true);
      await onAdd({ code: formData.code.trim(), name: formData.name.trim() });
      setFormData({ code: "", name: "" });
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
      });
      setEditingId(null);
      setFormData({ code: "", name: "" });
    } catch {
      // Error handled in hook
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this group?")) return;

    try {
      await onDelete(id);
    } catch {
      // Error handled in hook
    }
  };

  const startEditing = (group: Group) => {
    setEditingId(group.id);
    setFormData({ code: group.code, name: group.name });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ code: "", name: "" });
  };

  if (loading) {
    return (
      <div className="group-table-loading">
        <div className="loading-spinner"></div>
        <span>Loading groups...</span>
      </div>
    );
  }

  return (
    <div className="group-table-container">
      <div className="group-table-header">
        <h3>Groups</h3>
        {!isAdding && !editingId && (
          <button
            className="btn-add-group"
            onClick={() => {
              setIsAdding(true);
              setFormData({ code: "", name: "" });
            }}
          >
            + Add Group
          </button>
        )}
      </div>

      <table className="group-table">
        <thead>
          <tr>
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
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="Code"
                  autoFocus
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
          {groups.length === 0 && !isAdding ? (
            <tr>
              <td colSpan={3} className="empty-message">
                No groups yet. Click "Add Group" to create one.
              </td>
            </tr>
          ) : (
            groups.map((group) => (
              <tr key={group.id}>
                {editingId === group.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({ ...formData, code: e.target.value })
                        }
                        autoFocus
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
                          onClick={() => handleUpdate(group.id)}
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
                    <td>{group.code}</td>
                    <td>{group.name}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => startEditing(group)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(group.id)}
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
