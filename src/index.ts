// Импорт reflect-metadata должен быть самым первым
import 'reflect-metadata';

// Экспорт интерфейсов
export * from './interfaces/IBook';
export * from './interfaces/IUser';
export * from './interfaces/IComment';

// Экспорт абстрактных классов
export * from './repositories/BooksRepository';
export * from './repositories/UserRepository';
export * from './repositories/CommentRepository';

// Экспорт реализаций
export * from './repositories/MongoBooksRepository';

// Экспорт сервисов
export * from './services/BookService';

// Экспорт контейнера
export { container, TYPES } from './container';