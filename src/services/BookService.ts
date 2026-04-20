import { injectable, inject } from 'inversify';
import { BooksRepository } from '../repositories/BooksRepository';
import { IBook, ICreateBook, IUpdateBook } from '../interfaces/IBook';
import { TYPES } from '../types/containerTypes';

@injectable()
export class BookService {
    constructor(
        @inject(TYPES.BooksRepository) private booksRepository: BooksRepository
    ) {}

    async getAllBooks(): Promise<IBook[]> {
        return this.booksRepository.getBooks();
    }

    async getBookById(id: string): Promise<IBook | null> {
        return this.booksRepository.getBook(id);
    }

    async createBook(bookData: ICreateBook): Promise<IBook> {
        return this.booksRepository.createBook(bookData);
    }

    async updateBook(id: string, bookData: IUpdateBook): Promise<IBook | null> {
        return this.booksRepository.updateBook(id, bookData);
    }

    async deleteBook(id: string): Promise<boolean> {
        return this.booksRepository.deleteBook(id);
    }

    async searchByTitle(title: string): Promise<IBook[]> {
        return this.booksRepository.findBooksByTitle(title);
    }

    async searchByAuthor(author: string): Promise<IBook[]> {
        return this.booksRepository.findBooksByAuthor(author);
    }

    async getFavorites(): Promise<IBook[]> {
        return this.booksRepository.getFavoriteBooks();
    }

    async getTotalCount(): Promise<number> {
        return this.booksRepository.countBooks();
    }
}