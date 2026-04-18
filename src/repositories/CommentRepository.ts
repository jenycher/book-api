import { IComment, ICreateComment } from '../interfaces/IComment';

/**
 * Абстрактный класс для репозитория комментариев
 * 
 * @abstract
 * @class CommentRepository
 */
export abstract class CommentRepository {
    /**
     * Создание нового комментария
     * @param {ICreateComment} comment - данные комментария
     * @returns {Promise<IComment>} созданный комментарий
     */
    abstract createComment(comment: ICreateComment): Promise<IComment>;

    /**
     * Получение комментариев по ID книги
     * @param {string} bookId - ID книги
     * @returns {Promise<IComment[]>} массив комментариев
     */
    abstract getCommentsByBookId(bookId: string): Promise<IComment[]>;

    /**
     * Получение комментариев по ID пользователя
     * @param {string} userId - ID пользователя
     * @returns {Promise<IComment[]>} массив комментариев
     */
    abstract getCommentsByUserId(userId: string): Promise<IComment[]>;

    /**
     * Удаление комментария
     * @param {string} id - ID комментария
     * @returns {Promise<boolean>} true - успешно удалено
     */
    abstract deleteComment(id: string): Promise<boolean>;

    /**
     * Удаление всех комментариев книги
     * @param {string} bookId - ID книги
     * @returns {Promise<number>} количество удалённых комментариев
     */
    abstract deleteCommentsByBookId(bookId: string): Promise<number>;
}