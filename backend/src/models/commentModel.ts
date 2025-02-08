import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IComment extends Document {
  commentId: string;
  commentStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  userStatus: 'GUEST' | 'VERIFIED';
  firstName: string;
  lastName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  auth0UserId?: string;
  auth0Avatar?: string;
}

const CommentSchema: Schema = new Schema(
  {
    commentId: { type: String, default: uuidv4, unique: true },
    commentStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    userStatus: { type: String, enum: ['GUEST', 'VERIFIED'], required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    content: { type: String, required: true },
    auth0UserId: { type: String, default: '' },
    auth0Avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>('Comment', CommentSchema);