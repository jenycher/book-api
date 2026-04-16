const express = require('express');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const session = require('express-session');
const passport = require('./config/passport');
const expressLayouts = require('express-ejs-layouts'); 
const http = require('http');  
const socketIo = require('socket.io');  
const Comment = require('./models/Comment');

const app = express();
const server = http.createServer(app);  
const io = socketIo(server);  
const PORT = process.env.PORT || 3000;
const COUNTER_SERVICE_URL = process.env.COUNTER_SERVICE_URL || 'http://localhost:3001';

// ============== НАСТРОЙКА SESSION ДЛЯ SOCKET.IO ==============
const sessionMiddleware = session({
    secret: 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
    }
});

// Применяем session middleware к express
app.use(sessionMiddleware);

// Применяем session middleware к socket.io
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// ============== НАСТРОЙКА SOCKET.IO ==============
io.on('connection', (socket) => {
    console.log('🔌 Новое подключение:', socket.id);
    
    // Получаем пользователя из сессии
    const session = socket.request.session;
    const currentUser = session.passport?.user ? { id: session.passport.user } : null;
    
    // Присоединение к комнате книги и загрузка комментариев из БД
    socket.on('join-book-room', async (bookId) => {
        socket.join(`book-${bookId}`);
        console.log(`📚 Socket ${socket.id} присоединился к комнате book-${bookId}`);
        
        try {
            // Загружаем комментарии из MongoDB
            const comments = await Comment.find({ bookId: bookId })
                .sort({ createdAt: 1 })
                .limit(100);
            
            const formattedComments = comments.map(comment => ({
                id: comment.id,
                username: comment.username,
                userAvatar: comment.userAvatar,
                text: comment.text,
                createdAtFormatted: comment.createdAt.toLocaleString('ru-RU')
            }));
            
            socket.emit('load-comments', formattedComments);
        } catch (error) {
            console.error('Ошибка загрузки комментариев:', error);
            socket.emit('load-comments', []);
        }
    });
    
    // Покидание комнаты
    socket.on('leave-book-room', (bookId) => {
        socket.leave(`book-${bookId}`);
        console.log(`📚 Socket ${socket.id} покинул комнату book-${bookId}`);
    });
    
    // Новый комментарий
    socket.on('new-comment', async (data) => {
        const { bookId, comment, user } = data;
        
        try {
            // Сохраняем в БД
            const commentDoc = new Comment({
                id: Date.now().toString(),
                bookId: bookId,
                userId: user?.id || 'anonymous',
                username: user?.username || 'Гость',
                userAvatar: user?.username ? user.username.charAt(0).toUpperCase() : '?',
                text: comment,
                createdAt: new Date()
            });
            await commentDoc.save();
            
            const commentObj = {
                id: commentDoc.id,
                bookId: commentDoc.bookId,
                userId: commentDoc.userId,
                username: commentDoc.username,
                userAvatar: commentDoc.userAvatar,
                text: commentDoc.text,
                createdAt: commentDoc.createdAt,
                createdAtFormatted: commentDoc.createdAt.toLocaleString('ru-RU')
            };
            
            // Отправляем комментарий всем в комнате
            io.to(`book-${bookId}`).emit('comment-added', commentObj);
            console.log(`💬 Новый комментарий к книге ${bookId} от ${commentObj.username}`);
        } catch (error) {
            console.error('Ошибка сохранения комментария:', error);
        }
    });
    
    // Отключение
    socket.on('disconnect', () => {
        console.log('🔌 Отключение:', socket.id);
    });
});

// ============== ФУНКЦИЯ ДЛЯ ВЫЗОВА МИКРОСЕРВИСА СЧЁТЧИКА ==============
async function callCounter(bookId, method = 'GET') {
    const fetch = (await import('node-fetch')).default;
    const url = method === 'POST' 
        ? `${COUNTER_SERVICE_URL}/counter/${bookId}/incr`
        : `${COUNTER_SERVICE_URL}/counter/${bookId}`;
    
    const response = await fetch(url, { method });
    return response.json();
}

// ============== ПРЯМЫЕ МАРШРУТЫ К МИКРОСЕРВИСУ СЧЁТЧИКА ==============
app.get('/counter/:bookId', async (req, res) => {
    const { bookId } = req.params;
    try {
        const result = await callCounter(bookId, 'GET');
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/counter/:bookId/incr', async (req, res) => {
    const { bookId } = req.params;
    try {
        const result = await callCounter(bookId, 'POST');
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============== ПОДКЛЮЧЕНИЕ К MONGODB ==============
connectDB();

// ============== НАСТРОЙКА VIEWS И MIDDLEWARE ==============
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.isAuthenticated = req.isAuthenticated() || false;
    next();
});

const ensureApiAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Не авторизован. Пожалуйста, войдите в систему.' });
};

// ============== ПОДКЛЮЧЕНИЕ РОУТЕРОВ ==============
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const webRoutes = require('./routes/web');

// API маршруты
app.use('/api/user', authRoutes);
app.use('/api/books', bookRoutes({ 
    getCounter: (id) => callCounter(id), 
    incrementCounter: (id) => callCounter(id, 'POST') 
}));

// Веб-маршруты
app.use('/', webRoutes);

// ============== ОБРАБОТКА ОШИБОК ==============
app.use((err, req, res, next) => {
    console.error('❌ Ошибка:', err.message);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'Файл слишком большой. Максимальный размер 50MB.' });
        }
    }
    
    if (req.path.startsWith('/api/')) {
        return res.status(500).json({ message: err.message || 'Что-то пошло не так' });
    }
    
    res.status(500).render('error', { 
        title: 'Ошибка', 
        message: err.message || 'Что-то пошло не так' 
    });
});

// Обработка 404
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'API маршрут не найден' });
    }
    
    res.status(404).render('error', { 
        title: '404', 
        message: 'Страница не найдена' 
    });
});

// ============== ЗАПУСК СЕРВЕРА ==============
server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                    📚 БИБЛИОТЕКА ЗАПУЩЕНА 📚                     ║
╚══════════════════════════════════════════════════════════════════╝

📡 Порт: ${PORT}
🔄 Counter service: ${COUNTER_SERVICE_URL}
💬 WebSocket: активен

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 API МАРШРУТЫ:
  ┌─────────────────────────────────────────────────────────────┐
  │ GET    /api/books                - список всех книг         │
  │ GET    /api/books/:id            - просмотр книги (+1 view) │
  │ POST   /api/books                - создать книгу            │
  │ PUT    /api/books/:id            - обновить книгу           │
  │ DELETE /api/books/:id            - удалить книгу            │
  │ GET    /api/books/:id/download   - скачать файл книги       │
  └─────────────────────────────────────────────────────────────┘

🌐 ВЕБ-ИНТЕРФЕЙС:
  ┌─────────────────────────────────────────────────────────────┐
  │ GET    /                         - главная страница         │
  │ GET    /books                    - список книг              │
  │ GET    /books/create             - добавить книгу           │
  │ GET    /books/:id                - просмотр книги           │
  │ GET    /books/:id/edit           - редактировать книгу      │
  └─────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Примеры запросов:

  # Получить список книг
  curl http://localhost:${PORT}/api/books

  # Создать книгу
  curl -X POST http://localhost:${PORT}/api/books \\
    -H "Content-Type: application/json" \\
    -d "{\\"title\\":\\"Новая книга\\",\\"authors\\":\\"Автор\\"}"

  # Открыть в браузере
  http://localhost:${PORT}/books

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
});

// Обработка закрытия MongoDB
process.on('SIGINT', async () => {
    await mongoose.disconnect();
    console.log('\n🛑 MongoDB отключена');
    process.exit(0);
});