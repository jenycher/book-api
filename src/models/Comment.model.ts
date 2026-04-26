import mongoose, { Schema, Document } from 'mongoose';
import { IComment } from '../interfaces/IComment';

export interface ICommentDocument extends Document, IComment {}

const CommentSchema = new Schema<ICommentDocument>({
    id: { type: String, required: true, unique: true },
    bookId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    userAvatar: { type: String, default: '?' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const CommentModel = mongoose.model<ICommentDocument>('Comment', CommentSchema);