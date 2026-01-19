import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ConcernsPage } from "./pages/ConcernsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { AccountPage } from "./pages/AccountPage";
import { GroupsPage } from "./pages/GroupsPage";
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
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/concerns" element={<ConcernsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route
          path="/settings"
          element={<Navigate to="/settings/account" replace />}
        />
        <Route path="/settings/account" element={<AccountPage />} />
        <Route path="/settings/groups" element={<GroupsPage />} />
      </Route>
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
