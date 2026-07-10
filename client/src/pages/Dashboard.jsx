import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import ProjectCard from "../components/ProjectCard.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", tags: "", projectLink: "" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
    fetchProjects();
  }, [user, navigate]);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects/mine");
      setProjects(data);
    } catch (err) {
      setError("Could not load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImage(e.target.files?.[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("tags", form.tags);
      formData.append("projectLink", form.projectLink);
      if (image) formData.append("image", image);

      if (editingId) {
        await api.put(`/projects/${editingId}`, formData);
      } else {
        await api.post("/projects", formData);
      }

      setForm({ title: "", description: "", tags: "", projectLink: "" });
      setImage(null);
      setEditingId(null);
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving project");
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title,
      description: project.description,
      tags: project.tags.join(", "),
      projectLink: project.projectLink,
    });
    setEditingId(project._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      setError("Could not delete project");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ title: "", description: "", tags: "", projectLink: "" });
    setImage(null);
    setError("");
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-semibold mb-2">Your catalog</h1>
        <p className="font-body text-ink/70">
          {projects.length} project{projects.length !== 1 ? "s" : ""} catalogued ·{" "}
          <span className="font-mono text-xs">
            Your public portfolio:{" "}
            <a href={`/portfolio/${user.slug}`} className="text-rust hover:underline">
              intern-showcase.com/portfolio/{user.slug}
            </a>
          </span>
        </p>
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="mb-8 bg-ink text-linen px-6 py-3 font-mono text-sm uppercase tracking-wider hover:bg-rust transition-colors"
        >
          + Add project
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="catalog-card p-6 mb-8 flex flex-col gap-4">
          <h2 className="font-display text-lg font-semibold">
            {editingId ? "Edit project" : "New project"}
          </h2>

          {error && <p className="font-mono text-xs text-rust">{error}</p>}

          <label className="font-mono text-xs uppercase tracking-wider">
            Project title
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength="100"
              className="w-full mt-1 px-3 py-2 border border-ink/20 bg-card font-body text-base focus:outline-none focus:border-rust"
            />
          </label>

          <label className="font-mono text-xs uppercase tracking-wider">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              maxLength="2000"
              rows="5"
              className="w-full mt-1 px-3 py-2 border border-ink/20 bg-card font-body text-base focus:outline-none focus:border-rust resize-none"
            />
          </label>

          <label className="font-mono text-xs uppercase tracking-wider">
            Tags (comma-separated)
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, API design"
              className="w-full mt-1 px-3 py-2 border border-ink/20 bg-card font-body text-base focus:outline-none focus:border-rust"
            />
          </label>

          <label className="font-mono text-xs uppercase tracking-wider">
            Project link (optional)
            <input
              type="url"
              name="projectLink"
              value={form.projectLink}
              onChange={handleChange}
              placeholder="https://github.com/... or live demo URL"
              className="w-full mt-1 px-3 py-2 border border-ink/20 bg-card font-body text-base focus:outline-none focus:border-rust"
            />
          </label>

          <label className="font-mono text-xs uppercase tracking-wider">
            Project image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mt-1"
            />
          </label>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className="bg-ink text-linen px-6 py-2 font-mono text-sm uppercase tracking-wider hover:bg-rust transition-colors"
            >
              {editingId ? "Update" : "Add"} project
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="border border-ink px-6 py-2 font-mono text-sm uppercase tracking-wider hover:bg-linen transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="font-body text-ink/70">Loading your projects…</p>
      ) : projects.length === 0 ? (
        <div className="catalog-card p-12 text-center">
          <p className="font-body text-ink/70 mb-4">No projects yet. Add your first one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              ownerSlug={user.slug}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
