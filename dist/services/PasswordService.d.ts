export declare class PasswordService {
    static hash(password: string): Promise<string>;
    static compare(candidatePassword: string, hashedPassword: string): Promise<boolean>;
}
//# sourceMappingURL=PasswordService.d.ts.map