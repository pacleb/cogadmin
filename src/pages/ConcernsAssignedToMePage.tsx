import { useConcerns } from "../hooks/useConcernsSupabase";
import { ConcernBoard } from "../components/ConcernBoard";
import "./ConcernsPage.css";

export function ConcernsAssignedToMePage() {
  const {
    concerns,
    loading,
    addConcern,
    updateConcern,
    deleteConcern,
    updateConcernStatus,
  } = useConcerns();

  // TODO: Filter concerns assigned to current user once assignment field is added
  const assignedToMe = concerns;

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Loading concerns...</p>
      </div>
    );
  }

  return (
    <div className="concerns-page">
      <ConcernBoard
        concerns={assignedToMe}
        onAddConcern={addConcern}
        onUpdateConcern={updateConcern}
        onDeleteConcern={deleteConcern}
        onStatusChange={updateConcernStatus}
        title="Assigned to Me"
      />
    </div>
  );
}
