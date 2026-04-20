import 'reflect-metadata';
import { Container } from 'inversify';
import { BooksRepository } from './repositories/BooksRepository';
import { MongoBooksRepository } from './repositories/MongoBooksRepository';

// Создание контейнера
const container = new Container();

// Регистрация зависимостей
// ВАЖНО: регистрируем реализацию, а не абстрактный класс
container.bind(BooksRepository).to(MongoBooksRepository);

// Экспорт контейнера
export { container };