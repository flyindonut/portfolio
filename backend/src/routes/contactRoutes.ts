import express from "express";
import asyncHandler from "express-async-handler";
import ContactController from "../controllers/contactController";

const router = express.Router();

router.post("/", asyncHandler(ContactController.submitContactForm));

export default router;
