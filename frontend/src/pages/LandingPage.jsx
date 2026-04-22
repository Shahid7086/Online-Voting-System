import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { ShieldCheck, Vote, BarChart3, Users, Lock, Zap, Globe, ChevronRight } from "lucide-react";

const features = [
  {
    icon: <Lock size={24} />,
    title: "End-to-End Encryption",
    desc: "Military-grade encryption ensures your vote remains confidential and tamper-proof throughout the entire process.",
    color: "#6366f1",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "One Person, One Vote",
    desc: "Advanced verification system enforces strict one-vote-per-user policy with database-level transaction guarantees.",
    color: "#06d6a0",
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Real-Time Analytics",
    desc: "Live vote tracking, bar & pie charts, winner detection, and tie-breaking logic—all updating in real time.",
    color: "#f59e0b",
  },
  {
    icon: <Users size={24} />,
    title: "Role-Based Access",
    desc: "Separate admin and voter dashboards with protected routes and middleware-enforced role authorization.",
    color: "#f43f5e",
  },
  {
    icon: <Zap size={24} />,
    title: "Instant Results",
    desc: "Results are calculated and displayed the moment voting closes, with automatic winner and tie detection.",
    color: "#22d3ee",
  },
  {
    icon: <Globe size={24} />,
    title: "Vote from Anywhere",
    desc: "Fully responsive design lets voters participate from any device—desktop, tablet, or mobile phone.",
    color: "#a855f7",
  },
];

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "100px 0 80px",
          textAlign: "center",
        }}
      >
        {/* Decorative orbs */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container animate-fade-in-up" style={{ position: "relative", zIndex: 1 }}>
          <div
            className="badge badge-info"
            style={{ marginBottom: "20px", display: "inline-flex" }}
          >
            <Vote size={12} />
            Trusted by Democratic Institutions
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            Democracy,{" "}
            <span
              style={{
                background: "var(--gradient-primary)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Digitized
            </span>
            <br />& Secured
          </h1>

          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--text-secondary)",
              maxWidth: "600px",
              margin: "0 auto 36px",
              lineHeight: 1.7,
            }}
          >
            A production-ready online voting platform with JWT authentication,
            role-based access control, real-time analytics, and chart dashboards.
            Cast your vote securely from anywhere.
          </p>

          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            {user ? (
              <Link
                to={user.role === "admin" ? "/admin" : "/voter"}
                className="btn btn-primary btn-lg"
              >
                Go to Dashboard <ChevronRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started <ChevronRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-ghost btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "48px",
              marginTop: "60px",
              flexWrap: "wrap",
            }}
          >
            {[
              ["256-bit", "Encryption"],
              ["99.9%", "Uptime"],
              ["< 50ms", "Latency"],
              ["JWT", "Auth"],
            ].map(([num, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary-light)" }}>{num}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "2px" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "60px 0 80px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }} className="animate-fade-in">
            <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "12px" }}>
              Built for Trust & Transparency
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto" }}>
              Every feature is designed to ensure fair, secure, and accessible elections.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-card"
                style={{ padding: "28px", animationDelay: `${i * 0.1}s` }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: `${f.color}15`,
                    color: f.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, marginBottom: "8px" }}>
                  {f.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "60px 0 80px", background: "rgba(22, 32, 51, 0.3)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "12px" }}>
              How It Works
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>Three simple steps to cast your vote</p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {[
              { step: "01", title: "Register & Verify", desc: "Create your account with a valid email and secure password. Your identity is verified through JWT authentication.", color: "var(--primary)" },
              { step: "02", title: "Review Candidates", desc: "Browse through all candidates, read their manifestos, and compare their party platforms before making your choice.", color: "var(--accent)" },
              { step: "03", title: "Cast Your Vote", desc: "Select your preferred candidate and confirm. Your vote is recorded securely with transaction guarantees.", color: "#f59e0b" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  padding: "36px 24px",
                }}
              >
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: 900,
                    background: `linear-gradient(135deg, ${item.color}, transparent)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "16px",
                    lineHeight: 1,
                  }}
                >
                  {item.step}
                </div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "10px" }}>{item.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "16px" }}>
            Ready to Make Your Voice Heard?
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "28px", maxWidth: "450px", margin: "0 auto 28px" }}>
            Join thousands of voters using SecureVote for fair and transparent elections.
          </p>
          {!user && (
            <Link to="/register" className="btn btn-accent btn-lg">
              Create Free Account <ChevronRight size={18} />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-color)",
          padding: "24px 0",
          textAlign: "center",
          fontSize: "0.8125rem",
          color: "var(--text-muted)",
        }}
      >
        <div className="container">
          © {new Date().getFullYear()} SecureVote — Built with React, Node.js & MongoDB
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
