import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl font-semibold mb-2">Welcome back</h1>
      <p className="font-body text-sm text-ink/70 mb-8">
        New here? <Link to="/signup" className="text-rust underline">Create an account</Link>
      </p>

      <form onSubmit={handleSubmit} className="catalog-card p-6 pt-8 flex flex-col gap-4">
        {error && <p className="font-mono text-xs text-rust">{error}</p>}

        <label className="font-mono text-xs uppercase tracking-wider">
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-2 border border-ink/20 bg-card font-body text-base focus:outline-none focus:border-rust"
          />
        </label>

        <label className="font-mono text-xs uppercase tracking-wider">
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-2 border border-ink/20 bg-card font-body text-base focus:outline-none focus:border-rust"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-ink text-linen px-6 py-3 mt-2 font-mono text-sm uppercase tracking-wider hover:bg-rust transition-colors disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
