import { Request, Response, NextFunction } from 'express';
import { BooksRepository } from '../repositories/BooksRepository';
export declare class BooksController {
    private booksRepository;
    constructor(booksRepository: BooksRepository);
    getAllBooks: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBookById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createBook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateBook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteBook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    searchByTitle: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    searchByAuthor: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getFavorites: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCount: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=BooksController.d.ts.map