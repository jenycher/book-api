import { IBook, ICreateBook, IUpdateBook } from '../interfaces/IBook';

/**
 * Абстрактный класс для репозитория книг
 * Определяет контракт для работы с хранилищем книг
 * 
 * @abstract
 * @class BooksRepository
 */
export abstract class BooksRepository {
    /**
     * Создание новой книги
     * @param {ICreateBook} book - данные для создания книги (без id)
     * @returns {Promise<IBook>} созданная книга с присвоенным id
     */
    abstract createBook(book: ICreateBook): Promise<IBook>;

    /**
     * Получение книги по ID
     * @param {string} id - уникальный идентификатор книги
     * @returns {Promise<IBook | null>} книга или null, если не найдена
     */
    abstract getBook(id: string): Promise<IBook | null>;

    /**
     * Получение всех книг
     * @returns {Promise<IBook[]>} массив всех книг
     */
    abstract getBooks(): Promise<IBook[]>;

    /**
     * Обновление книги
     * @param {string} id - уникальный идентификатор книги
     * @param {IUpdateBook} updatedBook - данные для обновления
     * @returns {Promise<IBook | null>} обновлённая книга или null, если не найдена
     */
    abstract updateBook(id: string, updatedBook: IUpdateBook): Promise<IBook | null>;

    /**
     * Удаление книги
     * @param {string} id - уникальный идентификатор книги
     * @returns {Promise<boolean>} true - успешно удалено, false - книга не найдена
     */
    abstract deleteBook(id: string): Promise<boolean>;

    /**
     * Поиск книг по названию
     * @param {string} title - название книги (или его часть)
     * @returns {Promise<IBook[]>} массив найденных книг
     */
    abstract findBooksByTitle(title: string): Promise<IBook[]>;

    /**
     * Поиск книг по автору
     * @param {string} author - автор книги (или его часть)
     * @returns {Promise<IBook[]>} массив найденных книг
     */
    abstract findBooksByAuthor(author: string): Promise<IBook[]>;

    /**
     * Получение избранных книг
     * @returns {Promise<IBook[]>} массив избранных книг
     */
    abstract getFavoriteBooks(): Promise<IBook[]>;

    /**
     * Подсчёт общего количества книг
     * @returns {Promise<number>} количество книг
     */
    abstract countBooks(): Promise<number>;
}