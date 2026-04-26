import { IBook, ICreateBook, IUpdateBook } from '../interfaces/IBook';
export declare class BooksRepository {
    createBook(book: ICreateBook): Promise<IBook>;
    getBook(id: string): Promise<IBook | null>;
    getBooks(): Promise<IBook[]>;
    updateBook(id: string, updatedBook: IUpdateBook): Promise<IBook | null>;
    deleteBook(id: string): Promise<boolean>;
    findBooksByTitle(title: string): Promise<IBook[]>;
    findBooksByAuthor(author: string): Promise<IBook[]>;
    getFavoriteBooks(): Promise<IBook[]>;
    countBooks(): Promise<number>;
}
//# sourceMappingURL=BooksRepository.d.ts.map