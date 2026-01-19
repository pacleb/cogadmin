import { useConcerns } from "../hooks/useConcernsSupabase";
import { ConcernBoard } from "../components/ConcernBoard";
import "./ConcernsPage.css";

export function ConcernsAssignedToGroupPage() {
  const {
    concerns,
    loading,
    addConcern,
    updateConcern,
    deleteConcern,
    updateConcernStatus,
  } = useConcerns();

  // TODO: Filter concerns assigned to current user's group once assignment field is added
  const assignedToGroup = concerns;

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
        concerns={assignedToGroup}
        onAddConcern={addConcern}
        onUpdateConcern={updateConcern}
        onDeleteConcern={deleteConcern}
        onStatusChange={updateConcernStatus}
        title="Assigned to My Group"
        subtitle="Concerns assigned to your group"
      />
    </div>
  );
}
