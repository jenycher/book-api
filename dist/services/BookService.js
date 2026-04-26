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
exports.BookService = void 0;
const inversify_1 = require("inversify");
const BooksRepository_1 = require("../repositories/BooksRepository");
const containerTypes_1 = require("../types/containerTypes");
let BookService = class BookService {
    booksRepository;
    constructor(booksRepository) {
        this.booksRepository = booksRepository;
    }
    async getAllBooks() {
        return this.booksRepository.getBooks();
    }
    async getBookById(id) {
        return this.booksRepository.getBook(id);
    }
    async createBook(bookData) {
        return this.booksRepository.createBook(bookData);
    }
    async updateBook(id, bookData) {
        return this.booksRepository.updateBook(id, bookData);
    }
    async deleteBook(id) {
        return this.booksRepository.deleteBook(id);
    }
    async searchByTitle(title) {
        return this.booksRepository.findBooksByTitle(title);
    }
    async searchByAuthor(author) {
        return this.booksRepository.findBooksByAuthor(author);
    }
    async getFavorites() {
        return this.booksRepository.getFavoriteBooks();
    }
    async getTotalCount() {
        return this.booksRepository.countBooks();
    }
};
exports.BookService = BookService;
exports.BookService = BookService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(containerTypes_1.TYPES.BooksRepository)),
    __metadata("design:paramtypes", [BooksRepository_1.BooksRepository])
], BookService);
//# sourceMappingURL=BookService.js.map