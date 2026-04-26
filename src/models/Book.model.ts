import mongoose, { Schema, Document } from 'mongoose';
import { IBook } from '../interfaces/IBook';

export interface IBookDocument extends Document, IBook {}

const BookSchema = new Schema<IBookDocument>({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: null },
    authors: { type: String, default: null },
    favorite: { type: Boolean, default: false },
    fileCover: { type: String, default: null },
    fileName: { type: String, default: null },
    fileBook: { type: String, default: null }
}, {
    timestamps: true
});

export const BookModel = mongoose.model<IBookDocument>('Book', BookSchema);