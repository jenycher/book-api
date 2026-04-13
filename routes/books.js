const express = require('express');
const { v4: uuid } = require('uuid');
const path = require('path');
const fs = require('fs');
const Book = require('../models/Book');
const upload = require('../middleware/upload');

module.exports = ({ getCounter, incrementCounter }) => {
    const router = express.Router();

    // ============== GET /api/books - получить все книги ==============
    router.get('/', async (req, res) => {
        try {
            const books = await Book.find().sort({ createdAt: -1 });
            res.json(books);
        } catch (error) {
            console.error('❌ Ошибка получения списка книг:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    });

    // ============== GET /api/books/:id - получить книгу по ID ==============
    router.get('/:id', async (req, res) => {
        const { id } = req.params;
        
        try {
            const book = await Book.findOne({ id: id });
            if (book) {
                let views = 0;
                if (incrementCounter) {
                    try {
                        const counter = await incrementCounter(id);
                        views = counter.count;
                    } catch (err) {
                        console.error(`⚠️ Ошибка счетчика для книги ${id}:`, err.message);
                    }
                }
                const bookObj = book.toObject();
                res.json({ ...bookObj, views });
            } else {
                res.status(404).json({ message: 'Книга не найдена' });
            }
        } catch (error) {
            console.error(`❌ Ошибка получения книги ${id}:`, error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    });

    // ============== POST /api/books - создать книгу ==============
    router.post('/', upload.fields([
        { name: 'fileCover', maxCount: 1 },
        { name: 'fileBook', maxCount: 1 }
    ]), async (req, res) => {
        try {
            const { title, description, authors, favorite } = req.body;
            
            const newBook = new Book({
                id: uuid(),
                title: title || '',
                description: description || '',
                authors: authors || '',
                favorite: favorite === 'true' || favorite === true || false,
                fileCover: req.files?.fileCover?.[0]?.filename || '',
                fileName: req.files?.fileBook?.[0]?.originalname || '',
                fileBook: req.files?.fileBook?.[0]?.filename || ''
            });
            
            await newBook.save();
            console.log(`✅ Создана книга: "${newBook.title}" (${newBook.id})`);
            res.status(201).json(newBook);
        } catch (error) {
            console.error('❌ Ошибка создания книги:', error);
            res.status(400).json({ message: error.message });
        }
    });

    // ============== PUT /api/books/:id - обновить книгу ==============
    router.put('/:id', upload.fields([
        { name: 'fileCover', maxCount: 1 },
        { name: 'fileBook', maxCount: 1 }
    ]), async (req, res) => {
        const { id } = req.params;
        
        try {
            const book = await Book.findOne({ id: id });
            if (!book) {
                return res.status(404).json({ message: 'Книга не найдена' });
            }
            
            const { title, description, authors, favorite } = req.body;
            
            // Удаляем старые файлы если загружены новые
            if (req.files?.fileCover?.[0] && book.fileCover) {
                const oldCoverPath = path.join(__dirname, '..', 'public', 'img', book.fileCover);
                if (fs.existsSync(oldCoverPath)) fs.unlinkSync(oldCoverPath);
            }
            
            if (req.files?.fileBook?.[0] && book.fileBook) {
                const oldBookPath = path.join(__dirname, '..', 'public', 'books', book.fileBook);
                if (fs.existsSync(oldBookPath)) fs.unlinkSync(oldBookPath);
            }
            
            const updatedBook = await Book.findOneAndUpdate(
                { id: id },
                {
                    title: title !== undefined ? title : book.title,
                    description: description !== undefined ? description : book.description,
                    authors: authors !== undefined ? authors : book.authors,
                    favorite: favorite !== undefined ? (favorite === 'true' || favorite === true) : book.favorite,
                    fileCover: req.files?.fileCover?.[0]?.filename || book.fileCover,
                    fileName: req.files?.fileBook?.[0]?.originalname || book.fileName,
                    fileBook: req.files?.fileBook?.[0]?.filename || book.fileBook
                },
                { new: true }
            );
            
            console.log(`✏️ Обновлена книга: "${updatedBook.title}" (${id})`);
            res.json(updatedBook);
        } catch (error) {
            console.error(`❌ Ошибка обновления книги ${id}:`, error);
            res.status(400).json({ message: error.message });
        }
    });

    // ============== DELETE /api/books/:id - удалить книгу ==============
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        
        try {
            const book = await Book.findOne({ id: id });
            if (!book) {
                return res.status(404).json({ message: 'Книга не найдена' });
            }
            
            // Удаляем файлы
            if (book.fileCover) {
                const coverPath = path.join(__dirname, '..', 'public', 'img', book.fileCover);
                if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
            }
            if (book.fileBook) {
                const bookPath = path.join(__dirname, '..', 'public', 'books', book.fileBook);
                if (fs.existsSync(bookPath)) fs.unlinkSync(bookPath);
            }
            
            await Book.findOneAndDelete({ id: id });
            console.log(`🗑️ Удалена книга: "${book.title}" (${id})`);
            res.json({ message: 'ok' });
        } catch (error) {
            console.error(`❌ Ошибка удаления книги ${id}:`, error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    });

    // ============== GET /api/books/:id/download - скачать файл ==============
    router.get('/:id/download', async (req, res) => {
        const { id } = req.params;
        
        try {
            const book = await Book.findOne({ id: id });
            if (!book || !book.fileBook) {
                return res.status(404).json({ message: 'Файл книги не найден' });
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
                res.download(filePath, fileName);
            } else {
                res.status(404).json({ message: 'Файл не найден на сервере' });
            }
        } catch (error) {
            console.error(`❌ Ошибка скачивания файла для книги ${id}:`, error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    });

    return router;
};