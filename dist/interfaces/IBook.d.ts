/**
 * Интерфейс для сущности "Книга"
 * Представляет структуру данных книги в библиотеке
 */
export interface IBook {
    /** Уникальный идентификатор книги (UUID) */
    id: string;
    /** Название книги */
    title: string;
    /** Описание книги */
    description: string | null;
    /** Автор(ы) книги */
    authors: string | null;
    /** Отметка "избранное" */
    favorite: boolean;
    /** Имя файла обложки */
    fileCover: string | null;
    /** Оригинальное имя файла книги */
    fileName: string | null;
    /** Имя сохранённого файла книги */
    fileBook: string | null;
    /** Дата создания (опционально, будет добавлена MongoDB) */
    createdAt?: Date;
    /** Дата обновления (опционально, будет добавлена MongoDB) */
    updatedAt?: Date;
}
/**
 * Тип для создания новой книги (без id, который генерируется автоматически)
 */
export type ICreateBook = Omit<IBook, 'id' | 'createdAt' | 'updatedAt'>;
/**
 * Тип для обновления книги (все поля опциональны)
 */
export type IUpdateBook = Partial<Omit<IBook, 'id' | 'createdAt' | 'updatedAt'>>;
//# sourceMappingURL=IBook.d.ts.map