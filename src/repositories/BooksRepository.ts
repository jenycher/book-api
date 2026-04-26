import { injectable } from 'inversify';
import { IBook, ICreateBook, IUpdateBook } from '../interfaces/IBook';
import { BookModel } from '../models/Book.model';
import { v4 as uuid } from 'uuid';

@injectable()
export class BooksRepository {
    async createBook(book: ICreateBook): Promise<IBook> {
        if (!book.title) {
            throw new Error('Title is required');
        }
        
        const newBook = new BookModel({
            id: uuid(),
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

    async getBook(id: string): Promise<IBook | null> {
        const book = await BookModel.findOne({ id });
        return book ? book.toObject() : null;
    }

    async getBooks(): Promise<IBook[]> {
        const books = await BookModel.find().sort({ createdAt: -1 });
        return books.map(book => book.toObject());
    }

    async updateBook(id: string, updatedBook: IUpdateBook): Promise<IBook | null> {
        const book = await BookModel.findOneAndUpdate(
            { id },
            { ...updatedBook, updatedAt: new Date() },
            { new: true }
        );
        return book ? book.toObject() : null;
    }

    async deleteBook(id: string): Promise<boolean> {
        const result = await BookModel.findOneAndDelete({ id });
        return result !== null;
    }

    async findBooksByTitle(title: string): Promise<IBook[]> {
        const books = await BookModel.find({ 
            title: { $regex: title, $options: 'i' } 
        });
        return books.map(book => book.toObject());
    }

    async findBooksByAuthor(author: string): Promise<IBook[]> {
        const books = await BookModel.find({ 
            authors: { $regex: author, $options: 'i' } 
        });
        return books.map(book => book.toObject());
    }

    async getFavoriteBooks(): Promise<IBook[]> {
        const books = await BookModel.find({ favorite: true });
        return books.map(book => book.toObject());
    }

    async countBooks(): Promise<number> {
        return BookModel.countDocuments();
    }
}