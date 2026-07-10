import express from "express";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {
  createProject,
  getMyProjects,
  getPublicPortfolio,
  getProjectBySlug,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

// Public routes (no login needed — anyone in the world can view these)
router.get("/public/:userSlug", getPublicPortfolio);
router.get("/share/:projectSlug", getProjectBySlug);

// Private routes (require login)
router.post("/", protect, upload.single("image"), createProject);
router.get("/mine", protect, getMyProjects);
router.put("/:id", protect, upload.single("image"), updateProject);
router.delete("/:id", protect, deleteProject);

export default router;
