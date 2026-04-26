# Book API 📚

RESTful API для управления коллекцией книг с возможностью загрузки обложек и файлов книг. 
Простой и удобный сервис для хранения информации о книгах с возможностью 
создания, чтения, обновления и удаления записей, а также скачивания файлов книг.

**✨ Новое:** 
- **TypeScript** - полная миграция проекта на TypeScript
- **IoC/DI контейнер** - InversifyJS для управления зависимостями
- **Комментарии в реальном времени** с Socket.IO (WebSocket)
- **Аутентификация пользователей** с Passport.js
- **MongoDB** для постоянного хранения данных

## Содержание
- [Book API 📚](#book-api-)
  - [Содержание](#содержание)
  - [Технологии](#технологии)
    - [Основной стек](#основной-стек)
    - [Аутентификация и безопасность](#аутентификация-и-безопасность)
    - [Внедрение зависимостей](#внедрение-зависимостей)
    - [Шаблонизация и загрузка файлов](#шаблонизация-и-загрузка-файлов)
    - [Контейнеризация](#контейнеризация)
  - [Быстрый старт](#быстрый-старт)
  - [Установка и запуск](#установка-и-запуск)
    - [Предварительные требования](#предварительные-требования)
    - [Локальный запуск](#локальный-запуск)
    - [Запуск через Docker](#запуск-через-docker)
      - [Запуск всех сервисов](#запуск-всех-сервисов)
      - [Запуск в фоновом режиме](#запуск-в-фоновом-режиме)
      - [Остановка сервисов](#остановка-сервисов)
      - [Остановка с удалением томов](#остановка-с-удалением-томов)
      - [Просмотр логов](#просмотр-логов)
  - [Аутентификация](#аутентификация)
    - [Маршруты аутентификации](#маршруты-аутентификации)
    - [Примеры запросов](#примеры-запросов)
  - [API Эндпоинты](#api-эндпоинты)
    - [Книги](#книги)
    - [Примеры запросов](#примеры-запросов-1)
  - [TypeScript архитектура](#typescript-архитектура)
    - [Структура слоев](#структура-слоев)
    - [IoC/DI Контейнер (InversifyJS)](#iocdi-контейнер-inversifyjs)
    - [Интерфейсы](#интерфейсы)
    - [Репозитории](#репозитории)
    - [Настройки TypeScript](#настройки-typescript)
    - [Скрипты для работы с TypeScript](#скрипты-для-работы-с-typescript)
  - [Структура проекта](#структура-проекта)
  - [Docker](#docker)
    - [Сервисы](#сервисы)
    - [Переменные окружения](#переменные-окружения)
  - [Лицензия](#лицензия)

## Технологии

### Основной стек
- **Node.js** - среда выполнения JavaScript
- **TypeScript** - типизированный JavaScript
- **Express.js** - веб-фреймворк для Node.js
- **MongoDB** - база данных для хранения книг, пользователей и комментариев
- **Mongoose** - ODM для работы с MongoDB
- **Socket.IO** - WebSocket библиотека для realtime комментариев

### Аутентификация и безопасность
- **Passport.js** - аутентификация пользователей
- **Express Session** - управление сессиями
- **bcryptjs** - хеширование паролей

### Внедрение зависимостей
- **InversifyJS** - IoC/DI контейнер
- **reflect-metadata** - декораторы для DI

### Шаблонизация и загрузка файлов
- **EJS** - шаблонизатор для создания веб-интерфейса
- **Multer** - middleware для обработки multipart/form-data

### Контейнеризация
- **Docker** - контейнеризация приложения
- **Docker Compose** - оркестрация микросервисов

## Быстрый старт

Самый простой способ запустить проект:

```bash
# Клонируйте репозиторий
git clone https://github.com/jenycher/book-api.git
cd book-api

# Запустите через Docker Compose
docker-compose up --build
```

После запуска откройте в браузере:
- **Веб-интерфейс:** http://localhost:3000
- **API:** http://localhost:3000/api/books
- **MongoDB Admin:** http://localhost:8081

## Установка и запуск

### Предварительные требования
- Установленный Node.js (версия 20 или выше)
- Установленный npm (менеджер пакетов Node.js)
- **Для Docker:** Установленный Docker Desktop
- **Для локального запуска:** Установленная MongoDB

### Локальный запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/jenycher/book-api.git
cd book-api
```

2. Установите зависимости:
```bash
npm install
cd counter-api && npm install && cd ..
```

3. Создайте файл `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/library_db
COUNTER_SERVICE_URL=http://localhost:3001
SESSION_SECRET=your-super-secret-key
```

4. Убедитесь, что MongoDB запущена локально:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

5. Запустите сервер:
```bash
# Development режим (с автоматической перезагрузкой)
npm run dev

# Production режим
npm run build
npm start
```

Сервер запустится на `http://localhost:3000`

### Запуск через Docker

#### Запуск всех сервисов
```bash
docker-compose up --build
```

#### Запуск в фоновом режиме
```bash
docker-compose up -d --build
```

#### Остановка сервисов
```bash
docker-compose down
```

#### Остановка с удалением томов
```bash
docker-compose down -v
```

#### Просмотр логов
```bash
docker-compose logs -f
```

## Аутентификация

### Маршруты аутентификации

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/user/login` | Страница входа/регистрации |
| GET | `/api/user/me` | Профиль пользователя |
| POST | `/api/user/login` | Вход в систему |
| POST | `/api/user/signup` | Регистрация |
| GET | `/api/user/logout` | Выход |
| GET | `/api/user/check` | Проверка статуса |

### Примеры запросов

```bash
# Регистрация
curl -X POST http://localhost:3000/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"user","password":"123456","confirmPassword":"123456"}'

# Вход
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'
```

## API Эндпоинты

### Книги

| Метод | URL | Описание | Доступ |
|-------|-----|----------|--------|
| GET | `/api/books` | Получить все книги | Все |
| GET | `/api/books/:id` | Получить книгу по ID (+1 просмотр) | Все |
| GET | `/api/books/favorites` | Получить избранные книги | Все |
| GET | `/api/books/count` | Получить количество книг | Все |
| GET | `/api/books/search/title?q=` | Поиск по названию | Все |
| GET | `/api/books/search/author?q=` | Поиск по автору | Все |
| POST | `/api/books` | Создать книгу | Только авторизованные |
| PUT | `/api/books/:id` | Обновить книгу | Только авторизованные |
| DELETE | `/api/books/:id` | Удалить книгу | Только авторизованные |
| GET | `/api/books/:id/download` | Скачать файл | Все |

### Примеры запросов

```bash
# Получить все книги
curl http://localhost:3000/api/books

# Создать книгу
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Война и мир","authors":"Лев Толстой"}'

# Поиск по названию
curl "http://localhost:3000/api/books/search/title?q=война"

# Поиск по автору
curl "http://localhost:3000/api/books/search/author?q=Толстой"

# Получить избранные
curl http://localhost:3000/api/books/favorites

# Получить количество
curl http://localhost:3000/api/books/count
```

## TypeScript архитектура

### Структура слоев

```
┌─────────────────────────────────────────────────────────────┐
│                   Express Routes                            │
├─────────────────────────────────────────────────────────────┤
│                   Controllers                               │
├─────────────────────────────────────────────────────────────┤
│                   Service Layer                             │
├─────────────────────────────────────────────────────────────┤
│                   Repository Layer                          │
├─────────────────────────────────────────────────────────────┤
│                   MongoDB Models                            │
└─────────────────────────────────────────────────────────────┘
```

### IoC/DI Контейнер (InversifyJS)

```typescript
// src/container.ts
import { Container } from 'inversify';
import { BooksRepository } from './repositories/BooksRepository';
import { BooksController } from './controllers/BooksController';

const container = new Container();
container.bind(BooksRepository).toSelf();
container.bind(BooksController).toSelf();

export { container };
```

### Интерфейсы

```typescript
// Интерфейс книги
interface IBook {
    id: string;
    title: string;
    description: string | null;
    authors: string | null;
    favorite: boolean;
    fileCover: string | null;
    fileName: string | null;
    fileBook: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

// Типы для создания и обновления
type ICreateBook = Omit<IBook, 'id' | 'createdAt' | 'updatedAt'>;
type IUpdateBook = Partial<ICreateBook>;
```

### Репозитории

```typescript
@injectable()
export class BooksRepository {
    async createBook(book: ICreateBook): Promise<IBook> { ... }
    async getBook(id: string): Promise<IBook | null> { ... }
    async getBooks(): Promise<IBook[]> { ... }
    async updateBook(id: string, book: IUpdateBook): Promise<IBook | null> { ... }
    async deleteBook(id: string): Promise<boolean> { ... }
    async findBooksByTitle(title: string): Promise<IBook[]> { ... }
    async findBooksByAuthor(author: string): Promise<IBook[]> { ... }
    async getFavoriteBooks(): Promise<IBook[]> { ... }
    async countBooks(): Promise<number> { ... }
}
```

### Настройки TypeScript

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### Скрипты для работы с TypeScript

```bash
# Сборка проекта
npm run build

# Development режим
npm run dev

# Проверка типов
npm run type-check

# Очистка собранных файлов
npm run clean
```

## Структура проекта

```
book-api/
│
├── src/                      # TypeScript исходники
│   ├── config/               # Конфигурация
│   │   ├── database.ts       # Подключение к MongoDB
│   │   └── passport.ts       # Настройка Passport
│   ├── controllers/          # Контроллеры
│   │   └── BooksController.ts
│   ├── interfaces/           # TypeScript интерфейсы
│   │   ├── IBook.ts
│   │   ├── IUser.ts
│   │   └── IComment.ts
│   ├── models/               # Mongoose модели
│   │   ├── Book.model.ts
│   │   ├── User.model.ts
│   │   └── Comment.model.ts
│   ├── repositories/         # Репозитории (DI)
│   │   ├── BooksRepository.ts
│   │   ├── UserRepository.ts
│   │   └── CommentRepository.ts
│   ├── routes/               # Express маршруты
│   │   └── books.routes.ts
│   ├── services/             # Бизнес-логика
│   │   └── PasswordService.ts
│   ├── container.ts          # IoC контейнер
│   └── app.ts                # Точка входа
│
├── views/                    # EJS шаблоны
│   ├── layout.ejs
│   ├── auth/
│   └── books/
│
├── counter-api/              # Микросервис счётчика
│
├── dist/                     # Скомпилированный JS
├── tsconfig.json             # Конфигурация TypeScript
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## Docker

### Сервисы

| Сервис | Порт | Описание |
|--------|------|----------|
| `mongo` | 27017 | База данных MongoDB |
| `mongo-express` | 8081 | Веб-админка MongoDB |
| `book-api` | 3000 | Основное приложение |
| `counter-api` | 3001 | Микросервис счётчика |

### Переменные окружения

| Переменная | Описание |
|------------|----------|
| `PORT` | Порт сервера |
| `MONGODB_URI` | Подключение к MongoDB |
| `COUNTER_SERVICE_URL` | URL микросервиса счётчика |
| `SESSION_SECRET` | Секрет для сессий |

## Лицензия

ISC
