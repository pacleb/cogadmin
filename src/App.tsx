import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useConcerns } from "./hooks/useConcernsSupabase";
import { ConcernBoard } from "./components/ConcernBoard";
import { AuthPage } from "./pages/AuthPage";
import "./App.css";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function Dashboard() {
  const { user, signOut } = useAuth();
  const {
    concerns,
    loading,
    addConcern,
    updateConcern,
    deleteConcern,
    updateConcernStatus,
  } = useConcerns();

  return (
    <div className="app">
      <header className="app-header">
        <span className="user-email">{user?.email}</span>
        <button className="btn btn-secondary sign-out-btn" onClick={signOut}>
          Sign Out
        </button>
      </header>
      {loading ? (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading concerns...</p>
        </div>
      ) : (
        <ConcernBoard
          concerns={concerns}
          onAddConcern={addConcern}
          onUpdateConcern={updateConcern}
          onDeleteConcern={deleteConcern}
          onStatusChange={updateConcernStatus}
        />
      )}
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <AuthPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
