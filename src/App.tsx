import { useConcerns } from "./hooks/useConcerns";
import { ConcernBoard } from "./components/ConcernBoard";
import "./App.css";

function App() {
  const {
    concerns,
    addConcern,
    updateConcern,
    deleteConcern,
    updateConcernStatus,
  } = useConcerns();

  return (
    <div className="app">
      <ConcernBoard
        concerns={concerns}
        onAddConcern={addConcern}
        onUpdateConcern={updateConcern}
        onDeleteConcern={deleteConcern}
        onStatusChange={updateConcernStatus}
      />
    </div>
  );
}

export default App;
