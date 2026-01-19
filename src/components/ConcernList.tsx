import type { Concern, ConcernStatus } from "../types/Concern";
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

  // Sort by priority (high first) then by creation date (newest first)
  const sortedConcerns = [...concerns].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
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
