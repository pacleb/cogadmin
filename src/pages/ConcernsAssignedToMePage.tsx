import { useConcerns } from "../hooks/useConcernsSupabase";
import { useProfile } from "../hooks/useProfile";
import { ConcernBoard } from "../components/ConcernBoard";
import "./ConcernsPage.css";

export function ConcernsAssignedToMePage() {
  const { concerns, loading, addConcern, updateConcern, deleteConcern } =
    useConcerns();
  const { profile } = useProfile();

  // Filter concerns where PIC matches the logged-in user's nickname
  const assignedToMe = concerns.filter(
    (concern) => concern.pic === profile?.nickname,
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
        concerns={assignedToMe}
        onAddConcern={addConcern}
        onUpdateConcern={updateConcern}
        onDeleteConcern={deleteConcern}
        title="Assigned to Me"
      />
    </div>
  );
}
