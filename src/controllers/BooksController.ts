import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { BooksRepository } from '../repositories/BooksRepository';
import { ICreateBook, IUpdateBook } from '../interfaces/IBook';

@injectable()
export class BooksController {
    constructor(
        @inject(BooksRepository) private booksRepository: BooksRepository
    ) {}

    getAllBooks = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const books = await this.booksRepository.getBooks();
            res.json(books);
        } catch (error) {
            next(error);
        }
    };

    getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const book = await this.booksRepository.getBook(id as string);
            
            if (!book) {
                res.status(404).json({ message: 'Книга не найдена' });
                return;
            }
            
            res.json(book);
        } catch (error) {
            next(error);
        }
    };

    createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { title, authors, description, favorite, fileCover, fileName, fileBook } = req.body;
            
            if (!title) {
                res.status(400).json({ message: 'Поле "title" обязательно для заполнения' });
                return;
            }
            
            const bookData: ICreateBook = {
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
        } catch (error) {
            next(error);
        }
    };

    updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const updateData: IUpdateBook = req.body;
            const updatedBook = await this.booksRepository.updateBook(id as string, updateData);
            
            if (!updatedBook) {
                res.status(404).json({ message: 'Книга не найдена' });
                return;
            }
            
            res.json(updatedBook);
        } catch (error) {
            next(error);
        }
    };

    deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const deleted = await this.booksRepository.deleteBook(id as string);
            
            if (!deleted) {
                res.status(404).json({ message: 'Книга не найдена' });
                return;
            }
            
            res.json({ message: 'ok' });
        } catch (error) {
            next(error);
        }
    };

    // Новые методы
    searchByTitle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { q } = req.query;
            if (!q) {
                res.status(400).json({ message: 'Параметр "q" обязателен' });
                return;
            }
            const books = await this.booksRepository.findBooksByTitle(q as string);
            res.json(books);
        } catch (error) {
            next(error);
        }
    };

    searchByAuthor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { q } = req.query;
            if (!q) {
                res.status(400).json({ message: 'Параметр "q" обязателен' });
                return;
            }
            const books = await this.booksRepository.findBooksByAuthor(q as string);
            res.json(books);
        } catch (error) {
            next(error);
        }
    };

    getFavorites = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const books = await this.booksRepository.getFavoriteBooks();
            res.json(books);
        } catch (error) {
            next(error);
        }
    };

    getCount = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const count = await this.booksRepository.countBooks();
            res.json({ count });
        } catch (error) {
            next(error);
        }
    };
}