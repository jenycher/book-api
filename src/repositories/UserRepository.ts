import { IUser, ICreateUser, IUpdateUser } from '../interfaces/IUser';

/**
 * Абстрактный класс для репозитория пользователей
 * Определяет контракт для работы с хранилищем пользователей
 * 
 * @abstract
 * @class UserRepository
 */
export abstract class UserRepository {
    /**
     * Создание нового пользователя
     * @param {ICreateUser} user - данные для создания пользователя
     * @returns {Promise<IUser>} созданный пользователь
     */
    abstract createUser(user: ICreateUser): Promise<IUser>;

    /**
     * Получение пользователя по ID
     * @param {string} id - уникальный идентификатор пользователя
     * @returns {Promise<IUser | null>} пользователь или null
     */
    abstract getUserById(id: string): Promise<IUser | null>;

    /**
     * Получение пользователя по email
     * @param {string} email - email пользователя
     * @returns {Promise<IUser | null>} пользователь или null
     */
    abstract getUserByEmail(email: string): Promise<IUser | null>;

    /**
     * Получение пользователя по имени
     * @param {string} username - имя пользователя
     * @returns {Promise<IUser | null>} пользователь или null
     */
    abstract getUserByUsername(username: string): Promise<IUser | null>;

    /**
     * Получение всех пользователей
     * @returns {Promise<IUser[]>} массив всех пользователей
     */
    abstract getUsers(): Promise<IUser[]>;

    /**
     * Обновление пользователя
     * @param {string} id - уникальный идентификатор пользователя
     * @param {IUpdateUser} updatedUser - данные для обновления
     * @returns {Promise<IUser | null>} обновлённый пользователь
     */
    abstract updateUser(id: string, updatedUser: IUpdateUser): Promise<IUser | null>;

    /**
     * Удаление пользователя
     * @param {string} id - уникальный идентификатор пользователя
     * @returns {Promise<boolean>} true - успешно удалено
     */
    abstract deleteUser(id: string): Promise<boolean>;

    /**
     * Обновление времени последнего входа
     * @param {string} id - ID пользователя
     * @returns {Promise<IUser | null>} обновлённый пользователь
     */
    abstract updateLastLogin(id: string): Promise<IUser | null>;
}