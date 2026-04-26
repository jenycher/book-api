"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksRepository = void 0;
const inversify_1 = require("inversify");
const Book_model_1 = require("../models/Book.model");
const uuid_1 = require("uuid");
let BooksRepository = class BooksRepository {
    async createBook(book) {
        if (!book.title) {
            throw new Error('Title is required');
        }
        const newBook = new Book_model_1.BookModel({
            id: (0, uuid_1.v4)(),
            title: book.title,
            description: book.description || null,
            authors: book.authors || null,
            favorite: book.favorite || false,
            fileCover: book.fileCover || null,
            fileName: book.fileName || null,
            fileBook: book.fileBook || null
        });
        await newBook.save();
        return newBook.toObject();
    }
    async getBook(id) {
        const book = await Book_model_1.BookModel.findOne({ id });
        return book ? book.toObject() : null;
    }
    async getBooks() {
        const books = await Book_model_1.BookModel.find().sort({ createdAt: -1 });
        return books.map(book => book.toObject());
    }
    async updateBook(id, updatedBook) {
        const book = await Book_model_1.BookModel.findOneAndUpdate({ id }, { ...updatedBook, updatedAt: new Date() }, { new: true });
        return book ? book.toObject() : null;
    }
    async deleteBook(id) {
        const result = await Book_model_1.BookModel.findOneAndDelete({ id });
        return result !== null;
    }
    async findBooksByTitle(title) {
        const books = await Book_model_1.BookModel.find({
            title: { $regex: title, $options: 'i' }
        });
        return books.map(book => book.toObject());
    }
    async findBooksByAuthor(author) {
        const books = await Book_model_1.BookModel.find({
            authors: { $regex: author, $options: 'i' }
        });
        return books.map(book => book.toObject());
    }
    async getFavoriteBooks() {
        const books = await Book_model_1.BookModel.find({ favorite: true });
        return books.map(book => book.toObject());
    }
    async countBooks() {
        return Book_model_1.BookModel.countDocuments();
    }
};
exports.BooksRepository = BooksRepository;
exports.BooksRepository = BooksRepository = __decorate([
    (0, inversify_1.injectable)()
], BooksRepository);
//# sourceMappingURL=BooksRepository.js.map