import { BooksRepository } from '../repositories/BooksRepository';
import { IBook, ICreateBook, IUpdateBook } from '../interfaces/IBook';
export declare class BookService {
    private booksRepository;
    constructor(booksRepository: BooksRepository);
    getAllBooks(): Promise<IBook[]>;
    getBookById(id: string): Promise<IBook | null>;
    createBook(bookData: ICreateBook): Promise<IBook>;
    updateBook(id: string, bookData: IUpdateBook): Promise<IBook | null>;
    deleteBook(id: string): Promise<boolean>;
    searchByTitle(title: string): Promise<IBook[]>;
    searchByAuthor(author: string): Promise<IBook[]>;
    getFavorites(): Promise<IBook[]>;
    getTotalCount(): Promise<number>;
}
//# sourceMappingURL=BookService.d.ts.map