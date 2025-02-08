import express from "express";
import asyncHandler from "express-async-handler";
import CommentController from "../controllers/commentController";
import { checkJwt, checkPermissions } from "../middleware/auth";

const router = express.Router();

router.get("/", asyncHandler(CommentController.getComments)); // Public
router.get("/verified", asyncHandler(CommentController.getVerifiedComments)); // Public
router.get("/guest", asyncHandler(CommentController.getGuestComments)); // Public
router.post("/guest", asyncHandler(CommentController.createGuestComment)); // Public

router.post("/verified", checkJwt, asyncHandler(CommentController.createVerifiedComment));
router.patch("/:commentId/status", checkJwt, checkPermissions(), asyncHandler(CommentController.updateCommentStatus));
router.patch("/:commentId/content", checkJwt, asyncHandler(CommentController.updateCommentContent));
router.delete("/:commentId", checkJwt, asyncHandler(CommentController.deleteComment));

export default router;