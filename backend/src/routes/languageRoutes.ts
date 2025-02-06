import express from "express";
import asyncHandler from "express-async-handler";
import LanguageController from "../controllers/languageController";
import { checkJwt, checkPermissions } from "../middleware/auth";

const router = express.Router();

router.get("/", asyncHandler(LanguageController.getLanguages)); // Public
router.get("/:slug", asyncHandler(LanguageController.getLanguageBySlug)); // Public

router.post("/", checkJwt, checkPermissions(), asyncHandler(LanguageController.createLanguage));
router.put("/:slug", checkJwt, checkPermissions(), asyncHandler(LanguageController.updateLanguage));
router.delete("/:slug", checkJwt, checkPermissions(), asyncHandler(LanguageController.deleteLanguage));

export default router;