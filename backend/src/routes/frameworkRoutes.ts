import express from "express";
import asyncHandler from "express-async-handler";
import FrameworkController from "../controllers/frameworkController";
import { checkJwt, checkPermissions } from "../middleware/auth";

const router = express.Router();

router.get("/", asyncHandler(FrameworkController.getFrameworks)); // Public
router.get("/:slug", asyncHandler(FrameworkController.getFrameworkBySlug)); // Public

router.post("/", checkJwt, checkPermissions(), asyncHandler(FrameworkController.createFramework));
router.put("/:slug", checkJwt, checkPermissions(), asyncHandler(FrameworkController.updateFramework));
router.delete("/:slug", checkJwt, checkPermissions(), asyncHandler(FrameworkController.deleteFramework));

export default router;