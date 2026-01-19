import { Icons } from "../components/Icons";
import "./ReportsPage.css";

export function ReportsPage() {
  return (
    <div className="reports-page">
      <header className="page-header">
        <h1>Reports</h1>
        <p>Analytics and insights for your concerns</p>
      </header>

      <div className="coming-soon">
        <span className="coming-soon-icon">{Icons.chart}</span>
        <h2>Coming Soon</h2>
        <p>Reports and analytics features are under development.</p>
      </div>
    </div>
  );
}
