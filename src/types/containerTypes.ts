// Типы для IoC контейнера
export const TYPES = {
    BooksRepository: Symbol.for('BooksRepository'),
    UserRepository: Symbol.for('UserRepository'),
    CommentRepository: Symbol.for('CommentRepository'),
    CounterService: Symbol.for('CounterService'),
    BookService: Symbol.for('BookService'),
    AuthService: Symbol.for('AuthService')
};