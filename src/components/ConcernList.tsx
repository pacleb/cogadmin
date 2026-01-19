import { useState } from "react";
import type { Concern, ConcernStatus, ConcernUrgency } from "../types/Concern";
import { URGENCY_LABELS } from "../types/Concern";
import { ConcernForm } from "./ConcernForm";
import { formatDate } from "../lib/formatDate";
import "./ConcernList.css";

interface ConcernListProps {
  concerns: Concern[];
  onUpdate: (
    id: string,
    updates: Partial<Omit<Concern, "id" | "createdAt">>,
  ) => void;
}

export function ConcernList({ concerns, onUpdate }: ConcernListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (concerns.length === 0) {
    return (
      <div className="empty-list">
        <p>No concerns yet. Click "Add Concern" to create one!</p>
      </div>
    );
  }

  // Sort by status, urgency, group, detailed status, then start date
  const sortedConcerns = [...concerns].sort((a, b) => {
    const statusOrder: Record<ConcernStatus, number> = {
      New: 0,
      "For Delegating": 1,
      Preparing: 2,
      "For Update": 3,
      "For Report": 4,
      "For Approval": 5,
      "For Download": 6,
      Ongoing: 7,
      Accomplished: 8,
    };
    const urgencyOrder: Record<ConcernUrgency, number> = {
      EMERGENCY: 0,
      "Major Urgent": 1,
      Urgent: 2,
      Major: 3,
      Normal: 4,
    };
    const detailedStatusOrder: Record<string, number> = {
      // Preparing statuses
      Pending: 0,
      "For Starting": 1,
      "For Designing": 2,
      "For Canvassing": 3,
      "For Quotation": 4,
      "For Demo": 5,
      Delayed: 6,
      "For Presentation": 7,
      // Ongoing statuses
      "In Progress": 8,
      "For Problem Solving": 9,
      "For Finishing": 10,
    };

    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    }
    const groupCompare = a.groupCode.localeCompare(b.groupCode);
    if (groupCompare !== 0) {
      return groupCompare;
    }
    const aDetailedStatus = a.detailedStatus || "";
    const bDetailedStatus = b.detailedStatus || "";
    const aDetailedOrder = detailedStatusOrder[aDetailedStatus] ?? 999;
    const bDetailedOrder = detailedStatusOrder[bDetailedStatus] ?? 999;
    if (aDetailedOrder !== bDetailedOrder) {
      return aDetailedOrder - bDetailedOrder;
    }
    return a.startDate.getTime() - b.startDate.getTime();
  });

  const handleUpdate = (
    updates: Omit<Concern, "id" | "createdAt" | "updatedAt" | "endDate">,
  ) => {
    if (editingId) {
      onUpdate(editingId, updates);
      setEditingId(null);
    }
  };

  if (editingId) {
    const concern = concerns.find((c) => c.id === editingId);
    if (concern) {
      return (
        <div className="concern-edit-form">
          <ConcernForm
            initialValues={concern}
            onSubmit={handleUpdate}
            onCancel={() => setEditingId(null)}
            onDelete={onDelete}
          />
        </div>
      );
    }
  }

  return (
    <div className="concern-table-container">
      <table className="concern-table">
        <thead>
          <tr>
            <th>G</th>
            <th>Urgency</th>
            <th>Concern</th>
            <th>Remarks</th>
            <th>PIC</th>
            <th>Status</th>
            <th>Detailed Status</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {sortedConcerns.map((concern) => (
            <tr
              key={concern.id}
              className={`concern-row urgency-${concern.urgency.toLowerCase().replace(" ", "-")}`}
              onClick={() => setEditingId(concern.id)}
              style={{ cursor: "pointer" }}
            >
              <td className="group-cell">
                <span className="group-badge">{concern.groupCode}</span>
              </td>
              <td className="urgency-cell">
                <span
                  className={`urgency-badge urgency-badge-${concern.urgency.toLowerCase().replace(" ", "-")}`}
                >
                  {URGENCY_LABELS[concern.urgency]}
                </span>
              </td>
              <td className="task-cell">{concern.task}</td>
              <td className="remarks-cell">{concern.remarks || "-"}</td>
              <td className="pic-cell">{concern.pic || "-"}</td>
              <td className="status-cell">
                <span className="status-badge">{concern.status}</span>
              </td>
              <td className="detailed-status-cell">
                {concern.detailedStatus || "-"}
              </td>
              <td className="date-cell">{formatDate(concern.startDate)}</td>
              <td className="date-cell">{formatDate(concern.endDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
