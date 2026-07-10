import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="border-b border-ink/15 bg-linen/95 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight">
          Intern Showcase
        </Link>
        <div className="flex items-center gap-5 font-mono text-xs uppercase tracking-wider">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-rust transition-colors">
                Dashboard
              </Link>
              <Link to={`/portfolio/${user.slug}`} className="hover:text-rust transition-colors">
                My Portfolio
              </Link>
              <button onClick={handleLogout} className="hover:text-rust transition-colors">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-rust transition-colors">
                Log in
              </Link>
              <Link
                to="/signup"
                className="border border-ink px-3 py-1.5 hover:bg-ink hover:text-linen transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
