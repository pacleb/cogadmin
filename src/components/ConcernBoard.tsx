import { useState } from "react";
import type { Concern, ConcernStatus } from "../types/Concern";
import { ConcernList } from "./ConcernList";
import { ConcernForm } from "./ConcernForm";
import { Icons } from "./Icons";
import "./ConcernBoard.css";

interface ConcernBoardProps {
  concerns: Concern[];
  onAddConcern: (
    concern: Omit<Concern, "id" | "createdAt" | "updatedAt">,
  ) => void;
  onUpdateConcern: (
    id: string,
    updates: Partial<Omit<Concern, "id" | "createdAt">>,
  ) => void;
  onDeleteConcern: (id: string) => void;
  onStatusChange: (id: string, status: ConcernStatus) => void;
}

type FilterStatus = ConcernStatus | "all";

export function ConcernBoard({
  concerns,
  onAddConcern,
  onUpdateConcern,
  onDeleteConcern,
  onStatusChange,
}: ConcernBoardProps) {
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const handleAddConcern = (
    concern: Omit<Concern, "id" | "createdAt" | "updatedAt">,
  ) => {
    onAddConcern(concern);
    setShowForm(false);
  };

  const filteredConcerns =
    filterStatus === "all"
      ? concerns
      : concerns.filter((concern) => concern.status === filterStatus);

  return (
    <div className="concern-board">
      <div className="board-header">
        <h1 className="board-title">
          <span className="board-icon">{Icons.concerns}</span>
          Admin Concerns
        </h1>
        <button
          className="btn btn-primary add-concern-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <>
              <span className="btn-icon">{Icons.close}</span>
              Cancel
            </>
          ) : (
            <>
              <span className="btn-icon">{Icons.plus}</span>
              Add Concern
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="add-concern-form-container">
          <ConcernForm
            onSubmit={handleAddConcern}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="filter-bar">
        <div className="filter-group">
          <label htmlFor="status-filter">Filter by status:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          >
            <option value="all">All Concerns</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <span className="concern-count-info">
          Showing {filteredConcerns.length} of {concerns.length} concerns
        </span>
      </div>

      <ConcernList
        concerns={filteredConcerns}
        onUpdate={onUpdateConcern}
        onDelete={onDeleteConcern}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}
