import 'reflect-metadata';
import { container } from './container';
import { BooksRepository } from './repositories/BooksRepository';

async function testContainer() {
    console.log('Тестирование IoC контейнера...');
    
    try {
        // Получаем экземпляр BooksRepository из контейнера
        const booksRepo = container.get(BooksRepository);
        
        console.log('✅ BooksRepository успешно получен из контейнера');
        console.log('Тип:', booksRepo.constructor.name);
        
        // Проверка методов
        console.log('📚 Доступные методы:');
        console.log('  - createBook');
        console.log('  - getBook');
        console.log('  - getBooks');
        console.log('  - updateBook');
        console.log('  - deleteBook');
        console.log('  - findBooksByTitle');
        console.log('  - findBooksByAuthor');
        console.log('  - getFavoriteBooks');
        console.log('  - countBooks');
        
    } catch (error) {
        console.error('❌ Ошибка:', error);
    }
}

// Запуск теста
testContainer();