import 'reflect-metadata';
import { Container } from 'inversify';
import { BooksRepository } from './repositories/BooksRepository';
import { BooksController } from './controllers/BooksController';

const container = new Container();

// Регистрация репозиториев
container.bind(BooksRepository).toSelf();

// Регистрация контроллеров
container.bind(BooksController).toSelf();

export { container };