/**
 * Интерфейс для сущности "Комментарий"
 */
export interface IComment {
    /** Уникальный идентификатор комментария */
    id: string;
    
    /** ID книги, к которой относится комментарий */
    bookId: string;
    
    /** ID пользователя, оставившего комментарий */
    userId: string;
    
    /** Имя пользователя (денормализовано для быстрого отображения) */
    username: string;
    
    /** Аватар пользователя (первая буква имени) */
    userAvatar: string;
    
    /** Текст комментария */
    text: string;
    
    /** Дата создания */
    createdAt: Date;
}

/**
 * Тип для создания нового комментария
 */
export type ICreateComment = Omit<IComment, 'id' | 'createdAt'>;