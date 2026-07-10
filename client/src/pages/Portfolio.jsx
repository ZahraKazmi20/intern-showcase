import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import ProjectCard from "../components/ProjectCard.jsx";

export default function Portfolio() {
  const { userSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data } = await api.get(`/projects/public/${userSlug}`);
        setData(data);
      } catch (err) {
        setError(err.response?.status === 404 ? "Portfolio not found" : "Error loading portfolio");
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [userSlug]);

  if (loading) return <div className="max-w-5xl mx-auto px-6 py-20 font-body">Loading…</div>;
  if (error) return <div className="max-w-5xl mx-auto px-6 py-20 font-body text-rust">{error}</div>;
  if (!data) return null;

  const { user, projects } = data;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12">
        <span className="stamp mb-4 inline-block">Portfolio</span>
        <h1 className="font-display text-5xl font-semibold mb-3">{user.name}</h1>
        {user.bio && <p className="font-body text-lg text-ink/75 max-w-2xl">{user.bio}</p>}
        <p className="font-mono text-xs uppercase tracking-wider text-ink/60 mt-4">
          {projects.length} project{projects.length !== 1 ? "s" : ""} · Catalogued on Intern Showcase
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="catalog-card p-12 text-center">
          <p className="font-body text-ink/70">{user.name} hasn't added any projects yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} ownerSlug={userSlug} />
          ))}
        </div>
      )}
    </div>
  );
}
