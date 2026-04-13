# Book API 📚

RESTful API для управления коллекцией книг с возможностью загрузки обложек и файлов книг. 
Простой и удобный сервис для хранения информации о книгах с возможностью 
создания, чтения, обновления и удаления записей, а также скачивания файлов книг.

**✨ Новое:** 
- **MongoDB** для постоянного хранения данных книг
- **Mongoose ODM** для работы с базой данных
- Полная контейнеризация через Docker Compose

## Содержание
- [Технологии](#технологии)
- [Быстрый старт](#быстрый-старт)
- [Установка и запуск](#установка-и-запуск)
  - [Локальный запуск](#локальный-запуск)
  - [Запуск через Docker](#запуск-через-docker)
- [Веб-интерфейс](#веб-интерфейс)
- [Счётчик просмотров](#счётчик-просмотров)
- [Структура данных](#структура-данных)
- [Эндпоинты API](#эндпоинты-api)
- [Примеры запросов](#примеры-запросов)
- [Работа с файлами](#работа-с-файлами)
- [База данных](#база-данных)
- [Тестирование в Postman](#тестирование-в-postman)
- [Структура проекта](#структура-проекта)
- [Docker](#docker)
- [Лицензия](#лицензия)

## Технологии

- **Node.js** - среда выполнения JavaScript
- **Express.js** - веб-фреймворк для Node.js
- **MongoDB** - база данных для хранения книг
- **Mongoose** - ODM для работы с MongoDB
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

#### Просмотр логов конкретного сервиса
```bash
docker-compose logs -f book-api
docker-compose logs -f counter-api
docker-compose logs -f mongo
```

## Веб-интерфейс

Приложение предоставляет удобный веб-интерфейс для управления книгами:

### Основные страницы

| URL | Описание |
|-----|----------|
| `/` | Главная страница с информацией о приложении |
| `/books` | Список всех книг с возможностью просмотра, редактирования и удаления |
| `/books/create` | Форма для добавления новой книги с загрузкой файлов |
| `/books/:id` | Страница просмотра подробной информации о книге **(+1 просмотр)** |
| `/books/:id/edit` | Форма для редактирования книги |

### Возможности веб-интерфейса

- **Просмотр списка книг** - таблица с нумерацией, названием, автором и действиями
- **Добавление книги** - форма с предпросмотром загружаемых файлов и drag-and-drop
- **Просмотр книги** - детальная информация с обложкой, описанием, **счётчиком просмотров** и метаданными файла
- **Редактирование** - изменение информации и замена файлов
- **Удаление** - удаление книги с подтверждением
- **Скачивание** - скачивание файла книги с корректным отображением русских имён
- **Копирование ID** - возможность скопировать ID книги в буфер обмена

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

**Примеры запросов:**

```bash
# Получить счётчик
curl http://localhost:3001/counter/9df5c501-429c-4549-8cf4-3a2fb0a1a6ef

# Увеличить счётчик
curl -X POST http://localhost:3001/counter/9df5c501-429c-4549-8cf4-3a2fb0a1a6ef/incr
```

### Хранение данных

Счётчики хранятся в файловой системе в папке `counter-api/data/`:
```
counter-api/data/
├── 9df5c501-429c-4549-8cf4-3a2fb0a1a6ef.json  → {"count": 42}
├── другой-id.json                               → {"count": 7}
└── ...
```

**Преимущества:**
- Данные переживают рестарт контейнера
- Данные переживают удаление контейнера (благодаря Docker volumes)
- Простота резервного копирования

### Прокси-маршруты (доступны через основной сервер)

Для удобства, основные маршруты счётчика также доступны через основной сервер:

| Метод | URL | Описание |
|:---|:---|:---|
| `GET` | `/counter/:bookId` | Получить значение счётчика |
| `POST` | `/counter/:bookId/incr` | Увеличить счётчик |

## Структура данных

### Книга (MongoDB коллекция `books`)
```javascript
{
  id: "string",           // Уникальный идентификатор (генерируется автоматически)
  title: "string",        // Название книги (обязательное поле)
  description: "string",  // Описание книги
  authors: "string",      // Автор(ы) книги
  favorite: "string",     // Отметка "избранное"
  fileCover: "string",    // Имя файла обложки
  fileName: "string",     // Оригинальное имя файла книги
  fileBook: "string",     // Имя сохранённого файла книги
  createdAt: "date",      // Дата создания (автоматически)
  updatedAt: "date"       // Дата обновления (автоматически)
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

### Основное приложение (Book API)

| Метод | URL | Действие | Ответ |
|--------|-----|----------|--------|
| POST | `/api/user/login` | Авторизация пользователя | `201` и объект пользователя |
| GET | `/api/books` | Получить все книги | Массив всех книг из MongoDB |
| GET | `/api/books/:id` | Получить книгу по ID **(+1 просмотр)** | Объект книги с полем `views` или `404` |
| POST | `/api/books` | Создать книгу с файлами | Созданная книга с ID |
| PUT | `/api/books/:id` | Обновить книгу с файлами | Обновлённая книга или `404` |
| DELETE | `/api/books/:id` | Удалить книгу | `'ok'` или `404` |
| GET | `/api/books/:id/download` | Скачать файл книги | Файл для скачивания |

### Микросервис счётчика (Counter API)

| Метод | URL | Действие | Ответ |
|--------|-----|----------|--------|
| GET | `/counter/:bookId` | Получить значение счётчика | `{"bookId": "...", "count": number}` |
| POST | `/counter/:bookId/incr` | Увеличить счётчик | `{"bookId": "...", "count": number}` |

### Прокси-маршруты (через основной сервер)

| Метод | URL | Действие | Ответ |
|--------|-----|----------|--------|
| GET | `/counter/:bookId` | Получить значение счётчика | `{"bookId": "...", "count": number}` |
| POST | `/counter/:bookId/incr` | Увеличить счётчик | `{"bookId": "...", "count": number}` |

## Примеры запросов

### 1. Получение всех книг
**GET** `/api/books`

**Ответ** (статус 200):
```json
[
    {
        "_id": "67f9a123456789abcdef0123",
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Война и мир",
        "description": "Классический роман Льва Толстого",
        "authors": "Лев Толстой",
        "favorite": "true",
        "fileCover": "cover.jpg",
        "fileName": "война_и_мир.pdf",
        "fileBook": "book.pdf",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
    }
]
```

### 2. Получение книги по ID (увеличивает счётчик)
**GET** `/api/books/550e8400-e29b-41d4-a716-446655440000`

**Ответ** (статус 200):
```json
{
    "_id": "67f9a123456789abcdef0123",
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Война и мир",
    "description": "Классический роман Льва Толстого",
    "authors": "Лев Толстой",
    "favorite": "true",
    "fileCover": "cover.jpg",
    "fileName": "война_и_мир.pdf",
    "fileBook": "book.pdf",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "views": 43
}
```

### 3. Создание новой книги
**POST** `/api/books`

**Тип запроса**: `multipart/form-data`

| Поле | Тип | Значение |
|------|-----|----------|
| title | Text | Война и мир |
| description | Text | Классический роман Льва Толстого |
| authors | Text | Лев Толстой |
| favorite | Text | true |
| fileCover | File | обложка.jpg |
| fileBook | File | война_и_мир.pdf |

### 4. Работа со счётчиком

```bash
# Получить значение счётчика
curl http://localhost:3001/counter/550e8400-e29b-41d4-a716-446655440000

# Увеличить счётчик
curl -X POST http://localhost:3001/counter/550e8400-e29b-41d4-a716-446655440000/incr

# Через прокси основного сервера
curl http://localhost:3000/counter/550e8400-e29b-41d4-a716-446655440000
curl -X POST http://localhost:3000/counter/550e8400-e29b-41d4-a716-446655440000/incr
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

Проект использует MongoDB для хранения данных о книгах через Mongoose ODM.

**Структура базы данных:**
- **Database:** `library_db`
- **Collection:** `books`

**Подключение:**
- Локально: `mongodb://localhost:27017/library_db`
- Docker: `mongodb://admin:secretpassword@mongo:27017/library_db?authSource=admin`

### Mongoose Схема

```javascript
const bookSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    authors: { type: String, default: '' },
    favorite: { type: String, default: '' },
    fileCover: { type: String, default: '' },
    fileName: { type: String, default: '' },
    fileBook: { type: String, default: '' }
}, { timestamps: true });
```

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
│   └── db.js               # Подключение к MongoDB
│
├── models/
│   └── Book.js             # Mongoose схема книги
│
├── views/                  # Шаблоны EJS
│   ├── layout.ejs
│   ├── index.ejs
│   ├── error.ejs
│   └── books/
│       ├── index.ejs
│       ├── view.ejs
│       ├── create.ejs
│       └── edit.ejs
│
├── routes/
│   ├── auth.js
│   ├── books.js            # API роуты для книг (MongoDB)
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

### Образы

```bash
# Основной образ приложения
docker pull jenycher/book-api:v1.0.0

# Микросервис счётчика
docker pull jenycher/counter-api:v2.0.0
```

### Сборка образов

```bash
# Сборка основного приложения
docker build -t jenycher/book-api:v1.0.0 .

# Сборка микросервиса счётчика
cd counter-api && docker build -t jenycher/counter-api:v2.0.0 . && cd ..
```

### Переменные окружения

| Переменная | Значение по умолчанию | Описание |
|------------|----------------------|----------|
| PORT | 3000 | Порт для запуска основного сервера |
| COUNTER_SERVICE_URL | http://counter-api:3001 | URL микросервиса счётчика |
| MONGODB_URI | mongodb://admin:secretpassword@mongo:27017/library_db?authSource=admin | Подключение к MongoDB |

### Docker volumes

- `mongo_data` - данные MongoDB
- `./public/uploads:/app/public/uploads` - загруженные файлы
- `./counter-api/data:/app/data` - данные счётчика

## Лицензия

ISC

