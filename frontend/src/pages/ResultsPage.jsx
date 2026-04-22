import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { Trophy, BarChart3, Users, AlertTriangle, RefreshCw } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const chartColors = [
  "#6366f1", "#06d6a0", "#f59e0b", "#f43f5e", "#22d3ee",
  "#a855f7", "#14b8a6", "#ec4899", "#84cc16", "#f97316",
];

const ResultsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/results");
      setData(res.data);
    } catch (err) {
      // Results might not be accessible without admin auth — show a generic state
      setError("Results are not available yet. Please check back after the election admin publishes results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const barData = data
    ? {
        labels: data.candidates.map((c) => c.name),
        datasets: [
          {
            label: "Votes",
            data: data.candidates.map((c) => c.votes),
            backgroundColor: chartColors.slice(0, data.candidates.length),
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { labels: { color: "#94a3b8", font: { family: "Inter", size: 12 } } },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f1f5f9",
        bodyColor: "#94a3b8",
        borderColor: "#334155",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: { ticks: { color: "#64748b" }, grid: { display: false } },
      y: { ticks: { color: "#64748b", stepSize: 1 }, grid: { color: "rgba(148,163,184,0.08)" } },
    },
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="page-content">
        <div className="container" style={{ maxWidth: "900px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "28px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                Election Results
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "4px" }}>
                Live results and winner announcement
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={load}>
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="page-loader">
              <div className="spinner spinner-lg" />
              <p style={{ color: "var(--text-muted)" }}>Loading results...</p>
            </div>
          ) : error ? (
            <div className="glass-card" style={{ padding: "48px", textAlign: "center" }}>
              <AlertTriangle size={40} color="#f59e0b" style={{ marginBottom: "16px" }} />
              <h3 style={{ fontSize: "1.125rem", marginBottom: "8px" }}>Results Not Available</h3>
              <p style={{ color: "var(--text-secondary)", maxWidth: "400px", margin: "0 auto" }}>{error}</p>
            </div>
          ) : (
            <>
              {/* Voting Status */}
              <div
                style={{
                  marginBottom: "28px",
                  padding: "16px 20px",
                  borderRadius: "var(--radius)",
                  background: data.isVotingOpen ? "rgba(245, 158, 11, 0.08)" : "rgba(6, 214, 160, 0.08)",
                  border: `1px solid ${data.isVotingOpen ? "rgba(245, 158, 11, 0.25)" : "rgba(6, 214, 160, 0.25)"}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {data.isVotingOpen ? (
                  <>
                    <AlertTriangle size={18} color="#fbbf24" />
                    <span style={{ color: "#fbbf24", fontWeight: 500 }}>Voting is still in progress — results will be finalized when voting closes.</span>
                  </>
                ) : (
                  <>
                    <Trophy size={18} color="#06d6a0" />
                    <span style={{ color: "#06d6a0", fontWeight: 500 }}>Voting has ended — final results are shown below.</span>
                  </>
                )}
              </div>

              {/* Winner */}
              {!data.isVotingOpen && data.winner && (
                <div className="winner-banner animate-fade-in" style={{ marginBottom: "28px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "14px",
                        background: "rgba(6, 214, 160, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Trophy size={28} color="#06d6a0" />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                        {data.winner.tie ? "Election Result — Tie" : "🏆 Election Winner"}
                      </div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#06d6a0", letterSpacing: "-0.02em" }}>
                        {data.winner.tie
                          ? data.winner.candidates.map((c) => c.name).join(" & ")
                          : `${data.winner.candidate.name}`}
                      </div>
                      {!data.winner.tie && (
                        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                          {data.winner.candidate.party} — {data.winner.candidate.votes} votes
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Chart */}
              {data.candidates.length > 0 && barData && (
                <div className="chart-container" style={{ marginBottom: "28px" }}>
                  <div className="section-heading">
                    <BarChart3 size={18} style={{ color: "var(--primary-light)" }} />
                    <h2>Vote Count</h2>
                    <div className="heading-line" />
                  </div>
                  <Bar data={barData} options={chartOptions} />
                </div>
              )}

              {/* Candidates Ranking */}
              <div className="glass-card" style={{ overflow: "hidden" }}>
                <div className="section-heading" style={{ padding: "24px 24px 0" }}>
                  <Users size={18} style={{ color: "var(--primary-light)" }} />
                  <h2>Candidate Rankings</h2>
                  <div className="heading-line" />
                </div>
                {data.candidates.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <h3>No results to display</h3>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Candidate</th>
                          <th>Party</th>
                          <th>Votes</th>
                          <th>Share</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.candidates.map((c, i) => {
                          const totalVotes = data.candidates.reduce((sum, x) => sum + x.votes, 0);
                          const pct = totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : 0;
                          return (
                            <tr key={c._id}>
                              <td>
                                <span
                                  style={{
                                    fontWeight: 700,
                                    color: i === 0 ? "#06d6a0" : i === 1 ? "#818cf8" : i === 2 ? "#fbbf24" : "var(--text-muted)",
                                    fontSize: "1rem",
                                  }}
                                >
                                  #{i + 1}
                                </span>
                              </td>
                              <td style={{ fontWeight: 600 }}>{c.name}</td>
                              <td><span className="badge badge-info">{c.party}</span></td>
                              <td style={{ fontWeight: 700, fontSize: "1.0625rem" }}>{c.votes}</td>
                              <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div
                                    style={{
                                      width: "60px",
                                      height: "6px",
                                      borderRadius: "3px",
                                      background: "var(--surface-3)",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <div
                                      style={{
                                        height: "100%",
                                        width: `${pct}%`,
                                        borderRadius: "3px",
                                        background: chartColors[i % chartColors.length],
                                        transition: "width 0.5s ease",
                                      }}
                                    />
                                  </div>
                                  <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 500 }}>
                                    {pct}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
