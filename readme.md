# Book API 📚

RESTful API для управления коллекцией книг с возможностью загрузки обложек и файлов книг. 
Простой и удобный сервис для хранения информации о книгах с возможностью 
создания, чтения, обновления и удаления записей, а также скачивания файлов книг.

**✨ Новое:** 
- **TypeScript подготовка** - интерфейсы и абстрактные классы для будущей миграции

## Содержание
- [Технологии](#технологии)
- [Быстрый старт](#быстрый-старт)
- [Установка и запуск](#установка-и-запуск)
  - [Локальный запуск](#локальный-запуск)
  - [Запуск через Docker](#запуск-через-docker)
- [Аутентификация](#аутентификация)
- [Веб-интерфейс](#веб-интерфейс)
- [Комментарии в реальном времени](#комментарии-в-реальном-времени)
- [Счётчик просмотров](#счётчик-просмотров)
- [Структура данных](#структура-данных)
- [Эндпоинты API](#эндпоинты-api)
- [Примеры запросов](#примеры-запросов)
- [Работа с файлами](#работа-с-файлами)
- [База данных](#база-данных)
- [TypeScript подготовка](#typescript-подготовка)
- [Структура проекта](#структура-проекта)
- [Docker](#docker)
- [Лицензия](#лицензия)

## Технологии

- **Node.js** - среда выполнения JavaScript
- **Express.js** - веб-фреймворк для Node.js
- **MongoDB** - база данных для хранения книг, пользователей и комментариев
- **Mongoose** - ODM для работы с MongoDB
- **Socket.IO** - WebSocket библиотека для realtime комментариев
- **Passport.js** - аутентификация пользователей
- **Express Session** - управление сессиями
- **EJS** - шаблонизатор для создания веб-интерфейса
- **Multer** - middleware для обработки multipart/form-data (загрузка файлов)
- **UUID** - генерация уникальных идентификаторов
- **TypeScript** - типизация и подготовка к миграции
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
- **MongoDB Admin:** http://localhost:8081 (логин: mongoexpressuser, пароль: mongoexpresspass)

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

3. Убедитесь, что MongoDB запущена локально:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

4. Запустите сервер:
```bash
npm start
# или в режиме разработки
npm run dev
```

Сервер запустится на `http://localhost:3000`

### Запуск через Docker

#### Запуск всех сервисов (MongoDB + основное приложение + счётчик)
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

#### Остановка с удалением томов (очистка данных)
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
| GET | `/api/user/me` | Профиль пользователя (требуется вход) |
| POST | `/api/user/login` | Вход в систему |
| POST | `/api/user/signup` | Регистрация нового пользователя |
| GET | `/api/user/logout` | Выход из системы |
| GET | `/api/user/check` | Проверка статуса аутентификации |

### Регистрация пользователя

```bash
curl -X POST http://localhost:3000/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"user","password":"123456","confirmPassword":"123456"}'
```

### Вход в систему

```bash
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'
```

## Веб-интерфейс

Приложение предоставляет удобный веб-интерфейс для управления книгами:

### Основные страницы

| URL | Описание | Доступ |
|-----|----------|--------|
| `/` | Главная страница | Все пользователи |
| `/books` | Список всех книг | Все пользователи |
| `/books/create` | Форма добавления книги | Только авторизованные |
| `/books/:id` | Просмотр книги + **комментарии в реальном времени** | Все пользователи |
| `/books/:id/edit` | Редактирование книги | Только авторизованные |
| `/api/user/login` | Вход/регистрация | Все пользователи |
| `/api/user/me` | Профиль пользователя | Только авторизованные |

### Возможности веб-интерфейса

- **Аутентификация** - регистрация и вход в систему
- **Управление книгами** - создание, чтение, обновление, удаление
- **Защищенные действия** - создание и редактирование доступны только авторизованным
- **Комментарии в реальном времени** - обсуждение книг с автоматическим обновлением
- **Просмотр списка книг** - таблица с нумерацией, названием, автором и действиями
- **Просмотр книги** - детальная информация с обложкой, описанием, счётчиком просмотров
- **Скачивание файлов** - скачивание файлов книг доступно всем пользователям

## Комментарии в реальном времени

### Как это работает

Приложение использует **WebSocket (Socket.IO)** для обеспечения обмена комментариями в реальном времени:

```
┌─────────────────────────────────────────────────────────────┐
│                     Браузер пользователя                    │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │ Пользователь│    │ Пользователь│    │ Пользователь│      │
│  │     1       │    │     2       │    │     3       │      │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘      │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │ WebSocket
                             ▼
                    ┌─────────────────┐
                    │  Socket.IO      │
                    │  Сервер         │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  MongoDB        │
                    │  (комментарии)  │
                    └─────────────────┘
```

### Особенности

- **Мгновенное обновление** - комментарии появляются у всех пользователей без перезагрузки страницы
- **Персистентность** - все комментарии сохраняются в MongoDB
- **Приватность** - только авторизованные пользователи могут оставлять комментарии
- **Комнаты** - комментарии привязаны к конкретной книге

### WebSocket события

| Событие | Направление | Описание |
|---------|-------------|----------|
| `join-book-room` | Клиент → Сервер | Подписка на комментарии книги |
| `leave-book-room` | Клиент → Сервер | Отписка от комментариев |
| `load-comments` | Сервер → Клиент | Загрузка существующих комментариев |
| `new-comment` | Клиент → Сервер | Отправка нового комментария |
| `comment-added` | Сервер → Клиент | Новый комментарий (broadcast) |

## Счётчик просмотров

### Как это работает

Приложение использует **микросервисную архитектуру** для подсчёта просмотров книг:

```
┌─────────────────┐     ┌─────────────────┐
│  Book API       │     │  Counter API    │
│  (порт 3000)    │────▶│  (порт 3001)    │
│                 │     │                 │
│  GET /books/:id │     │  POST /counter/ │
│                 │     │    :bookId/incr │
└─────────────────┘     │  GET /counter/  │
                        │    :bookId      │
                        └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │  data/          │
                        │  (файлы .json)  │
                        └─────────────────┘
```

### Микросервис счётчика (Counter API)

Отдельное приложение, которое отвечает за хранение и изменение счётчиков просмотров.

| Метод | URL | Описание |
|:---|:---|:---|
| `GET` | `/counter/:bookId` | Получить текущее значение счётчика |
| `POST` | `/counter/:bookId/incr` | Увеличить счётчик на 1 |

## Структура данных

### Пользователь (MongoDB коллекция `users`)
```javascript
{
  id: "string",           // Уникальный идентификатор
  email: "string",        // Email пользователя (уникальный)
  username: "string",     // Имя пользователя (уникальное)
  password: "string",     // Хешированный пароль
  createdAt: "date",      // Дата регистрации
  lastLogin: "date"       // Дата последнего входа
}
```

### Книга (MongoDB коллекция `books`)
```javascript
{
  id: "string",           // Уникальный идентификатор
  title: "string",        // Название книги
  description: "string",  // Описание книги
  authors: "string",      // Автор(ы) книги
  favorite: "boolean",    // Отметка "избранное"
  fileCover: "string",    // Имя файла обложки
  fileName: "string",     // Оригинальное имя файла книги
  fileBook: "string",     // Имя сохранённого файла книги
  createdAt: "date",      // Дата создания
  updatedAt: "date"       // Дата обновления
}
```

### Комментарий (MongoDB коллекция `comments`)
```javascript
{
  id: "string",           // Уникальный идентификатор
  bookId: "string",       // ID книги (индексирован)
  userId: "string",       // ID пользователя
  username: "string",     // Имя пользователя
  userAvatar: "string",   // Аватар (первая буква имени)
  text: "string",         // Текст комментария
  createdAt: "date"       // Дата создания
}
```

### Счётчик
```javascript
{
  bookId: "string",       // ID книги
  count: number           // Количество просмотров
}
```

## Эндпоинты API

### Аутентификация

| Метод | URL | Действие | Ответ |
|-------|-----|----------|--------|
| POST | `/api/user/signup` | Регистрация | 201 и данные пользователя |
| POST | `/api/user/login` | Вход | 200 и данные пользователя |
| GET | `/api/user/logout` | Выход | 200 |
| GET | `/api/user/check` | Проверка статуса | 200 с `authenticated` |
| GET | `/api/user/me` | Профиль | HTML страница |

### Основное приложение (Book API)

| Метод | URL | Действие | Доступ |
|-------|-----|----------|--------|
| GET | `/api/books` | Получить все книги | Все |
| GET | `/api/books/:id` | Получить книгу по ID (+1 просмотр) | Все |
| POST | `/api/books` | Создать книгу | Только авторизованные |
| PUT | `/api/books/:id` | Обновить книгу | Только авторизованные |
| DELETE | `/api/books/:id` | Удалить книгу | Только авторизованные |
| GET | `/api/books/:id/download` | Скачать файл | Все |

## TypeScript подготовка

В рамках подготовки к миграции проекта на TypeScript созданы интерфейсы и абстрактные классы.

### Интерфейсы

#### IBook - интерфейс книги
```typescript
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
```

#### IUser - интерфейс пользователя
```typescript
interface IUser {
    id: string;
    email: string;
    username: string;
    password: string;
    createdAt: Date;
    lastLogin: Date | null;
}
```

#### IComment - интерфейс комментария
```typescript
interface IComment {
    id: string;
    bookId: string;
    userId: string;
    username: string;
    userAvatar: string;
    text: string;
    createdAt: Date;
}
```

### Абстрактные классы

#### BooksRepository
Абстрактный класс, определяющий контракт для работы с хранилищем книг:

```typescript
abstract class BooksRepository {
    abstract createBook(book: ICreateBook): Promise<IBook>;
    abstract getBook(id: string): Promise<IBook | null>;
    abstract getBooks(): Promise<IBook[]>;
    abstract updateBook(id: string, updatedBook: IUpdateBook): Promise<IBook | null>;
    abstract deleteBook(id: string): Promise<boolean>;
    abstract findBooksByTitle(title: string): Promise<IBook[]>;
    abstract findBooksByAuthor(author: string): Promise<IBook[]>;
    abstract getFavoriteBooks(): Promise<IBook[]>;
    abstract countBooks(): Promise<number>;
}
```

### Настройки TypeScript

В файле `tsconfig.json` настроены следующие опции:

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": false,
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### Структура TypeScript файлов

```
src/
├── interfaces/
│   ├── IBook.ts          # Интерфейс книги и типы
│   ├── IUser.ts          # Интерфейс пользователя
│   └── IComment.ts       # Интерфейс комментария
├── repositories/
│   ├── BooksRepository.ts    # Абстрактный класс книг
│   ├── UserRepository.ts     # Абстрактный класс пользователей
│   └── CommentRepository.ts  # Абстрактный класс комментариев
└── index.ts              # Точка входа для экспорта
```

### Команды для работы с TypeScript

```bash
# Сборка TypeScript
npm run build

# Сборка в режиме наблюдения
npm run build:watch

# Проверка типов без сборки
npm run type-check

# Очистка собранных файлов
npm run clean
```

## Структура проекта

```
book-api/
│
├── src/                      # TypeScript исходники
│   ├── interfaces/           # Интерфейсы сущностей
│   ├── repositories/         # Абстрактные репозитории
│   └── index.ts              # Точка входа TS
│
├── config/
│   ├── db.js               # Подключение к MongoDB
│   └── passport.js         # Настройка Passport.js
│
├── models/
│   ├── Book.js             # Mongoose схема книги
│   ├── User.js             # Mongoose схема пользователя
│   └── Comment.js          # Mongoose схема комментария
│
├── views/                  # Шаблоны EJS
│   ├── layout.ejs          # Основной layout
│   ├── index.ejs
│   ├── error.ejs
│   ├── auth/
│   │   ├── login.ejs       # Страница входа
│   │   └── profile.ejs     # Профиль пользователя
│   └── books/
│       ├── index.ejs
│       ├── view.ejs        # Просмотр книги + комментарии
│       ├── comments.ejs    # Компонент комментариев
│       ├── create.ejs
│       └── edit.ejs
│
├── routes/
│   ├── auth.js             # Маршруты аутентификации
│   ├── books.js            # API роуты для книг
│   └── web.js              # Веб-роуты
│
├── middleware/
│   └── upload.js
│
├── public/
│   ├── img/
│   └── books/
│
├── counter-api/            # МИКРОСЕРВИС СЧЁТЧИКА
│   ├── src/
│   │   └── server.js
│   ├── data/
│   ├── Dockerfile
│   └── package.json
│
├── dist/                   # Скомпилированные JS файлы
├── tsconfig.json           # Конфигурация TypeScript
├── index.js
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Docker

### Сервисы в Docker Compose

| Сервис | Порт | Описание |
|--------|------|----------|
| `mongo` | 27017 | База данных MongoDB |
| `mongo-express` | 8081 | Веб-админка MongoDB |
| `book-api` | 3000 | Основное приложение (HTTP + WebSocket) |
| `counter-api` | 3001 | Микросервис счётчика |

### Переменные окружения

| Переменная | Значение по умолчанию | Описание |
|------------|----------------------|----------|
| PORT | 3000 | Порт для запуска основного сервера |
| COUNTER_SERVICE_URL | http://counter-api:3001 | URL микросервиса счётчика |
| MONGODB_URI | mongodb://admin:secretpassword@mongo:27017/library_db?authSource=admin | Подключение к MongoDB |
| SESSION_SECRET | your-secret-key | Секретный ключ для сессий |

### Docker volumes

- `mongo_data` - данные MongoDB
- `./public/uploads:/app/public/uploads` - загруженные файлы
- `./counter-api/data:/app/data` - данные счётчика

## Лицензия

ISC
