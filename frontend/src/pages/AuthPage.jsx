import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

const AuthPage = ({ mode }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "voter" });

  const isRegister = mode === "register";

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const action = isRegister ? register : login;
      const payload = isRegister ? form : { email: form.email, password: form.password };
      const { user } = await action(payload);
      navigate(user.role === "admin" ? "/admin" : "/voter");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0] || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "20%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,214,160,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="animate-fade-in-up"
        style={{
          width: "100%",
          maxWidth: "440px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link to="/" style={{ textDecoration: "none", color: "var(--text-primary)" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "var(--gradient-primary)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
                boxShadow: "0 8px 30px rgba(99, 102, 241, 0.3)",
              }}
            >
              <ShieldCheck size={28} color="#fff" />
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Secure<span style={{ color: "var(--primary-light)" }}>Vote</span>
            </h1>
          </Link>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "6px" }}>
            {isRegister ? "Create your account to start voting" : "Welcome back, sign in to continue"}
          </p>
        </div>

        {/* Form Card */}
        <div
          className="glass-card"
          style={{ padding: "32px" }}
        >
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {isRegister && (
              <div>
                <label className="form-label" htmlFor="auth-name">Full Name</label>
                <div style={{ position: "relative" }}>
                  <User
                    size={16}
                    style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                  />
                  <input
                    id="auth-name"
                    className="form-input"
                    style={{ paddingLeft: "40px" }}
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    minLength={2}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="form-label" htmlFor="auth-email">Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                />
                <input
                  id="auth-email"
                  className="form-input"
                  type="email"
                  style={{ paddingLeft: "40px" }}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="auth-password">Password</label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                />
                <input
                  id="auth-password"
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  style={{ paddingLeft: "40px", paddingRight: "44px" }}
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="form-label" htmlFor="auth-role">Register As</label>
                <select
                  id="auth-role"
                  className="form-select"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="voter">Voter</option>
                  <option value="admin">Election Admin</option>
                </select>
              </div>
            )}

            {error && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "var(--radius-xs)",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  color: "#f87171",
                  fontSize: "0.8125rem",
                }}
              >
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: "4px" }}
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  {isRegister ? "Create Account" : "Sign In"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid var(--border-color)",
              fontSize: "0.875rem",
              color: "var(--text-muted)",
            }}
          >
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link
              to={isRegister ? "/login" : "/register"}
              style={{ color: "var(--primary-light)", textDecoration: "none", fontWeight: 600 }}
            >
              {isRegister ? "Sign In" : "Register"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
