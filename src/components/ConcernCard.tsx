import { useState } from "react";
import type { Concern, ConcernStatus } from "../types/Concern";
import { ConcernForm } from "./ConcernForm";
import "./ConcernCard.css";

interface ConcernCardProps {
  concern: Concern;
  onUpdate: (
    id: string,
    updates: Partial<Omit<Concern, "id" | "createdAt">>,
  ) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ConcernStatus) => void;
}

const priorityLabels = {
  low: "🟢 Low",
  medium: "🟡 Medium",
  high: "🔴 High",
};

const statusLabels: Record<ConcernStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

export function ConcernCard({
  concern,
  onUpdate,
  onDelete,
  onStatusChange,
}: ConcernCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (
    updates: Omit<Concern, "id" | "createdAt" | "updatedAt">,
  ) => {
    onUpdate(concern.id, updates);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="concern-card editing">
        <ConcernForm
          initialValues={concern}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className={`concern-card priority-${concern.priority}`}>
      <div className="concern-header">
        <h3 className="concern-title">{concern.title}</h3>
        <span className={`priority-badge ${concern.priority}`}>
          {priorityLabels[concern.priority]}
        </span>
      </div>

      {concern.description && (
        <p className="concern-description">{concern.description}</p>
      )}

      <div className="concern-meta">
        <span className="concern-date">
          Created: {concern.createdAt.toLocaleDateString()}
        </span>
      </div>

      <div className="concern-actions">
        <select
          className="status-select"
          value={concern.status}
          onChange={(e) =>
            onStatusChange(concern.id, e.target.value as ConcernStatus)
          }
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <div className="action-buttons">
          <button
            className="btn-icon edit"
            onClick={() => setIsEditing(true)}
            aria-label="Edit concern"
          >
            ✏️
          </button>
          <button
            className="btn-icon delete"
            onClick={() => onDelete(concern.id)}
            aria-label="Delete concern"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
