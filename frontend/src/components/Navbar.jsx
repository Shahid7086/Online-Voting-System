import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ShieldCheck, LogOut, LayoutDashboard, Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: theme === "dark" ? "rgba(15, 23, 41, 0.85)" : "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-color)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "var(--text-primary)",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "var(--gradient-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldCheck size={20} color="#fff" />
          </div>
          <span style={{ fontSize: "1.125rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Secure<span style={{ color: "var(--primary-light)" }}>Vote</span>
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button 
            onClick={toggleTheme} 
            className="btn btn-ghost btn-sm" 
            style={{ padding: "8px", borderRadius: "50%" }}
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "var(--surface-3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    color: "var(--primary-light)",
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {user.role}
                  </div>
                </div>
              </div>

              <Link
                to={user.role === "admin" ? "/admin" : "/voter"}
                className="btn btn-ghost btn-sm"
                style={{ gap: "6px" }}
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>

              <button onClick={onLogout} className="btn btn-sm" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.25)" }}>
                <LogOut size={14} />
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
