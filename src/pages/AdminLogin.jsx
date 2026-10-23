
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import "./Admin.css";

const API_URL = "https://koti-kurra-api.onrender.com";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const text = await response.text();

        let data;

        try {
        data = JSON.parse(text);
        } catch {
        console.error("Unexpected server response:", text.slice(0, 300));
        throw new Error(
            "The backend returned HTML instead of JSON. Check the API URL and server routes."
        );
}

      if (!response.ok) {
        throw new Error(data.message || "Unable to sign in");
      }

      sessionStorage.setItem("adminToken", data.token);
      sessionStorage.setItem("adminUsername", data.username);

      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Make sure your backend is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-logo">K</div>
          <span>KOTTIKURRA</span>
          <small>REAL ESTATE</small>
        </div>

        <div className="admin-login-heading">
          <div className="admin-login-icon">
            <LockKeyhole size={22} />
          </div>
          <h1>Admin Login</h1>
          <p>Sign in to manage your real estate projects.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-username">Username</label>
          <input
            id="admin-username"
            type="text"
            autoComplete="username"
            placeholder="Enter admin username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="admin-password">Password</label>
          <div className="admin-password-field">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="admin-password-toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <div className="admin-login-error">{error}</div>}

          <button
            type="submit"
            className="admin-login-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="admin-login-footer">
          Authorized personnel only
        </p>
      </section>
    </main>
  );
}
