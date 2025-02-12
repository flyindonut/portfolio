import CommentModel, { IComment } from '../models/commentModel';
import logger from '../config/logger';

class CommentService {
  async createComment(data: Partial<IComment>): Promise<IComment> {
    logger.info('Creating Comment in DB');
    const comment = new CommentModel(data);
    const savedComment = await comment.save();
    logger.info(`Created Comment: ${savedComment.commentId}`);
    return savedComment;
  }

  async getComments(): Promise<IComment[]> {
    logger.info('Getting Comments from DB');
    const comments = await CommentModel.find();
    logger.info(`Retrieved Comments: ${comments.map(comment => comment.commentId).join(', ')}`);
    return comments;
  }

  async getVerifiedComments(): Promise<IComment[]> {
    logger.info('Getting Verified Comments from DB');
    const comments = await CommentModel.find({ userStatus: 'VERIFIED' });
    logger.info(`Retrieved Verified Comments: ${comments.map(comment => comment.commentId).join(', ')}`);
    return comments;
  }

  async getGuestComments(): Promise<IComment[]> {
    logger.info('Getting Guest Comments from DB');
    const comments = await CommentModel.find({ userStatus: 'GUEST' });
    logger.info(`Retrieved Guest Comments: ${comments.map(comment => comment.commentId).join(', ')}`);
    return comments;
  }

  async updateCommentStatus(commentId: string, status: string): Promise<IComment | null> {
    logger.info(`Updating Comment Status in DB: ${commentId}`);
    const updatedComment = await CommentModel.findOneAndUpdate({ commentId }, { commentStatus: status }, { new: true });
    if (!updatedComment) {
      logger.warn('Comment not found for updating', { commentId });
    } else {
      logger.info(`Updated Comment: ${updatedComment.commentId}`);
    }
    return updatedComment;
  }

  async updateCommentContent(commentId: string, content: string, auth0UserId: string): Promise<IComment | null> {
    logger.info(`Updating Comment Content in DB: ${commentId}`);
    const comment = await CommentModel.findOne({ commentId });
    if (comment && comment.auth0UserId === auth0UserId) {
      const updatedComment = await CommentModel.findOneAndUpdate({ commentId }, { content }, { new: true });
      if (!updatedComment) {
        logger.warn('Comment not found for updating', { commentId });
      } else {
        logger.info(`Updated Comment: ${updatedComment.commentId}`);
      }
      return updatedComment;
    }
    return null;
  }

  async deleteComment(commentId: string, auth0UserId: string, isAdmin: boolean): Promise<IComment | null> {
    logger.info(`Deleting Comment from DB: ${commentId}`);
    const comment = await CommentModel.findOne({ commentId });
    if (comment && (comment.auth0UserId === auth0UserId || isAdmin)) {
      const deletedComment = await CommentModel.findOneAndDelete({ commentId });
      if (!deletedComment) {
        logger.warn('Comment not found for deletion', { commentId });
      } else {
        logger.info(`Deleted Comment: ${deletedComment.commentId}`);
      }
      return deletedComment;
    }
    return null;
  }
}

export default new CommentService();