import { useState } from "react";
import type { UserProfile } from "../hooks/useUsers";
import type { Role } from "../types/Role";
import type { Group } from "../types/Group";
import "./UserTable.css";

interface UserTableProps {
  users: UserProfile[];
  roles: Role[];
  groups: Group[];
  loading: boolean;
  onAdd: (userData: {
    email: string;
    password: string;
    name: string;
    nickname: string;
    mobile: string;
    role_id: string | null;
    group_code?: string | null;
  }) => Promise<unknown>;
  onUpdate: (
    id: string,
    updates: {
      name?: string;
      nickname?: string;
      mobile?: string;
      role_id?: string | null;
      group_code?: string | null;
    },
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function UserTable({
  users,
  roles,
  groups,
  loading,
  onAdd,
  onUpdate,
  onDelete,
}: UserTableProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    mobile: "",
    role_id: "" as string | null,
    group_code: "" as string | null,
  });
  const [addFormData, setAddFormData] = useState({
    email: "",
    password: "",
    name: "",
    nickname: "",
    mobile: "",
    role_id: "" as string | null,
    group_code: "" as string | null,
  });
  const [saving, setSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!addFormData.email.trim()) {
      setAddError("Email is required");
      return;
    }
    if (!addFormData.password.trim()) {
      setAddError("Password is required");
      return;
    }
    if (addFormData.password.length < 6) {
      setAddError("Password must be at least 6 characters");
      return;
    }
    if (!addFormData.name.trim()) {
      setAddError("Name is required");
      return;
    }
    if (!addFormData.nickname.trim()) {
      setAddError("Nickname is required");
      return;
    }
    if (!addFormData.group_code) {
      setAddError("Group is required");
      return;
    }
    if (!addFormData.role_id) {
      setAddError("Role is required");
      return;
    }

    try {
      setSaving(true);
      setAddError(null);
      await onAdd({
        email: addFormData.email.trim(),
        password: addFormData.password,
        name: addFormData.name.trim(),
        nickname: addFormData.nickname.trim(),
        mobile: addFormData.mobile.trim(),
        role_id: addFormData.role_id || null,
        group_code: addFormData.group_code || null,
      });
      setAddFormData({
        email: "",
        password: "",
        name: "",
        nickname: "",
        mobile: "",
        role_id: null,
        group_code: null,
      });
      setIsAdding(false);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim()) {
      return;
    }
    if (!formData.nickname.trim()) {
      return;
    }
    if (!formData.group_code) {
      return;
    }
    if (!formData.role_id) {
      return;
    }

    try {
      setSaving(true);
      await onUpdate(id, {
        name: formData.name.trim(),
        nickname: formData.nickname.trim(),
        mobile: formData.mobile.trim(),
        role_id: formData.role_id || null,
        group_code: formData.group_code || null,
      });
      setEditingId(null);
      setFormData({
        name: "",
        nickname: "",
        mobile: "",
        role_id: null,
        group_code: null,
      });
    } catch {
      // Error handled in hook
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await onDelete(id);
    } catch {
      // Error handled in hook
    }
  };

  const startEditing = (user: UserProfile) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      nickname: user.nickname,
      mobile: user.mobile,
      role_id: user.roleId,
      group_code: user.groupCode,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      name: "",
      nickname: "",
      mobile: "",
      role_id: null,
      group_code: null,
    });
    setAddFormData({
      email: "",
      password: "",
      name: "",
      nickname: "",
      mobile: "",
      role_id: null,
      group_code: null,
    });
    setAddError(null);
  };

  if (loading) {
    return (
      <div className="user-table-loading">
        <div className="loading-spinner"></div>
        <span>Loading users...</span>
      </div>
    );
  }

  return (
    <div className="user-table-container">
      <div className="user-table-header">
        <h3>Users</h3>
        <div className="user-table-header-right">
          <span className="user-count">{users.length} users</span>
          {!isAdding && !editingId && (
            <button
              className="btn-add-user"
              onClick={() => {
                setIsAdding(true);
                setAddFormData({
                  email: "",
                  password: "",
                  name: "",
                  nickname: "",
                  mobile: "",
                  role_id: null,
                  group_code: null,
                });
                setAddError(null);
              }}
            >
              + Add User
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="add-user-form">
          <h4>Add New User</h4>
          {addError && <div className="form-error">{addError}</div>}
          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={addFormData.email}
                onChange={(e) =>
                  setAddFormData({ ...addFormData, email: e.target.value })
                }
                placeholder="user@example.com"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                value={addFormData.password}
                onChange={(e) =>
                  setAddFormData({ ...addFormData, password: e.target.value })
                }
                placeholder="Min 6 characters"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={addFormData.name}
                onChange={(e) =>
                  setAddFormData({ ...addFormData, name: e.target.value })
                }
                placeholder="Full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Nickname *</label>
              <input
                type="text"
                value={addFormData.nickname}
                onChange={(e) =>
                  setAddFormData({ ...addFormData, nickname: e.target.value })
                }
                placeholder="Nickname"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Mobile</label>
              <input
                type="tel"
                value={addFormData.mobile}
                onChange={(e) =>
                  setAddFormData({ ...addFormData, mobile: e.target.value })
                }
                placeholder="Mobile number"
              />
            </div>
            <div className="form-group">
              <label>Role *</label>
              <select
                value={addFormData.role_id || ""}
                onChange={(e) =>
                  setAddFormData({
                    ...addFormData,
                    role_id: e.target.value || null,
                  })
                }
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Group *</label>
              <select
                value={addFormData.group_code || ""}
                onChange={(e) =>
                  setAddFormData({
                    ...addFormData,
                    group_code: e.target.value || null,
                  })
                }
                required
              >
                <option value="">Select Group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.code}>
                    {group.code} - {group.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group"></div>
          </div>
          <div className="form-actions">
            <button
              className="btn-save"
              onClick={handleAdd}
              disabled={
                saving ||
                !addFormData.email.trim() ||
                !addFormData.password.trim() ||
                !addFormData.name.trim() ||
                !addFormData.nickname.trim() ||
                !addFormData.group_code ||
                !addFormData.role_id
              }
            >
              {saving ? "Creating..." : "Create User"}
            </button>
            <button className="btn-cancel" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Nickname</th>
            <th>Mobile</th>
            <th>Group</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className="empty-message">
                No users found. Click "Add User" to create one.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                {editingId === user.id ? (
                  <>
                    <td>
                      <input
                        type="email"
                        value={user.email}
                        placeholder="Email"
                        disabled
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
                      <input
                        type="text"
                        value={formData.nickname}
                        onChange={(e) =>
                          setFormData({ ...formData, nickname: e.target.value })
                        }
                        placeholder="Nickname"
                      />
                    </td>
                    <td>
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) =>
                          setFormData({ ...formData, mobile: e.target.value })
                        }
                        placeholder="Mobile"
                      />
                    </td>
                    <td>
                      <select
                        value={formData.group_code || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            group_code: e.target.value || null,
                          })
                        }
                        required
                      >
                        <option value="">Select Group</option>
                        {groups.map((group) => (
                          <option key={group.id} value={group.code}>
                            {group.code}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={formData.role_id || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            role_id: e.target.value || null,
                          })
                        }
                        required
                      >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-save"
                          onClick={() => handleUpdate(user.id)}
                          disabled={
                            saving ||
                            !formData.name.trim() ||
                            !formData.nickname.trim() ||
                            !formData.group_code ||
                            !formData.role_id
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
                    <td className="email-cell">{user.email || "—"}</td>
                    <td>{user.name || "—"}</td>
                    <td>{user.nickname || "—"}</td>
                    <td>{user.mobile || "—"}</td>
                    <td>{user.groupCode || "—"}</td>
                    <td>
                      <span
                        className={`role-badge ${user.roleId ? "" : "no-role"}`}
                      >
                        {user.roleName || "No Role"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => startEditing(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(user.id)}
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
