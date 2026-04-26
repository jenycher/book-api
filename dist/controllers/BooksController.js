"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksController = void 0;
const inversify_1 = require("inversify");
const BooksRepository_1 = require("../repositories/BooksRepository");
let BooksController = class BooksController {
    booksRepository;
    constructor(booksRepository) {
        this.booksRepository = booksRepository;
    }
    getAllBooks = async (_req, res, next) => {
        try {
            const books = await this.booksRepository.getBooks();
            res.json(books);
        }
        catch (error) {
            next(error);
        }
    };
    getBookById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const book = await this.booksRepository.getBook(id);
            if (!book) {
                res.status(404).json({ message: 'Книга не найдена' });
                return;
            }
            res.json(book);
        }
        catch (error) {
            next(error);
        }
    };
    createBook = async (req, res, next) => {
        try {
            const { title, authors, description, favorite, fileCover, fileName, fileBook } = req.body;
            if (!title) {
                res.status(400).json({ message: 'Поле "title" обязательно для заполнения' });
                return;
            }
            const bookData = {
                title,
                authors: authors || null,
                description: description || null,
                favorite: favorite === true || favorite === 'true' || false,
                fileCover: fileCover || null,
                fileName: fileName || null,
                fileBook: fileBook || null
            };
            const newBook = await this.booksRepository.createBook(bookData);
            res.status(201).json(newBook);
        }
        catch (error) {
            next(error);
        }
    };
    updateBook = async (req, res, next) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedBook = await this.booksRepository.updateBook(id, updateData);
            if (!updatedBook) {
                res.status(404).json({ message: 'Книга не найдена' });
                return;
            }
            res.json(updatedBook);
        }
        catch (error) {
            next(error);
        }
    };
    deleteBook = async (req, res, next) => {
        try {
            const { id } = req.params;
            const deleted = await this.booksRepository.deleteBook(id);
            if (!deleted) {
                res.status(404).json({ message: 'Книга не найдена' });
                return;
            }
            res.json({ message: 'ok' });
        }
        catch (error) {
            next(error);
        }
    };
    // Новые методы
    searchByTitle = async (req, res, next) => {
        try {
            const { q } = req.query;
            if (!q) {
                res.status(400).json({ message: 'Параметр "q" обязателен' });
                return;
            }
            const books = await this.booksRepository.findBooksByTitle(q);
            res.json(books);
        }
        catch (error) {
            next(error);
        }
    };
    searchByAuthor = async (req, res, next) => {
        try {
            const { q } = req.query;
            if (!q) {
                res.status(400).json({ message: 'Параметр "q" обязателен' });
                return;
            }
            const books = await this.booksRepository.findBooksByAuthor(q);
            res.json(books);
        }
        catch (error) {
            next(error);
        }
    };
    getFavorites = async (_req, res, next) => {
        try {
            const books = await this.booksRepository.getFavoriteBooks();
            res.json(books);
        }
        catch (error) {
            next(error);
        }
    };
    getCount = async (_req, res, next) => {
        try {
            const count = await this.booksRepository.countBooks();
            res.json({ count });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.BooksController = BooksController;
exports.BooksController = BooksController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(BooksRepository_1.BooksRepository)),
    __metadata("design:paramtypes", [BooksRepository_1.BooksRepository])
], BooksController);
//# sourceMappingURL=BooksController.js.map