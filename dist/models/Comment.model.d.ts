import mongoose, { Document } from 'mongoose';
import { IComment } from '../interfaces/IComment';
export interface ICommentDocument extends Document, IComment {
}
export declare const CommentModel: mongoose.Model<ICommentDocument, {}, {}, {}, mongoose.Document<unknown, {}, ICommentDocument, {}, mongoose.DefaultSchemaOptions> & ICommentDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, ICommentDocument>;
//# sourceMappingURL=Comment.model.d.ts.map