import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ConcernsPage } from "./pages/ConcernsPage";
import { ConcernsAssignedToMePage } from "./pages/ConcernsAssignedToMePage";
import { ConcernsAssignedToGroupPage } from "./pages/ConcernsAssignedToGroupPage";
import { ReportsPage } from "./pages/ReportsPage";
import { AccountPage } from "./pages/AccountPage";
import { GroupsPage } from "./pages/GroupsPage";
import { RolesPage } from "./pages/RolesPage";
import { UsersPage } from "./pages/UsersPage";
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
        <Route
          path="/"
          element={<Navigate to="/concerns/assigned-to-me" replace />}
        />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/concerns"
          element={<Navigate to="/concerns/assigned-to-me" replace />}
        />
        <Route
          path="/concerns/assigned-to-me"
          element={<ConcernsAssignedToMePage />}
        />
        <Route
          path="/concerns/assigned-to-group"
          element={<ConcernsAssignedToGroupPage />}
        />
        <Route path="/reports" element={<ReportsPage />} />
        <Route
          path="/settings"
          element={<Navigate to="/settings/account" replace />}
        />
        <Route path="/settings/account" element={<AccountPage />} />
        <Route
          path="/system"
          element={<Navigate to="/system/users" replace />}
        />
        <Route path="/system/users" element={<UsersPage />} />
        <Route path="/system/groups" element={<GroupsPage />} />
        <Route path="/system/roles" element={<RolesPage />} />
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
