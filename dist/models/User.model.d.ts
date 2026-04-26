import mongoose, { Document } from 'mongoose';
import { IUser } from '../interfaces/IUser';
export interface IUserDocument extends Document, IUser {
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const UserModel: mongoose.Model<IUserDocument, {}, {}, {}, mongoose.Document<unknown, {}, IUserDocument, {}, mongoose.DefaultSchemaOptions> & IUserDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IUserDocument>;
//# sourceMappingURL=User.model.d.ts.map