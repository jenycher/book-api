const mongoose = require('mongoose');
const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

const migrateData = async () => {
    try {
        // Подключение к БД
        await mongoose.connect('mongodb://admin:secretpassword@localhost:27017/library_db?authSource=admin');
        
        // Чтение существующих книг
        const booksPath = path.join(__dirname, '../data/books.json');
        if (fs.existsSync(booksPath)) {
            const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf8'));
            
            for (const book of booksData) {
                const existingBook = await Book.findOne({ id: book.id });
                if (!existingBook) {
                    await Book.create(book);
                    console.log(`✅ Книга "${book.title}" добавлена`);
                }
            }
        }
        
        console.log('Миграция завершена');
        process.exit(0);
    } catch (error) {
        console.error('Ошибка миграции:', error);
        process.exit(1);
    }
};

migrateData();