"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../container");
const BooksRepository_1 = require("../repositories/BooksRepository");
const containerTypes_1 = require("../types/containerTypes");
const router = (0, express_1.Router)();
// Пример использования с toSelf()
router.get('/:id', async (req, res, next) => {
    try {
        const repo = container_1.container.get(BooksRepository_1.BooksRepository);
        const book = await repo.getBook(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Книга не найдена' });
        }
        res.json(book);
    }
    catch (error) {
        next(error);
    }
});
// Пример использования с символами
router.get('/', async (req, res, next) => {
    try {
        const repo = container_1.container.get(containerTypes_1.TYPES.BooksRepository);
        const books = await repo.getBooks();
        res.json(books);
    }
    catch (error) {
        next(error);
    }
});
// Пример использования с сервисом
router.post('/', async (req, res, next) => {
    try {
        const bookService = container_1.container.get(containerTypes_1.TYPES.BookService);
        const newBook = await bookService.createBook(req.body);
        res.status(201).json(newBook);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=booksRouter.js.map