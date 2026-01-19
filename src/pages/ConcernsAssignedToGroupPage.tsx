import { useConcerns } from "../hooks/useConcernsSupabase";
import { useProfile } from "../hooks/useProfile";
import { ConcernBoard } from "../components/ConcernBoard";
import "./ConcernsPage.css";

export function ConcernsAssignedToGroupPage() {
  const { concerns, loading, addConcern, updateConcern, deleteConcern } =
    useConcerns();
  const { profile } = useProfile();

  // Filter concerns where group matches the logged-in user's group
  const assignedToGroup = concerns.filter(
    (concern) => concern.groupCode === profile?.groupCode,
  );

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
        title={`Assigned to My Group (${assignedToGroup.length})`}
      />
    </div>
  );
}
