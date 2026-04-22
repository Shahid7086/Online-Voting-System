import { useEffect, useState, useCallback } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import Navbar from "../components/Navbar";
import api from "../services/api";
import {
  Users,
  Vote,
  BarChart3,
  Crown,
  Plus,
  Power,
  PowerOff,
  Trophy,
  Trash2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const chartColors = [
  "#6366f1", "#06d6a0", "#f59e0b", "#f43f5e", "#22d3ee",
  "#a855f7", "#14b8a6", "#ec4899", "#84cc16", "#f97316",
];

const AdminDashboard = () => {
  const [state, setState] = useState({
    candidates: [],
    totalVotes: 0,
    status: false,
    leaderText: "No votes yet",
    winnerText: null,
    winnerTie: false,
  });
  const [form, setForm] = useState({ name: "", party: "", manifesto: "" });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [candidatesRes, votesRes, statusRes, leaderRes, resultsRes] = await Promise.all([
        api.get("/admin/candidates"),
        api.get("/admin/total-votes"),
        api.get("/admin/voting-status"),
        api.get("/admin/leader"),
        api.get("/admin/results"),
      ]);

      const { leader, tie } = leaderRes.data;
      let winnerText = null;
      let winnerTie = false;
      if (!resultsRes.data.isVotingOpen && resultsRes.data.winner) {
        if (resultsRes.data.winner.tie) {
          winnerTie = true;
          winnerText = `Tie: ${resultsRes.data.winner.candidates.map((c) => c.name).join(", ")}`;
        } else {
          winnerText = `${resultsRes.data.winner.candidate.name} (${resultsRes.data.winner.candidate.party})`;
        }
      }

      setState({
        candidates: candidatesRes.data.candidates,
        totalVotes: votesRes.data.totalVotes,
        status: statusRes.data.isVotingOpen,
        leaderText: tie
          ? "Tie between top candidates"
          : leader
            ? `${leader.name} (${leader.party}) — ${leader.votes} votes`
            : "No votes yet",
        winnerText,
        winnerTie,
      });
    } catch (err) {
      showToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addCandidate = async (e) => {
    e.preventDefault();
    setActionLoading("add");
    try {
      await api.post("/admin/candidates", form);
      setForm({ name: "", party: "", manifesto: "" });
      showToast("Candidate added successfully!");
      await load();
    } catch (err) {
      showToast(err.response?.data?.message || err.response?.data?.errors?.[0] || "Failed to add candidate", "error");
    } finally {
      setActionLoading("");
    }
  };

  const deleteCandidate = async (id) => {
    setActionLoading("delete");
    try {
      await api.delete(`/admin/candidates/${id}`);
      showToast("Candidate removed");
      setDeleteConfirm(null);
      await load();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete candidate", "error");
    } finally {
      setActionLoading("");
    }
  };

  const updateVotingStatus = async (isVotingOpen) => {
    setActionLoading(isVotingOpen ? "start" : "stop");
    try {
      await api.put("/admin/voting-status", { isVotingOpen });
      showToast(isVotingOpen ? "Voting has been opened!" : "Voting has been closed!");
      await load();
    } catch (err) {
      showToast("Failed to update voting status", "error");
    } finally {
      setActionLoading("");
    }
  };

  const barData = {
    labels: state.candidates.map((c) => c.name),
    datasets: [
      {
        label: "Votes",
        data: state.candidates.map((c) => c.votes),
        backgroundColor: chartColors.slice(0, state.candidates.length),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const pieData = {
    labels: state.candidates.map((c) => `${c.name} (${c.party})`),
    datasets: [
      {
        data: state.candidates.map((c) => c.votes),
        backgroundColor: chartColors.slice(0, state.candidates.length),
        borderWidth: 2,
        borderColor: "var(--surface)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: { color: "#94a3b8", font: { family: "Inter", size: 12 } },
      },
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
      y: {
        ticks: { color: "#64748b", stepSize: 1 },
        grid: { color: "rgba(148,163,184,0.08)" },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#94a3b8", font: { family: "Inter", size: 12 }, padding: 16, usePointStyle: true },
      },
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
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="page-loader">
          <div className="spinner spinner-lg" />
          <p style={{ color: "var(--text-muted)" }}>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="page-content">
        <div className="container">
          {/* Page Header */}
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
                Admin Dashboard
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "4px" }}>
                Manage candidates, control voting, and view analytics
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={load} style={{ gap: "6px" }}>
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid-stats" style={{ marginBottom: "28px" }}>
            <div className="stat-card purple animate-fade-in-up" style={{ animationDelay: "0s" }}>
              <div className="stat-icon"><Users size={22} /></div>
              <div className="stat-label">Total Candidates</div>
              <div className="stat-value">{state.candidates.length}</div>
            </div>
            <div className="stat-card green animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="stat-icon"><Vote size={22} /></div>
              <div className="stat-label">Total Votes Cast</div>
              <div className="stat-value">{state.totalVotes}</div>
            </div>
            <div className="stat-card amber animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="stat-icon"><BarChart3 size={22} /></div>
              <div className="stat-label">Voting Status</div>
              <div className="stat-value" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className={`badge ${state.status ? "badge-success" : "badge-danger"}`}>
                  {state.status ? "● Open" : "● Closed"}
                </span>
              </div>
            </div>
            <div className="stat-card cyan animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="stat-icon"><Crown size={22} /></div>
              <div className="stat-label">Leading Candidate</div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 600, marginTop: "4px", lineHeight: 1.4 }}>
                {state.leaderText}
              </div>
            </div>
          </div>

          {/* Winner Banner */}
          {state.winnerText && (
            <div className="winner-banner animate-fade-in" style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Trophy size={24} color="#06d6a0" />
                <div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                    {state.winnerTie ? "Election Result — Tie" : "Election Winner"}
                  </div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#06d6a0" }}>
                    {state.winnerText}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Voting Controls */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
            <button
              className="btn btn-accent"
              onClick={() => updateVotingStatus(true)}
              disabled={state.status || actionLoading === "start"}
            >
              {actionLoading === "start" ? <span className="spinner" /> : <Power size={16} />}
              Start Voting
            </button>
            <button
              className="btn btn-danger"
              onClick={() => updateVotingStatus(false)}
              disabled={!state.status || actionLoading === "stop"}
            >
              {actionLoading === "stop" ? <span className="spinner" /> : <PowerOff size={16} />}
              Stop Voting
            </button>
          </div>

          {/* Main Grid: Add Candidate + Bar Chart */}
          <div className="grid-2" style={{ marginBottom: "28px" }}>
            {/* Add Candidate Form */}
            <div className="glass-card" style={{ padding: "28px" }}>
              <div className="section-heading">
                <Plus size={18} style={{ color: "var(--primary-light)" }} />
                <h2>Add Candidate</h2>
                <div className="heading-line" />
              </div>

              <form onSubmit={addCandidate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label className="form-label" htmlFor="candidate-name">Candidate Name</label>
                  <input
                    id="candidate-name"
                    className="form-input"
                    placeholder="Enter candidate name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="candidate-party">Party Name</label>
                  <input
                    id="candidate-party"
                    className="form-input"
                    placeholder="Enter party name"
                    value={form.party}
                    onChange={(e) => setForm({ ...form, party: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="candidate-manifesto">Manifesto</label>
                  <textarea
                    id="candidate-manifesto"
                    className="form-input"
                    placeholder="Write about the candidate's vision and promises (min 10 characters)"
                    value={form.manifesto}
                    onChange={(e) => setForm({ ...form, manifesto: e.target.value })}
                    required
                    minLength={10}
                  />
                </div>
                <button className="btn btn-primary" disabled={actionLoading === "add"}>
                  {actionLoading === "add" ? <span className="spinner" /> : <Plus size={16} />}
                  Add Candidate
                </button>
              </form>
            </div>

            {/* Bar Chart */}
            <div className="chart-container">
              <div className="section-heading">
                <BarChart3 size={18} style={{ color: "var(--primary-light)" }} />
                <h2>Vote Results</h2>
                <div className="heading-line" />
              </div>
              {state.candidates.length ? (
                <Bar data={barData} options={chartOptions} />
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <h3>No data yet</h3>
                  <p>Add candidates to see vote results here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Pie Chart */}
          {state.candidates.length > 0 && (
            <div className="chart-container" style={{ marginBottom: "28px" }}>
              <div className="section-heading">
                <BarChart3 size={18} style={{ color: "var(--accent)" }} />
                <h2>Vote Distribution</h2>
                <div className="heading-line" />
              </div>
              <div style={{ maxWidth: "400px", margin: "0 auto" }}>
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>
          )}

          {/* Candidates Table */}
          <div className="glass-card" style={{ overflow: "hidden" }}>
            <div className="section-heading" style={{ padding: "24px 24px 0" }}>
              <Users size={18} style={{ color: "var(--primary-light)" }} />
              <h2>All Candidates</h2>
              <div className="heading-line" />
              <span className="badge badge-neutral">{state.candidates.length}</span>
            </div>

            {state.candidates.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🗳️</div>
                <h3>No candidates registered</h3>
                <p>Use the form above to add candidates to the election.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Party</th>
                      <th>Manifesto</th>
                      <th>Votes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.candidates.map((c, i) => (
                      <tr key={c._id}>
                        <td style={{ color: "var(--text-muted)", fontWeight: 600 }}>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                        <td>
                          <span className="badge badge-info">{c.party}</span>
                        </td>
                        <td style={{ color: "var(--text-secondary)", maxWidth: "300px" }}>
                          {c.manifesto.length > 80 ? c.manifesto.slice(0, 80) + "..." : c.manifesto}
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, fontSize: "1.0625rem" }}>{c.votes}</span>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setDeleteConfirm(c)}
                            style={{ padding: "6px 10px" }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="dialog-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <AlertTriangle size={24} color="#f59e0b" />
              <h3>Delete Candidate</h3>
            </div>
            <p>
              Are you sure you want to remove <strong>{deleteConfirm.name}</strong> ({deleteConfirm.party})? This action cannot be undone.
            </p>
            <div className="dialog-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteCandidate(deleteConfirm._id)}
                disabled={actionLoading === "delete"}
              >
                {actionLoading === "delete" ? <span className="spinner" /> : <Trash2 size={14} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
