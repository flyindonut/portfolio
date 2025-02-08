import express from "express";
import asyncHandler from "express-async-handler";
import ServiceController from "../controllers/serviceController";
import { checkJwt, checkPermissions } from "../middleware/auth";

const router = express.Router();

router.get("/", asyncHandler(ServiceController.getAllServices)); // Public
router.get("/:slug", asyncHandler(ServiceController.getServiceBySlug)); // Public

router.post("/", checkJwt, checkPermissions(), asyncHandler(ServiceController.createService));
router.put("/:slug", checkJwt, checkPermissions(), asyncHandler(ServiceController.updateService));
router.delete("/:slug", checkJwt, checkPermissions(), asyncHandler(ServiceController.deleteService));

export default router;