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
      <header className="page-header">
        <h1>Assigned to Me</h1>
        <p>Concerns assigned to you</p>
      </header>
      <ConcernBoard
        concerns={assignedToMe}
        onAddConcern={addConcern}
        onUpdateConcern={updateConcern}
        onDeleteConcern={deleteConcern}
        onStatusChange={updateConcernStatus}
      />
    </div>
  );
}
