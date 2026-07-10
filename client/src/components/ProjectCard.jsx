export default function ProjectCard({ project, ownerSlug, showActions, onEdit, onDelete }) {
  const shareUrl = `${window.location.origin}/project/${project.slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied — paste it anywhere to share this project.");
  };

  return (
    <div className="catalog-card p-5 pt-7 flex flex-col gap-3">
      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-40 object-cover border border-ink/10"
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold leading-snug">{project.title}</h3>
        <span className="stamp shrink-0">Catalogued</span>
      </div>

      <p className="font-body text-sm text-ink/80 leading-relaxed line-clamp-3">
        {project.description}
      </p>

      {project.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {project.tags.map((tag) => (
            <span key={tag} className="ticket-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-ink/10">
        <div className="flex gap-3 font-mono text-xs uppercase tracking-wider">
          {project.projectLink && (
            <a
              href={project.projectLink}
              target="_blank"
              rel="noreferrer"
              className="text-forest hover:text-rust transition-colors"
            >
              View live ↗
            </a>
          )}
          <button onClick={copyLink} className="text-forest hover:text-rust transition-colors">
            Copy share link
          </button>
        </div>

        {showActions && (
          <div className="flex gap-3 font-mono text-xs uppercase tracking-wider">
            <button onClick={() => onEdit(project)} className="hover:text-rust">
              Edit
            </button>
            <button onClick={() => onDelete(project._id)} className="hover:text-rust">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
