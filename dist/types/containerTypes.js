"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES = void 0;
// Типы для IoC контейнера
exports.TYPES = {
    BooksRepository: Symbol.for('BooksRepository'),
    UserRepository: Symbol.for('UserRepository'),
    CommentRepository: Symbol.for('CommentRepository'),
    CounterService: Symbol.for('CounterService'),
    BookService: Symbol.for('BookService'),
    AuthService: Symbol.for('AuthService')
};
//# sourceMappingURL=containerTypes.js.map