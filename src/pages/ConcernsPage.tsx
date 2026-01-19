import { useConcerns } from "../hooks/useConcernsSupabase";
import { ConcernBoard } from "../components/ConcernBoard";
import "./ConcernsPage.css";

export function ConcernsPage() {
  const {
    concerns,
    loading,
    addConcern,
    updateConcern,
    deleteConcern,
    updateConcernStatus,
  } = useConcerns();

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
        concerns={concerns}
        onAddConcern={addConcern}
        onUpdateConcern={updateConcern}
        onDeleteConcern={deleteConcern}
      />
    </div>
  );
}
