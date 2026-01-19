import { useState } from "react";
import type { Concern, ConcernStatus } from "../types/Concern";
import { STATUS_OPTIONS } from "../types/Concern";
import { ConcernForm } from "./ConcernForm";
import { Icons } from "./Icons";
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

const urgencyColors: Record<string, string> = {
  EMERGENCY: "#dc2626",
  "Major Urgent": "#ea580c",
  Urgent: "#f59e0b",
  Major: "#3b82f6",
  Normal: "#22c55e",
};

export function ConcernCard({
  concern,
  onUpdate,
  onDelete,
  onStatusChange,
}: ConcernCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (
    updates: Omit<Concern, "id" | "createdAt" | "updatedAt" | "endDate">,
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
    <div
      className={`concern-card urgency-${concern.urgency.toLowerCase().replace(" ", "-")}`}
    >
      <div className="concern-header">
        <div className="concern-group-badge">{concern.groupCode}</div>
        <span
          className="urgency-badge"
          style={{ backgroundColor: urgencyColors[concern.urgency] }}
        >
          {concern.urgency}
        </span>
      </div>

      <h3 className="concern-task">{concern.task}</h3>

      {concern.remarks && <p className="concern-remarks">{concern.remarks}</p>}

      <div className="concern-meta">
        <div className="meta-row">
          <span className="meta-label">Start:</span>
          <span className="meta-value">
            {concern.startDate.toLocaleDateString()}{" "}
            {concern.startDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        {concern.pic && (
          <div className="meta-row">
            <span className="meta-label">PIC:</span>
            <span className="meta-value">{concern.pic}</span>
          </div>
        )}
        {concern.detailedStatus && (
          <div className="meta-row">
            <span className="meta-label">Details:</span>
            <span className="meta-value">{concern.detailedStatus}</span>
          </div>
        )}
        {concern.endDate && (
          <div className="meta-row">
            <span className="meta-label">End:</span>
            <span className="meta-value">
              {concern.endDate.toLocaleDateString()}{" "}
              {concern.endDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>

      <div className="concern-actions">
        <select
          className="status-select"
          value={concern.status}
          onChange={(e) =>
            onStatusChange(concern.id, e.target.value as ConcernStatus)
          }
        >
          {STATUS_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <div className="action-buttons">
          <button
            className="btn-icon edit"
            onClick={() => setIsEditing(true)}
            aria-label="Edit concern"
          >
            {Icons.edit}
          </button>
          <button
            className="btn-icon delete"
            onClick={() => onDelete(concern.id)}
            aria-label="Delete concern"
          >
            {Icons.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
