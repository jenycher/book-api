import { IUser, ICreateUser } from '../interfaces/IUser';
export declare class UserRepository {
    createUser(user: ICreateUser): Promise<IUser>;
    getUserById(id: string): Promise<IUser | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserByUsername(username: string): Promise<IUser | null>;
    updateLastLogin(id: string): Promise<IUser | null>;
    comparePassword(user: IUser, candidatePassword: string): Promise<boolean>;
}
//# sourceMappingURL=UserRepository.d.ts.map