import express from "express";
import asyncHandler from "express-async-handler";
import AboutController from "../controllers/aboutController";
import { checkJwt, checkPermissions } from "../middleware/auth";

const router = express.Router();

router.get("/", asyncHandler(AboutController.getAllAbouts)); // Public
router.get("/:slug", asyncHandler(AboutController.getAboutBySlug)); // Public

router.post("/", checkJwt, checkPermissions(), asyncHandler(AboutController.createAbout));
router.put("/:slug", checkJwt, checkPermissions(), asyncHandler(AboutController.updateAbout));
router.delete("/:slug", checkJwt, checkPermissions(), asyncHandler(AboutController.deleteAbout));

export default router;