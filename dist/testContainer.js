"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const container_1 = require("./container");
const BooksRepository_1 = require("./repositories/BooksRepository");
async function testContainer() {
    console.log('Тестирование IoC контейнера...');
    try {
        // Получаем экземпляр BooksRepository из контейнера
        const booksRepo = container_1.container.get(BooksRepository_1.BooksRepository);
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
    }
    catch (error) {
        console.error('❌ Ошибка:', error);
    }
}
// Запуск теста
testContainer();
//# sourceMappingURL=testContainer.js.map