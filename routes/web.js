const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const Book = require('../models/Book');
const { v4: uuid } = require('uuid');

// ============== ВЫЗОВ МИКРОСЕРВИСА СЧЁТЧИКА ==============
const COUNTER_SERVICE_URL = process.env.COUNTER_SERVICE_URL || 'http://counter-api:3001';

async function callCounter(bookId, method = 'GET') {
    const fetch = (await import('node-fetch')).default;
    const url = method === 'POST' 
        ? `${COUNTER_SERVICE_URL}/counter/${bookId}/incr`
        : `${COUNTER_SERVICE_URL}/counter/${bookId}`;
    
    const response = await fetch(url, { method });
    return response.json();
}

// ============== ВЕБ-МАРШРУТЫ ==============

// Главная страница
router.get('/', (req, res) => {
    res.render('index', { 
        title: 'Главная',
        message: null
    });
});



// Список всех книг
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.render('books/index', { 
            title: 'Список книг',
            books: books,
            message: null
        });
    } catch (error) {
        console.error('Ошибка при получении списка книг:', error);
        res.render('error', { 
            title: 'Ошибка',
            message: 'Не удалось загрузить список книг'
        });
    }
});

// Middleware для проверки аутентификации в веб-маршрутах
const ensureWebAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/api/user/login?message=Пожалуйста, войдите в систему');
};

// Страница создания книги (только для авторизованных)
router.get('/books/create', ensureWebAuthenticated, (req, res) => {
    res.render('books/create', { 
        title: 'Добавить книгу',
        formData: null,
        message: null
    });
});

// Создание книги (POST)
router.post('/books', ensureWebAuthenticated, upload.fields([
    { name: 'fileCover', maxCount: 1 },
    { name: 'fileBook', maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, description, authors, favorite } = req.body;
        
        const newBook = new Book({
            id: uuid(),
            title: title || "",
            description: description || null,
            authors: authors || null,
            favorite: favorite === 'true' || favorite === true || false,
            fileCover: req.files?.fileCover?.[0]?.filename || null,
            fileName: req.files?.fileBook?.[0]?.originalname || null,
            fileBook: req.files?.fileBook?.[0]?.filename || null
        });
        
        await newBook.save();
        
        const books = await Book.find().sort({ createdAt: -1 });
        res.render('books/index', { 
            title: 'Список книг',
            books: books,
            message: { type: 'success', text: 'Книга успешно добавлена!' }
        });
    } catch (error) {
        console.error('Ошибка при создании книги:', error);
        res.render('error', { 
            title: 'Ошибка',
            message: 'Не удалось создать книгу: ' + error.message
        });
    }
});

// Страница просмотра книги (с вызовом счётчика)
router.get('/books/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const book = await Book.findOne({ id: id });
        
        if (book) {
            // Увеличиваем счётчик через микросервис
            let views = 0;
            try {
                await callCounter(id, 'POST');  // увеличиваем
                const counter = await callCounter(id);  // читаем
                views = counter.count;
            } catch (err) {
                console.error('Counter error:', err.message);
            }
            
            // Декодируем имя файла книги
            let decodedFileName = '';
            if (book.fileName) {
                try {
                    decodedFileName = decodeURIComponent(escape(book.fileName));
                } catch (e) {
                    try {
                        decodedFileName = decodeURIComponent(book.fileName);
                    } catch (e2) {
                        decodedFileName = book.fileName;
                    }
                }
            }
            
            // Декодируем имя файла обложки
            let decodedCoverName = '';
            if (book.fileCover) {
                try {
                    decodedCoverName = decodeURIComponent(escape(book.fileCover));
                } catch (e) {
                    try {
                        decodedCoverName = decodeURIComponent(book.fileCover);
                    } catch (e2) {
                        decodedCoverName = book.fileCover;
                    }
                }
            }
            
            // Получаем информацию о файле книги
            let fileInfo = {
                exists: false,
                size: '',
                date: '',
                extension: '',
                originalName: decodedFileName || book.fileName || ''
            };
            
            if (book.fileBook) {
                const bookPath = path.join(__dirname, '..', 'public', 'books', book.fileBook);
                if (fs.existsSync(bookPath)) {
                    const stats = fs.statSync(bookPath);
                    const bytes = stats.size;
                    
                    let fileSize = '';
                    if (bytes < 1024) fileSize = bytes + ' B';
                    else if (bytes < 1048576) fileSize = (bytes / 1024).toFixed(1) + ' KB';
                    else fileSize = (bytes / 1048576).toFixed(1) + ' MB';
                    
                    const date = new Date(stats.mtime);
                    const fileDate = date.toLocaleDateString('ru-RU') + ' в ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
                    
                    const fileName = decodedFileName || book.fileName || book.fileBook;
                    const ext = fileName.split('.').pop().toUpperCase();
                    const iconMap = {
                        'PDF': '📕 PDF',
                        'DOC': '📘 DOC',
                        'DOCX': '📘 DOCX',
                        'TXT': '📄 TXT',
                        'FB2': '📗 FB2',
                        'EPUB': '📙 EPUB'
                    };
                    const extension = iconMap[ext] || `📄 ${ext}`;
                    
                    fileInfo = {
                        exists: true,
                        size: fileSize,
                        date: fileDate,
                        extension: extension,
                        originalName: decodedFileName || book.fileName || book.fileBook
                    };
                }
            }
            
            // Определяем дату добавления
            let addedDate = 'Неизвестно';
            if (book.createdAt) {
                const date = new Date(book.createdAt);
                addedDate = date.toLocaleDateString('ru-RU') + ' в ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
            } else if (book.id && book.id.includes('-')) {
                const parts = book.id.split('-');
                if (parts[0] && !isNaN(parts[0]) && parts[0].length > 10) {
                    const timestamp = parseInt(parts[0]);
                    if (!isNaN(timestamp)) {
                        const date = new Date(timestamp);
                        addedDate = date.toLocaleDateString('ru-RU') + ' в ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
                    }
                }
            }
            
            const bookObj = book.toObject();
            
            res.render('books/view', { 
                title: book.title,
                book: {
                    ...bookObj,
                    views: views,
                    displayFileName: decodedFileName,
                    displayCoverName: decodedCoverName
                },
                fileInfo: fileInfo,
                addedDate: addedDate,
                message: null,
                user: req.user || null,
                isAuthenticated: req.isAuthenticated()
            });
        } else {
            res.render('error', { 
                title: 'Книга не найдена',
                message: 'Книга с указанным ID не найдена'
            });
        }
    } catch (error) {
        console.error('Ошибка при отображении книги:', error);
        res.render('error', { 
            title: 'Ошибка',
            message: 'Произошла ошибка при загрузке книги'
        });
    }
});

// Страница редактирования книги
router.get('/books/:id/edit', ensureWebAuthenticated, async (req, res) => {
    const { id } = req.params;
    
    try {
        const book = await Book.findOne({ id: id });
        
        if (book) {
            // Декодируем имена файлов
            let decodedFileName = '';
            if (book.fileName) {
                try {
                    decodedFileName = decodeURIComponent(escape(book.fileName));
                } catch (e) {
                    try {
                        decodedFileName = decodeURIComponent(book.fileName);
                    } catch (e2) {
                        decodedFileName = book.fileName;
                    }
                }
            }
            
            let decodedCoverName = '';
            if (book.fileCover) {
                try {
                    decodedCoverName = decodeURIComponent(escape(book.fileCover));
                } catch (e) {
                    try {
                        decodedCoverName = decodeURIComponent(book.fileCover);
                    } catch (e2) {
                        decodedCoverName = book.fileCover;
                    }
                }
            }
            
            // Получаем информацию о файле обложки
            let coverInfo = {
                exists: false,
                size: '',
                path: '',
                displayName: decodedCoverName
            };
            
            if (book.fileCover) {
                const coverPath = path.join(__dirname, '..', 'public', 'img', book.fileCover);
                if (fs.existsSync(coverPath)) {
                    const stats = fs.statSync(coverPath);
                    const bytes = stats.size;
                    
                    let fileSize = '';
                    if (bytes < 1024) fileSize = bytes + ' B';
                    else if (bytes < 1048576) fileSize = (bytes / 1024).toFixed(1) + ' KB';
                    else fileSize = (bytes / 1048576).toFixed(1) + ' MB';
                    
                    coverInfo = {
                        exists: true,
                        size: fileSize,
                        path: coverPath,
                        displayName: decodedCoverName
                    };
                }
            }
            
            // Получаем информацию о файле книги
            let bookFileInfo = {
                exists: false,
                size: '',
                date: '',
                extension: '',
                displayName: decodedFileName
            };
            
            if (book.fileBook) {
                const bookPath = path.join(__dirname, '..', 'public', 'books', book.fileBook);
                if (fs.existsSync(bookPath)) {
                    const stats = fs.statSync(bookPath);
                    const bytes = stats.size;
                    
                    let fileSize = '';
                    if (bytes < 1024) fileSize = bytes + ' B';
                    else if (bytes < 1048576) fileSize = (bytes / 1024).toFixed(1) + ' KB';
                    else fileSize = (bytes / 1048576).toFixed(1) + ' MB';
                    
                    const date = new Date(stats.mtime);
                    const fileDate = date.toLocaleDateString('ru-RU') + ' в ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
                    
                    const fileName = decodedFileName || book.fileName || book.fileBook;
                    const ext = fileName.split('.').pop().toUpperCase();
                    const iconMap = {
                        'PDF': '📕 PDF',
                        'DOC': '📘 DOC',
                        'DOCX': '📘 DOCX',
                        'TXT': '📄 TXT',
                        'FB2': '📗 FB2',
                        'EPUB': '📙 EPUB'
                    };
                    const extension = iconMap[ext] || `📄 ${ext}`;
                    
                    bookFileInfo = {
                        exists: true,
                        size: fileSize,
                        date: fileDate,
                        extension: extension,
                        displayName: decodedFileName
                    };
                }
            }
            
            res.render('books/edit', { 
                title: 'Редактировать: ' + book.title,
                book: {
                    ...book.toObject(),
                    displayFileName: decodedFileName,
                    displayCoverName: decodedCoverName
                },
                coverInfo: coverInfo,
                bookFileInfo: bookFileInfo,
                message: null
            });
        } else {
            res.render('error', { 
                title: 'Книга не найдена',
                message: 'Книга с указанным ID не найдена'
            });
        }
    } catch (error) {
        console.error('Ошибка при загрузке книги для редактирования:', error);
        res.render('error', { 
            title: 'Ошибка',
            message: 'Не удалось загрузить книгу для редактирования'
        });
    }
});

// Обновление книги (POST)
router.post('/books/:id/update', ensureWebAuthenticated, upload.fields([
    { name: 'fileCover', maxCount: 1 },
    { name: 'fileBook', maxCount: 1 }
]), async (req, res) => {
    const { id } = req.params;
    
    try {
        const book = await Book.findOne({ id: id });
        
        if (book) {
            const { title, description, authors, favorite } = req.body;
            
            // Удаляем старые файлы, если загружены новые
            if (req.files?.fileCover?.[0] && book.fileCover) {
                const oldCoverPath = path.join(__dirname, '..', 'public', 'img', book.fileCover);
                if (fs.existsSync(oldCoverPath)) {
                    fs.unlinkSync(oldCoverPath);
                }
            }
            
            if (req.files?.fileBook?.[0] && book.fileBook) {
                const oldBookPath = path.join(__dirname, '..', 'public', 'books', book.fileBook);
                if (fs.existsSync(oldBookPath)) {
                    fs.unlinkSync(oldBookPath);
                }
            }
            
            // Обновляем книгу
            await Book.findOneAndUpdate(
                { id: id },
                {
                    title: title !== undefined ? title : book.title,
                    description: description !== undefined ? description : book.description,
                    authors: authors !== undefined ? authors : book.authors,
                    favorite: favorite !== undefined ? (favorite === 'true' || favorite === true) : book.favorite,
                    fileCover: req.files?.fileCover?.[0]?.filename || book.fileCover,
                    fileName: req.files?.fileBook?.[0]?.originalname || book.fileName,
                    fileBook: req.files?.fileBook?.[0]?.filename || book.fileBook
                }
            );
            
            const books = await Book.find().sort({ createdAt: -1 });
            res.render('books/index', { 
                title: 'Список книг',
                books: books,
                message: { type: 'success', text: 'Книга успешно обновлена!' }
            });
        } else {
            res.render('error', { 
                title: 'Книга не найдена',
                message: 'Книга с указанным ID не найдена'
            });
        }
    } catch (error) {
        console.error('Ошибка при обновлении книги:', error);
        res.render('error', { 
            title: 'Ошибка',
            message: 'Не удалось обновить книгу: ' + error.message
        });
    }
});

// Удаление книги
router.post('/books/:id/delete', ensureWebAuthenticated, async (req, res) => {
    const { id } = req.params;
    
    try {
        const book = await Book.findOne({ id: id });
        
        if (book) {
            // Удаляем файлы книги
            if (book.fileCover) {
                const coverPath = path.join(__dirname, '..', 'public', 'img', book.fileCover);
                if (fs.existsSync(coverPath)) {
                    fs.unlinkSync(coverPath);
                }
            }
            if (book.fileBook) {
                const bookPath = path.join(__dirname, '..', 'public', 'books', book.fileBook);
                if (fs.existsSync(bookPath)) {
                    fs.unlinkSync(bookPath);
                }
            }
            
            // Удаляем запись из базы данных
            await Book.findOneAndDelete({ id: id });
            
            const books = await Book.find().sort({ createdAt: -1 });
            res.render('books/index', { 
                title: 'Список книг',
                books: books,
                message: { type: 'success', text: 'Книга успешно удалена!' }
            });
        } else {
            res.render('error', { 
                title: 'Книга не найдена',
                message: 'Книга с указанным ID не найдена'
            });
        }
    } catch (error) {
        console.error('Ошибка при удалении книги:', error);
        res.render('error', { 
            title: 'Ошибка',
            message: 'Не удалось удалить книгу: ' + error.message
        });
    }
});

// Скачивание файла книги
router.get('/books/:id/download', async (req, res) => {
    const { id } = req.params;
    
    try {
        const book = await Book.findOne({ id: id });
        
        if (!book || !book.fileBook) {
            return res.render('error', { 
                title: 'Файл не найден',
                message: 'Файл книги не найден'
            });
        }

        const filePath = path.join(__dirname, '..', 'public', 'books', book.fileBook);
        
        if (fs.existsSync(filePath)) {
            let fileName = book.fileName || book.fileBook;
            try {
                fileName = decodeURIComponent(escape(fileName));
            } catch (e) {
                try {
                    fileName = decodeURIComponent(fileName);
                } catch (e2) {}
            }
            
            res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`);
            res.download(filePath, fileName, (err) => {
                if (err) {
                    console.error('Ошибка при скачивании:', err);
                    res.render('error', { 
                        title: 'Ошибка',
                        message: 'Ошибка при скачивании файла'
                    });
                }
            });
        } else {
            res.render('error', { 
                title: 'Файл не найден',
                message: 'Файл не найден на сервере'
            });
        }
    } catch (error) {
        console.error('Ошибка при скачивании:', error);
        res.render('error', { 
            title: 'Ошибка',
            message: 'Произошла ошибка при скачивании файла'
        });
    }
});

module.exports = router;