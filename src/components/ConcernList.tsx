import type { Concern, ConcernStatus, ConcernUrgency } from "../types/Concern";
import { ConcernCard } from "./ConcernCard";
import "./ConcernList.css";

interface ConcernListProps {
  concerns: Concern[];
  onUpdate: (
    id: string,
    updates: Partial<Omit<Concern, "id" | "createdAt">>,
  ) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ConcernStatus) => void;
}

export function ConcernList({
  concerns,
  onUpdate,
  onDelete,
  onStatusChange,
}: ConcernListProps) {
  if (concerns.length === 0) {
    return (
      <div className="empty-list">
        <p>No concerns yet. Click "Add Concern" to create one!</p>
      </div>
    );
  }

  // Sort by urgency (EMERGENCY first) then by creation date (newest first)
  const sortedConcerns = [...concerns].sort((a, b) => {
    const urgencyOrder: Record<ConcernUrgency, number> = {
      EMERGENCY: 0,
      "Major Urgent": 1,
      Urgent: 2,
      Major: 3,
      Normal: 4,
    };
    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div className="concern-list">
      {sortedConcerns.map((concern) => (
        <ConcernCard
          key={concern.id}
          concern={concern}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
