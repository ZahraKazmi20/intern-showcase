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
    console.log("=== CREATE PROJECT START ===");
    console.log("File received:", req.file); // Debug: see if file is there
    console.log("Body:", req.body); // Debug: see the form data
    console.log("User:", req.user); // Debug: see authenticated user
    
    const { title, description, tags, projectLink } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const slug = await makeUniqueProjectSlug(title);
    const tagArray = Array.isArray(tags)
      ? tags
      : (tags || "").split(",").map((t) => t.trim()).filter(Boolean);

    console.log("Image URL:", req.file ? req.file.path : "NO FILE"); // Debug
    console.log("Slug:", slug); // Debug

    const project = await Project.create({
      owner: req.user._id,
      title,
      description,
      tags: tagArray,
      projectLink: projectLink || "",
      imageUrl: req.file ? req.file.path : "",
      slug,
    });

    console.log("Project created successfully:", project._id); // Debug
    console.log("=== CREATE PROJECT END ===");
    res.status(201).json(project);
  } catch (error) {
    console.error("=== CREATE PROJECT ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error); // Debug: full error details
    console.error("=== ERROR END ===");
    res.status(500).json({ message: "Could not create project", error: error.message });
  }
};

// GET /api/projects/mine  (private) — projects belonging to logged-in user
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Get My Projects Error:", error);
    res.status(500).json({ message: "Could not fetch projects", error: error.message });
  }
};

// GET /api/projects/public/:userSlug  (public) — a whole portfolio page
export const getPublicPortfolio = async (req, res) => {
  try {
    const user = await User.findOne({ slug: req.params.userSlug }).select("-password -email");
    if (!user) return res.status(404).json({ message: "Portfolio not found" });

    const projects = await Project.find({ owner: user._id }).sort({ createdAt: -1 });
    res.json({ user, projects });
  } catch (error) {
    console.error("Get Public Portfolio Error:", error);
    res.status(500).json({ message: "Could not fetch portfolio", error: error.message });
  }
};

// GET /api/projects/share/:projectSlug  (public) — a single shareable project page
export const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.projectSlug });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const owner = await User.findById(project.owner).select("-password -email");
    res.json({ project, owner });
  } catch (error) {
    console.error("Get Project By Slug Error:", error);
    res.status(500).json({ message: "Could not fetch project", error: error.message });
  }
};

// PUT /api/projects/:id  (private)
export const updateProject = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Update Project Error:", error);
    res.status(500).json({ message: "Could not update project", error: error.message });
  }
};

// DELETE /api/projects/:id  (private)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You don't own this project" });
    }
    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Delete Project Error:", error);
    res.status(500).json({ message: "Could not delete project", error: error.message });
  }
};