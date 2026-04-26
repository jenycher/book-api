/**
 * Интерфейс для сущности "Пользователь"
 */
export interface IUser {
    /** Уникальный идентификатор пользователя */
    id: string;
    /** Email пользователя */
    email: string;
    /** Имя пользователя */
    username: string;
    /** Хешированный пароль */
    password: string;
    /** Дата регистрации */
    createdAt: Date;
    /** Дата последнего входа */
    lastLogin: Date | null;
}
/**
 * Тип для создания нового пользователя (без id и дат)
 */
export type ICreateUser = Omit<IUser, 'id' | 'createdAt' | 'lastLogin'>;
/**
 * Тип для обновления пользователя
 */
export type IUpdateUser = Partial<Omit<IUser, 'id' | 'createdAt'>>;
//# sourceMappingURL=IUser.d.ts.map