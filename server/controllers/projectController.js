import slugify from "slugify";
import Project from "../models/Project.js";
import User from "../models/User.js";

const makeUniqueProjectSlug = async (title) => {
  let base = slugify(title, { lower: true, strict: true });
  let slug = base;
  let count = 1;
  while (await Project.findOne({ slug })) {
    slug = `${base}-${count}`;
    count += 1;
  }
  return slug;
};

// POST /api/projects  (private)
export const createProject = async (req, res) => {
  try {
    const { title, description, tags, projectLink } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const slug = await makeUniqueProjectSlug(title);
    const tagArray = Array.isArray(tags)
      ? tags
      : (tags || "").split(",").map((t) => t.trim()).filter(Boolean);

    const project = await Project.create({
      owner: req.user._id,
      title,
      description,
      tags: tagArray,
      projectLink: projectLink || "",
      imageUrl: req.file ? req.file.path : "",
      slug,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Could not create project", error: error.message });
  }
};

// GET /api/projects/mine  (private) — projects belonging to logged-in user
export const getMyProjects = async (req, res) => {
  const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json(projects);
};

// GET /api/projects/public/:userSlug  (public) — a whole portfolio page
export const getPublicPortfolio = async (req, res) => {
  const user = await User.findOne({ slug: req.params.userSlug }).select("-password -email");
  if (!user) return res.status(404).json({ message: "Portfolio not found" });

  const projects = await Project.find({ owner: user._id }).sort({ createdAt: -1 });
  res.json({ user, projects });
};

// GET /api/projects/share/:projectSlug  (public) — a single shareable project page
export const getProjectBySlug = async (req, res) => {
  const project = await Project.findOne({ slug: req.params.projectSlug });
  if (!project) return res.status(404).json({ message: "Project not found" });

  const owner = await User.findById(project.owner).select("-password -email");
  res.json({ project, owner });
};

// PUT /api/projects/:id  (private)
export const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You don't own this project" });
  }

  const { title, description, tags, projectLink } = req.body;
  if (title) project.title = title;
  if (description) project.description = description;
  if (tags) {
    project.tags = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  if (projectLink !== undefined) project.projectLink = projectLink;
  if (req.file) project.imageUrl = req.file.path;

  await project.save();
  res.json(project);
};

// DELETE /api/projects/:id  (private)
export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You don't own this project" });
  }
  await project.deleteOne();
  res.json({ message: "Project deleted" });
};
