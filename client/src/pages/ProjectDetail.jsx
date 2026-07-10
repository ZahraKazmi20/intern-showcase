import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";

export default function ProjectDetail() {
  const { projectSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/projects/share/${projectSlug}`);
        setData(data);
      } catch (err) {
        setError(err.response?.status === 404 ? "Project not found" : "Error loading project");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectSlug]);

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-20 font-body">Loading…</div>;
  if (error) return <div className="max-w-3xl mx-auto px-6 py-20 font-body text-rust">{error}</div>;
  if (!data) return null;

  const { project, owner } = data;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        to={`/portfolio/${owner.slug}`}
        className="font-mono text-xs uppercase tracking-wider text-ink/60 hover:text-rust mb-6 inline-block"
      >
        ← Back to {owner.name}'s portfolio
      </Link>

      <div className="catalog-card p-8">
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-96 object-cover border border-ink/10 mb-8"
          />
        )}

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-4xl font-semibold mb-2">{project.title}</h1>
            <p className="font-mono text-xs uppercase tracking-wider text-ink/60">
              By <span className="font-semibold text-ink">{owner.name}</span>
            </p>
          </div>
          <span className="stamp shrink-0">Catalogued</span>
        </div>

        <div className="prose prose-sm max-w-none mb-8">
          <p className="font-body text-lg text-ink/80 leading-relaxed whitespace-pre-wrap">
            {project.description}
          </p>
        </div>

        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-ink/10">
            {project.tags.map((tag) => (
              <span key={tag} className="ticket-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-4 font-mono text-sm uppercase tracking-wider">
            {project.projectLink && (
              <a
                href={project.projectLink}
                target="_blank"
                rel="noreferrer"
                className="bg-ink text-linen px-6 py-2 hover:bg-rust transition-colors"
              >
                View live project ↗
              </a>
            )}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied!");
            }}
            className="font-mono text-xs uppercase tracking-wider text-forest hover:text-rust transition-colors"
          >
            Copy share link
          </button>
        </div>
      </div>
    </div>
  );
}
