import { Router } from 'express';
import { container } from '../container';
import { BooksRepository } from '../repositories/BooksRepository';
import { TYPES } from '../types/containerTypes';

const router = Router();

// Пример использования с toSelf()
router.get('/:id', async (req, res, next) => {
    try {
        const repo = container.get(BooksRepository);
        const book = await repo.getBook(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: 'Книга не найдена' });
        }
        
        res.json(book);
    } catch (error) {
        next(error);
    }
});

// Пример использования с символами
router.get('/', async (req, res, next) => {
    try {
        const repo = container.get<BooksRepository>(TYPES.BooksRepository);
        const books = await repo.getBooks();
        res.json(books);
    } catch (error) {
        next(error);
    }
});

// Пример использования с сервисом
router.post('/', async (req, res, next) => {
    try {
        const bookService = container.get<BookService>(TYPES.BookService);
        const newBook = await bookService.createBook(req.body);
        res.status(201).json(newBook);
    } catch (error) {
        next(error);
    }
});

export default router;