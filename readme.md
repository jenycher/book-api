# Book API 📚

RESTful API для управления коллекцией книг с возможностью загрузки обложек и файлов книг. 
Простой и удобный сервис для хранения информации о книгах с возможностью 
создания, чтения, обновления и удаления записей, а также скачивания файлов книг.

**✨ Новое:** 
- **Аутентификация пользователей** с Passport.js (регистрация/вход)
- **MongoDB** для постоянного хранения данных книг и пользователей
- **Mongoose ODM** для работы с базой данных
- **Счётчик просмотров** с отдельным микросервисом
- Полная контейнеризация через Docker Compose

## Содержание
- [Технологии](#технологии)
- [Быстрый старт](#быстрый-старт)
- [Установка и запуск](#установка-и-запуск)
  - [Локальный запуск](#локальный-запуск)
  - [Запуск через Docker](#запуск-через-docker)
- [Аутентификация](#аутентификация)
- [Веб-интерфейс](#веб-интерфейс)
- [Счётчик просмотров](#счётчик-просмотров)
- [Структура данных](#структура-данных)
- [Эндпоинты API](#эндпоинты-api)
- [Примеры запросов](#примеры-запросов)
- [Работа с файлами](#работа-с-файлами)
- [База данных](#база-данных)
- [Структура проекта](#структура-проекта)
- [Docker](#docker)
- [Лицензия](#лицензия)

## Технологии

- **Node.js** - среда выполнения JavaScript
- **Express.js** - веб-фреймворк для Node.js
- **MongoDB** - база данных для хранения книг и пользователей
- **Mongoose** - ODM для работы с MongoDB
- **Passport.js** - аутентификация пользователей
- **Express Session** - управление сессиями
- **EJS** - шаблонизатор для создания веб-интерфейса
- **Multer** - middleware для обработки multipart/form-data (загрузка файлов)
- **UUID** - генерация уникальных идентификаторов
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
npm install express-ejs-layouts
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

### Проверка статуса

```bash
curl http://localhost:3000/api/user/check
```

### Выход

```bash
curl http://localhost:3000/api/user/logout
```

## Веб-интерфейс

Приложение предоставляет удобный веб-интерфейс для управления книгами:

### Основные страницы

| URL | Описание | Доступ |
|-----|----------|--------|
| `/` | Главная страница | Все пользователи |
| `/books` | Список всех книг | Все пользователи |
| `/books/create` | Форма добавления книги | Только авторизованные |
| `/books/:id` | Просмотр книги | Все пользователи |
| `/books/:id/edit` | Редактирование книги | Только авторизованные |
| `/api/user/login` | Вход/регистрация | Все пользователи |
| `/api/user/me` | Профиль пользователя | Только авторизованные |

### Возможности веб-интерфейса

- **Аутентификация** - регистрация и вход в систему
- **Управление книгами** - создание, чтение, обновление, удаление
- **Защищенные действия** - создание и редактирование доступны только авторизованным
- **Просмотр списка книг** - таблица с нумерацией, названием, автором и действиями
- **Просмотр книги** - детальная информация с обложкой, описанием, счётчиком просмотров
- **Скачивание файлов** - скачивание файлов книг доступно всем пользователям

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
  favorite: "string",     // Отметка "избранное"
  fileCover: "string",    // Имя файла обложки
  fileName: "string",     // Оригинальное имя файла книги
  fileBook: "string",     // Имя сохранённого файла книги
  createdAt: "date",      // Дата создания
  updatedAt: "date"       // Дата обновления
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

## Примеры запросов

### 1. Регистрация пользователя

```bash
curl -X POST http://localhost:3000/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"user","password":"123456","confirmPassword":"123456"}'
```

### 2. Вход в систему

```bash
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'
```

### 3. Получение всех книг

```bash
curl http://localhost:3000/api/books
```

### 4. Создание новой книги (требуется авторизация)

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Новая книга","authors":"Автор","description":"Описание"}'
```

### 5. Получение книги по ID

```bash
curl http://localhost:3000/api/books/550e8400-e29b-41d4-a716-446655440000
```

### 6. Обновление книги

```bash
curl -X PUT http://localhost:3000/api/books/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"title":"Обновленное название"}'
```

### 7. Удаление книги

```bash
curl -X DELETE http://localhost:3000/api/books/550e8400-e29b-41d4-a716-446655440000
```

## Работа с файлами

### Поддерживаемые форматы файлов

- **Обложки книг (`fileCover`)**: JPEG, JPG, PNG, GIF, WEBP
- **Файлы книг (`fileBook`)**: PDF, DOC, DOCX, TXT, FB2, EPUB

### Ограничения

- Максимальный размер файла: **50 MB** (для книг)
- Файлы сохраняются с уникальными именами в формате: `{timestamp}-{uuid}.{extension}`
- Обложки сохраняются в папку: `/public/img/`
- Файлы книг сохраняются в папку: `/public/books/`

## База данных

### MongoDB

Проект использует MongoDB для хранения данных о книгах и пользователях через Mongoose ODM.

**Структура базы данных:**
- **Database:** `library_db`
- **Collections:** `books`, `users`

**Подключение:**
- Локально: `mongodb://localhost:27017/library_db`
- Docker: `mongodb://admin:secretpassword@mongo:27017/library_db?authSource=admin`

### MongoDB Admin (mongo-express)

При запуске через Docker Compose доступен веб-интерфейс для управления MongoDB:
- **URL:** http://localhost:8081
- **Логин:** `mongoexpressuser`
- **Пароль:** `mongoexpresspass`

## Структура проекта

```
book-api/
│
├── config/
│   ├── db.js               # Подключение к MongoDB
│   └── passport.js         # Настройка Passport.js
│
├── models/
│   ├── Book.js             # Mongoose схема книги
│   └── User.js             # Mongoose схема пользователя
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
│       ├── view.ejs
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
| `book-api` | 3000 | Основное приложение |
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
