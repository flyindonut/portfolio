import { Request, Response, NextFunction } from 'express';
import CommentService from '../services/commentService';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import pino from 'pino';

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true
    }
  }
});

const jwksClient = jwksRsa({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  jwksClient.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(err, signingKey);
  });
}

export default class CommentController {
  static async createGuestComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to create guest comment');
    try {
      const commentData = { ...req.body, userStatus: 'GUEST' };
      const comment = await CommentService.createComment(commentData);
      logger.info(`Created Guest Comment: ${comment._id}`);
      res.status(201).json(comment);
    } catch (error) {
      logger.error({ error }, 'Error creating guest comment');
      next(error);
    }
  }

  static async createVerifiedComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to create verified comment');
    try {
      const commentData = { ...req.body, userStatus: 'VERIFIED' };
      const comment = await CommentService.createComment(commentData);
      logger.info(`Created Verified Comment: ${comment._id}`);
      res.status(201).json(comment);
    } catch (error) {
      logger.error({ error }, 'Error creating verified comment');
      next(error);
    }
  }

  static async getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to get all comments');
    try {
      const comments = await CommentService.getComments();
      logger.info(`Retrieved Comments: ${comments.map(comment => comment._id).join(', ')}`);
      res.status(200).json(comments);
    } catch (error) {
      logger.error({ error }, 'Error retrieving comments');
      next(error);
    }
  }

  static async getVerifiedComments(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to get verified comments');
    try {
      const comments = await CommentService.getVerifiedComments();
      logger.info(`Retrieved Verified Comments: ${comments.map(comment => comment._id).join(', ')}`);
      res.status(200).json(comments);
    } catch (error) {
      logger.error({ error }, 'Error retrieving verified comments');
      next(error);
    }
  }

  static async getGuestComments(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to get guest comments');
    try {
      const comments = await CommentService.getGuestComments();
      logger.info(`Retrieved Guest Comments: ${comments.map(comment => comment._id).join(', ')}`);
      res.status(200).json(comments);
    } catch (error) {
      logger.error({ error }, 'Error retrieving guest comments');
      next(error);
    }
  }

  static async updateCommentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to update comment status');
    try {
      const { commentId } = req.params;
      const { status } = req.body;
      const updatedComment = await CommentService.updateCommentStatus(commentId, status);
      if (updatedComment) {
        logger.info(`Updated Comment Status: ${updatedComment._id}`);
        res.status(200).json(updatedComment);
      } else {
        logger.warn('Comment not found for updating status');
        res.status(404).json({ message: 'Comment not found' });
      }
    } catch (error) {
      logger.error({ error }, 'Error updating comment status');
      next(error);
    }
  }

  static async updateCommentContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to update comment content');
    const { commentId } = req.params;
    const { content } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      logger.warn('Unauthorized: No token provided');
      res.status(401).json({ message: 'Unauthorized' });
      return next();
    }

    try {
      jwt.verify(token, getKey, { algorithms: ['RS256'] }, async (err, decodedToken) => {
        if (err) {
          logger.warn('Unauthorized: Invalid token');
          res.status(401).json({ message: 'Unauthorized' });
          return next();
        }

        const auth0UserId = (decodedToken as { sub: string }).sub;

        logger.info(`Attempting to update comment with ID: ${commentId} by user: ${auth0UserId}`);

        const updatedComment = await CommentService.updateCommentContent(commentId, content, auth0UserId);
        if (updatedComment) {
          logger.info(`Updated Comment: ${updatedComment._id}`);
          res.status(200).json(updatedComment);
        } else {
          logger.warn(`Failed to update comment with ID: ${commentId}. Comment not found or user not authorized.`);
          res.status(404).json({ message: 'Comment not found or you are not authorized to update this comment' });
        }
      });
    } catch (error) {
      logger.error({ commentId, error }, `Error updating comment with ID: ${commentId}`);
      next(error);
    }
  }

  static async deleteComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to delete comment');
    const { commentId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      logger.warn('Unauthorized: No token provided');
      res.status(401).json({ message: 'Unauthorized' });
      return next();
    }

    try {
      jwt.verify(token, getKey, { algorithms: ['RS256'] }, async (err, decodedToken) => {
        if (err) {
          logger.warn('Unauthorized: Invalid token');
          res.status(401).json({ message: 'Unauthorized' });
          return next();
        }

        const auth0UserId = (decodedToken as { sub: string, roles: string[] }).sub;
        const roles = (decodedToken as any)["your_name_space/roles"] || [];

        logger.info(`Attempting to delete comment with ID: ${commentId} by user: ${auth0UserId}, roles: ${roles}`);

        const isAdmin = roles.includes('Admin');
        const deletedComment = await CommentService.deleteComment(commentId, auth0UserId, isAdmin);
        if (deletedComment) {
          logger.info(`Deleted Comment: ${deletedComment._id}`);
          res.status(200).json({ message: 'Comment deleted successfully' });
        } else {
          logger.warn(`Failed to delete comment with ID: ${commentId}. User not authorized.`);
          res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }
      });
    } catch (error) {
      logger.error({ commentId, error }, `Error deleting comment with ID: ${commentId}`);
      next(error);
    }
  }
}