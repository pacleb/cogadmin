import { useConcerns } from "../hooks/useConcernsSupabase";
import { Icons } from "../components/Icons";
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

  const newCount = concerns.filter((c) => c.status === "New").length;
  const ongoingCount = concerns.filter(
    (c) => c.status !== "New" && c.status !== "Accomplished",
  ).length;
  const accomplishedCount = concerns.filter(
    (c) => c.status === "Accomplished",
  ).length;
  const emergencyCount = concerns.filter(
    (c) => c.urgency === "EMERGENCY" && c.status !== "Accomplished",
  ).length;

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your admin concerns</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">{Icons.clipboard}</div>
          <div className="stat-content">
            <span className="stat-value">{concerns.length}</span>
            <span className="stat-label">Total Concerns</span>
          </div>
        </div>

        <div className="stat-card todo">
          <div className="stat-icon">{Icons.todo}</div>
          <div className="stat-content">
            <span className="stat-value">{newCount}</span>
            <span className="stat-label">New</span>
          </div>
        </div>

        <div className="stat-card in-progress">
          <div className="stat-icon">{Icons.inProgress}</div>
          <div className="stat-content">
            <span className="stat-value">{ongoingCount}</span>
            <span className="stat-label">Ongoing</span>
          </div>
        </div>

        <div className="stat-card done">
          <div className="stat-icon">{Icons.done}</div>
          <div className="stat-content">
            <span className="stat-value">{accomplishedCount}</span>
            <span className="stat-label">Accomplished</span>
          </div>
        </div>

        <div className="stat-card high-priority">
          <div className="stat-icon">{Icons.highPriority}</div>
          <div className="stat-content">
            <span className="stat-value">{emergencyCount}</span>
            <span className="stat-label">Emergency</span>
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
                <span
                  className={`urgency-dot ${concern.urgency.toLowerCase().replace(" ", "-")}`}
                ></span>
                <span className="recent-title">{concern.task}</span>
                <span className="recent-group">{concern.groupCode}</span>
                <span
                  className={`status-badge ${concern.status.toLowerCase().replace(" ", "-")}`}
                >
                  {concern.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
