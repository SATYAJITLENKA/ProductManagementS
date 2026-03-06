import express from "express";
import { createProject, getProjects, getProject } from "../controllers/projectController.js";
import { authMiddleware } from "../middleware/auth.js";


const router = express.Router();

router.get("/", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProject);
router.post("/", authMiddleware, createProject);

export default router;