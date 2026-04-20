import { injectable } from 'inversify';
import { v4 as uuid } from 'uuid';
import { IBook, ICreateBook, IUpdateBook } from '../interfaces/IBook';
import { BooksRepository } from './BooksRepository';

// Импортируем mongoose модель (будет подключена позже)
// Сейчас используем временное хранилище в памяти для тестирования
interface BookDocument extends IBook {
    _id?: string;
}

// Временное хранилище в памяти (заменим на MongoDB позже)
let booksStore: BookDocument[] = [];

@injectable()
export class MongoBooksRepository implements BooksRepository {
    
    async createBook(book: ICreateBook): Promise<IBook> {
        const newBook: IBook = {
            id: uuid(),
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

    async getBook(id: string): Promise<IBook | null> {
        const book = booksStore.find(b => b.id === id);
        if (book) {
            console.log(`📖 Найдена книга: ${book.title}`);
            return book;
        }
        console.log(`❌ Книга с ID ${id} не найдена`);
        return null;
    }

    async getBooks(): Promise<IBook[]> {
        console.log(`📚 Получено книг: ${booksStore.length}`);
        return [...booksStore]; // Возвращаем копию массива
    }

    async updateBook(id: string, updatedBook: IUpdateBook): Promise<IBook | null> {
        const index = booksStore.findIndex(b => b.id === id);
        if (index === -1) {
            console.log(`❌ Книга с ID ${id} не найдена для обновления`);
            return null;
        }
        
        const oldBook = booksStore[index];
        const newBook: IBook = {
            ...oldBook,
            ...updatedBook,
            updatedAt: new Date()
        };
        
        booksStore[index] = newBook;
        console.log(`✏️ Книга обновлена: ${newBook.title} (${id})`);
        
        return newBook;
    }

    async deleteBook(id: string): Promise<boolean> {
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

    async findBooksByTitle(title: string): Promise<IBook[]> {
        const searchTitle = title.toLowerCase();
        const results = booksStore.filter(book => 
            book.title.toLowerCase().includes(searchTitle)
        );
        console.log(`🔍 Найдено книг по названию "${title}": ${results.length}`);
        return results;
    }

    async findBooksByAuthor(author: string): Promise<IBook[]> {
        if (!author) return [];
        
        const searchAuthor = author.toLowerCase();
        const results = booksStore.filter(book => 
            book.authors && book.authors.toLowerCase().includes(searchAuthor)
        );
        console.log(`🔍 Найдено книг по автору "${author}": ${results.length}`);
        return results;
    }

    async getFavoriteBooks(): Promise<IBook[]> {
        const favorites = booksStore.filter(book => book.favorite === true);
        console.log(`⭐ Избранных книг: ${favorites.length}`);
        return favorites;
    }

    async countBooks(): Promise<number> {
        console.log(`🔢 Всего книг: ${booksStore.length}`);
        return booksStore.length;
    }
}