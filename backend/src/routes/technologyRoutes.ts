import express from "express";
import asyncHandler from "express-async-handler";
import TechnologyController from "../controllers/technologyController";
import { checkJwt, checkPermissions } from "../middleware/auth";

const router = express.Router();

router.get("/", asyncHandler(TechnologyController.getTechnologies)); // Public
router.get("/:slug", asyncHandler(TechnologyController.getTechnologyBySlug)); // Public

router.post("/", checkJwt, checkPermissions(), asyncHandler(TechnologyController.createTechnology));
router.put("/:slug", checkJwt, checkPermissions(), asyncHandler(TechnologyController.updateTechnology));
router.delete("/:slug", checkJwt, checkPermissions(), asyncHandler(TechnologyController.deleteTechnology));

export default router;