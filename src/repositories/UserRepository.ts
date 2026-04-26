import { injectable } from 'inversify';
import { v4 as uuid } from 'uuid';
import { UserModel } from '../models/User.model';
import { PasswordService } from '../services/PasswordService';
import { IUser, ICreateUser } from '../interfaces/IUser';

@injectable()
export class UserRepository {
    async createUser(user: ICreateUser): Promise<IUser> {
        const hashedPassword = await PasswordService.hash(user.password);
        
        const newUser = new UserModel({
            id: uuid(),
            ...user,
            password: hashedPassword,
            createdAt: new Date(),
            lastLogin: null
        });
        
        await newUser.save();
        return newUser.toObject();
    }
    
    async getUserById(id: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ id });
        return user ? user.toObject() : null;
    }
    
    async getUserByEmail(email: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ email: email.toLowerCase() });
        return user ? user.toObject() : null;
    }
    
    async getUserByUsername(username: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ username });
        return user ? user.toObject() : null;
    }
    
    async updateLastLogin(id: string): Promise<IUser | null> {
        const user = await UserModel.findOneAndUpdate(
            { id },
            { lastLogin: new Date() },
            { new: true }
        );
        return user ? user.toObject() : null;
    }
    
    async comparePassword(user: IUser, candidatePassword: string): Promise<boolean> {
        return PasswordService.compare(candidatePassword, user.password);
    }
}