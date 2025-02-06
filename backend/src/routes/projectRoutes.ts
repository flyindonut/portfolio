import express from "express";
import asyncHandler from "express-async-handler";
import ProjectController from "../controllers/projectController";
import { checkJwt, checkPermissions } from "../middleware/auth";

const router = express.Router();

router.get("/", asyncHandler(ProjectController.getProjects)); // Public
router.get("/:slug", asyncHandler(ProjectController.getProjectBySlug)); // Public

router.post("/", checkJwt, checkPermissions(), asyncHandler(ProjectController.createProject));
router.put("/:slug", checkJwt, checkPermissions(), asyncHandler(ProjectController.updateProject));
router.delete("/:slug", checkJwt, checkPermissions(), asyncHandler(ProjectController.deleteProject));

export default router;
