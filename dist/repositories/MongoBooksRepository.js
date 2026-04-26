"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoBooksRepository = void 0;
const inversify_1 = require("inversify");
const uuid_1 = require("uuid");
// Временное хранилище в памяти (заменим на MongoDB позже)
let booksStore = [];
let MongoBooksRepository = class MongoBooksRepository {
    async createBook(book) {
        const newBook = {
            id: (0, uuid_1.v4)(),
            ...book,
            favorite: book.favorite || false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        // Сохраняем в "базу данных"
        booksStore.push(newBook);
        console.log(`✅ Книга создана: ${newBook.title} (${newBook.id})`);
        return newBook;
    }
    async getBook(id) {
        const book = booksStore.find(b => b.id === id);
        if (book) {
            console.log(`📖 Найдена книга: ${book.title}`);
            return book;
        }
        console.log(`❌ Книга с ID ${id} не найдена`);
        return null;
    }
    async getBooks() {
        console.log(`📚 Получено книг: ${booksStore.length}`);
        return [...booksStore]; // Возвращаем копию массива
    }
    async updateBook(id, updatedBook) {
        const index = booksStore.findIndex(b => b.id === id);
        if (index === -1) {
            console.log(`❌ Книга с ID ${id} не найдена для обновления`);
            return null;
        }
        const oldBook = booksStore[index];
        const newBook = {
            ...oldBook,
            ...updatedBook,
            updatedAt: new Date()
        };
        booksStore[index] = newBook;
        console.log(`✏️ Книга обновлена: ${newBook.title} (${id})`);
        return newBook;
    }
    async deleteBook(id) {
        const index = booksStore.findIndex(b => b.id === id);
        if (index === -1) {
            console.log(`❌ Книга с ID ${id} не найдена для удаления`);
            return false;
        }
        const deletedBook = booksStore[index];
        booksStore.splice(index, 1);
        console.log(`🗑️ Книга удалена: ${deletedBook.title} (${id})`);
        return true;
    }
    async findBooksByTitle(title) {
        const searchTitle = title.toLowerCase();
        const results = booksStore.filter(book => book.title.toLowerCase().includes(searchTitle));
        console.log(`🔍 Найдено книг по названию "${title}": ${results.length}`);
        return results;
    }
    async findBooksByAuthor(author) {
        if (!author)
            return [];
        const searchAuthor = author.toLowerCase();
        const results = booksStore.filter(book => book.authors && book.authors.toLowerCase().includes(searchAuthor));
        console.log(`🔍 Найдено книг по автору "${author}": ${results.length}`);
        return results;
    }
    async getFavoriteBooks() {
        const favorites = booksStore.filter(book => book.favorite === true);
        console.log(`⭐ Избранных книг: ${favorites.length}`);
        return favorites;
    }
    async countBooks() {
        console.log(`🔢 Всего книг: ${booksStore.length}`);
        return booksStore.length;
    }
};
exports.MongoBooksRepository = MongoBooksRepository;
exports.MongoBooksRepository = MongoBooksRepository = __decorate([
    (0, inversify_1.injectable)()
], MongoBooksRepository);
//# sourceMappingURL=MongoBooksRepository.js.map