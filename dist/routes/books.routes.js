"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../container");
const BooksController_1 = require("../controllers/BooksController");
const router = (0, express_1.Router)();
const booksController = container_1.container.get(BooksController_1.BooksController);
// Основные CRUD маршруты
router.get('/', booksController.getAllBooks);
router.get('/favorites', booksController.getFavorites);
router.get('/count', booksController.getCount);
router.get('/search/title', booksController.searchByTitle);
router.get('/search/author', booksController.searchByAuthor);
router.get('/:id', booksController.getBookById);
router.post('/', booksController.createBook);
router.put('/:id', booksController.updateBook);
router.delete('/:id', booksController.deleteBook);
exports.default = router;
//# sourceMappingURL=books.routes.js.map