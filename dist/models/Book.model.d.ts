import mongoose, { Document } from 'mongoose';
import { IBook } from '../interfaces/IBook';
export interface IBookDocument extends Document, IBook {
}
export declare const BookModel: mongoose.Model<IBookDocument, {}, {}, {}, mongoose.Document<unknown, {}, IBookDocument, {}, mongoose.DefaultSchemaOptions> & IBookDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IBookDocument>;
//# sourceMappingURL=Book.model.d.ts.map