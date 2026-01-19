import { useState } from "react";
import type { Concern, ConcernStatus } from "../types/Concern";
import { STATUS_OPTIONS } from "../types/Concern";
import { ConcernList } from "./ConcernList";
import { ConcernForm } from "./ConcernForm";
import { Icons } from "./Icons";
import "./ConcernBoard.css";

interface ConcernBoardProps {
  concerns: Concern[];
  onAddConcern: (
    concern: Omit<Concern, "id" | "createdAt" | "updatedAt" | "endDate">,
  ) => void;
  onUpdateConcern: (
    id: string,
    updates: Partial<Omit<Concern, "id" | "createdAt">>,
  ) => void;
  onDeleteConcern?: (id: string) => void;
  title?: string;
  subtitle?: string;
}

type FilterStatus = ConcernStatus | "all";

export function ConcernBoard({
  concerns,
  onAddConcern,
  onUpdateConcern,
  onDeleteConcern,
  title = "Admin Concerns",
  subtitle,
}: ConcernBoardProps) {
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const handleAddConcern = (
    concern: Omit<Concern, "id" | "createdAt" | "updatedAt" | "endDate">,
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
        <div className="board-title-section">
          <h1 className="board-title">
            <span className="board-icon">{Icons.concerns}</span>
            {title}
          </h1>
          {subtitle && <p className="board-subtitle">{subtitle}</p>}
        </div>
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
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
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
      />
    </div>
  );
}
