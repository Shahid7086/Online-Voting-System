import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { Vote, CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw } from "lucide-react";

const avatarGradients = [
  "linear-gradient(135deg, #6366f1, #8b5cf6)",
  "linear-gradient(135deg, #06d6a0, #14b8a6)",
  "linear-gradient(135deg, #f59e0b, #d97706)",
  "linear-gradient(135deg, #f43f5e, #e11d48)",
  "linear-gradient(135deg, #22d3ee, #06b6d4)",
  "linear-gradient(135deg, #a855f7, #7c3aed)",
  "linear-gradient(135deg, #ec4899, #db2777)",
  "linear-gradient(135deg, #84cc16, #65a30d)",
];

const VoterDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [status, setStatus] = useState({ isVotingOpen: false, hasVoted: false, votedFor: null });
  const [loading, setLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmCandidate, setConfirmCandidate] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [candidatesRes, statusRes] = await Promise.all([
        api.get("/voter/candidates"),
        api.get("/voter/status"),
      ]);
      setCandidates(candidatesRes.data.candidates);
      setStatus(statusRes.data);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to fetch dashboard data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const castVote = async (candidateId) => {
    setVoteLoading(candidateId);
    try {
      await api.post("/voter/vote", { candidateId });
      showToast("Your vote has been cast successfully! 🎉");
      setConfirmCandidate(null);
      await load();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to cast vote", "error");
    } finally {
      setVoteLoading("");
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="page-loader">
          <div className="spinner spinner-lg" />
          <p style={{ color: "var(--text-muted)" }}>Loading voter dashboard...</p>
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
                Voter Dashboard
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "4px" }}>
                Review candidates and cast your vote
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={load} style={{ gap: "6px" }}>
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {/* Status Cards */}
          <div className="grid-stats" style={{ marginBottom: "28px", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
            <div className={`stat-card ${status.isVotingOpen ? "green" : "rose"} animate-fade-in-up`}>
              <div className="stat-icon">
                {status.isVotingOpen ? <Clock size={22} /> : <XCircle size={22} />}
              </div>
              <div className="stat-label">Voting Status</div>
              <div style={{ marginTop: "4px" }}>
                <span className={`badge ${status.isVotingOpen ? "badge-success" : "badge-danger"}`}>
                  {status.isVotingOpen ? "● Voting is Open" : "● Voting is Closed"}
                </span>
              </div>
            </div>

            <div className={`stat-card ${status.hasVoted ? "amber" : "purple"} animate-fade-in-up`} style={{ animationDelay: "0.1s" }}>
              <div className="stat-icon">
                {status.hasVoted ? <CheckCircle size={22} /> : <Vote size={22} />}
              </div>
              <div className="stat-label">Your Vote Status</div>
              <div style={{ marginTop: "4px" }}>
                <span className={`badge ${status.hasVoted ? "badge-warning" : "badge-info"}`}>
                  {status.hasVoted ? "✓ Vote Submitted" : "○ Not Voted Yet"}
                </span>
              </div>
            </div>

            <div className="stat-card cyan animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="stat-icon"><Vote size={22} /></div>
              <div className="stat-label">Total Candidates</div>
              <div className="stat-value">{candidates.length}</div>
            </div>
          </div>

          {/* Already voted banner */}
          {status.hasVoted && (
            <div
              className="animate-fade-in"
              style={{
                padding: "20px 24px",
                borderRadius: "var(--radius)",
                background: "rgba(6, 214, 160, 0.08)",
                border: "1px solid rgba(6, 214, 160, 0.25)",
                marginBottom: "28px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <CheckCircle size={22} color="#06d6a0" />
              <div>
                <div style={{ fontWeight: 600, color: "#06d6a0" }}>Vote Recorded Successfully</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Your vote has been securely recorded. You can view results after voting ends.
                </div>
              </div>
            </div>
          )}

          {/* Voting closed banner */}
          {!status.isVotingOpen && !status.hasVoted && (
            <div
              className="animate-fade-in"
              style={{
                padding: "20px 24px",
                borderRadius: "var(--radius)",
                background: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                marginBottom: "28px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <AlertTriangle size={22} color="#f59e0b" />
              <div>
                <div style={{ fontWeight: 600, color: "#fbbf24" }}>Voting is Currently Closed</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Please wait for the admin to open voting. You'll be able to cast your vote once voting begins.
                </div>
              </div>
            </div>
          )}

          {/* Candidates Section */}
          <div className="section-heading">
            <Vote size={18} style={{ color: "var(--primary-light)" }} />
            <h2>Candidates</h2>
            <div className="heading-line" />
            <span className="badge badge-neutral">{candidates.length}</span>
          </div>

          {candidates.length === 0 ? (
            <div className="glass-card">
              <div className="empty-state">
                <div className="empty-icon">🗳️</div>
                <h3>No candidates available</h3>
                <p>Candidates will appear here once the election admin adds them.</p>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: "20px",
              }}
            >
              {candidates.map((candidate, index) => {
                const isVotedFor = status.votedFor === candidate._id;
                return (
                  <div
                    key={candidate._id}
                    className="candidate-card animate-fade-in-up"
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      borderColor: isVotedFor ? "rgba(6, 214, 160, 0.4)" : undefined,
                      boxShadow: isVotedFor ? "var(--shadow-glow-accent)" : undefined,
                    }}
                  >
                    {isVotedFor && (
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          background: "rgba(6, 214, 160, 0.15)",
                          borderRadius: "999px",
                          padding: "4px 10px",
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          color: "#06d6a0",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <CheckCircle size={12} /> Your Vote
                      </div>
                    )}

                    <div className="card-header">
                      <div
                        className="avatar"
                        style={{ background: avatarGradients[index % avatarGradients.length] }}
                      >
                        {candidate.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: "1.0625rem", fontWeight: 700 }}>{candidate.name}</div>
                        <span className="badge badge-info" style={{ marginTop: "4px" }}>{candidate.party}</span>
                      </div>
                    </div>

                    <div className="card-body">
                      <div style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-muted)", marginBottom: "6px" }}>
                        Manifesto
                      </div>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                        {candidate.manifesto}
                      </p>
                    </div>

                    <div className="card-footer">
                      {status.hasVoted ? (
                        <span
                          style={{
                            fontSize: "0.8125rem",
                            color: "var(--text-muted)",
                            fontWeight: 500,
                          }}
                        >
                          {isVotedFor ? "✓ You voted for this candidate" : "Vote already cast"}
                        </span>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={!status.isVotingOpen || voteLoading === candidate._id}
                          onClick={() => setConfirmCandidate(candidate)}
                        >
                          {!status.isVotingOpen ? (
                            <>
                              <XCircle size={14} />
                              Voting Closed
                            </>
                          ) : voteLoading === candidate._id ? (
                            <span className="spinner" />
                          ) : (
                            <>
                              <Vote size={14} />
                              Cast Vote
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Vote Confirmation Dialog */}
      {confirmCandidate && (
        <div className="dialog-overlay" onClick={() => setConfirmCandidate(null)}>
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <Vote size={24} color="#6366f1" />
              <h3>Confirm Your Vote</h3>
            </div>
            <p>
              You are about to vote for <strong>{confirmCandidate.name}</strong> ({confirmCandidate.party}).
              <br /><br />
              <span style={{ color: "#fbbf24", fontSize: "0.8125rem" }}>
                ⚠️ This action cannot be undone. You can only vote once.
              </span>
            </p>
            <div className="dialog-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirmCandidate(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => castVote(confirmCandidate._id)}
                disabled={voteLoading === confirmCandidate._id}
              >
                {voteLoading === confirmCandidate._id ? <span className="spinner" /> : <Vote size={14} />}
                Confirm Vote
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

export default VoterDashboard;
