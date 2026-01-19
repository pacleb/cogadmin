import { useConcerns } from "../hooks/useConcernsSupabase";
import "./DashboardPage.css";

export function DashboardPage() {
  const { concerns, loading } = useConcerns();

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const todoCount = concerns.filter((c) => c.status === "todo").length;
  const inProgressCount = concerns.filter(
    (c) => c.status === "in-progress",
  ).length;
  const doneCount = concerns.filter((c) => c.status === "done").length;
  const highPriorityCount = concerns.filter(
    (c) => c.priority === "high" && c.status !== "done",
  ).length;

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your admin concerns</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <span className="stat-value">{concerns.length}</span>
            <span className="stat-label">Total Concerns</span>
          </div>
        </div>

        <div className="stat-card todo">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <span className="stat-value">{todoCount}</span>
            <span className="stat-label">To Do</span>
          </div>
        </div>

        <div className="stat-card in-progress">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <span className="stat-value">{inProgressCount}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>

        <div className="stat-card done">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-value">{doneCount}</span>
            <span className="stat-label">Done</span>
          </div>
        </div>

        <div className="stat-card high-priority">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <span className="stat-value">{highPriorityCount}</span>
            <span className="stat-label">High Priority</span>
          </div>
        </div>
      </div>

      <section className="recent-section">
        <h2>Recent Concerns</h2>
        {concerns.length === 0 ? (
          <p className="empty-message">
            No concerns yet. Create one from the Concerns page.
          </p>
        ) : (
          <ul className="recent-list">
            {concerns.slice(0, 5).map((concern) => (
              <li key={concern.id} className="recent-item">
                <span className={`priority-dot ${concern.priority}`}></span>
                <span className="recent-title">{concern.title}</span>
                <span className={`status-badge ${concern.status}`}>
                  {concern.status === "in-progress"
                    ? "In Progress"
                    : concern.status === "todo"
                      ? "To Do"
                      : "Done"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
