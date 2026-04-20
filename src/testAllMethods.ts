import 'reflect-metadata';
import { container } from './container';
import { BooksRepository } from './repositories/BooksRepository';
import { IUpdateBook } from './interfaces/IBook';

async function testAllMethods() {
    console.log('\n╔══════════════════════════════════════════════════════════════════╗');
    console.log('║              🧪 ТЕСТИРОВАНИЕ ВСЕХ МЕТОДОВ REPOSITORY 🧪          ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');
    
    const booksRepo = container.get(BooksRepository);
    
    // 1. Создание книг
    console.log('📝 1. СОЗДАНИЕ КНИГ\n');
    
    const book1 = await booksRepo.createBook({
        title: 'Война и мир',
        authors: 'Лев Толстой',
        description: 'Классический роман-эпопея',
        favorite: true,
        fileCover: null,
        fileName: null,
        fileBook: null
    });
    console.log('   ✅', book1.title, '(ID:', book1.id, ')');
    
    const book2 = await booksRepo.createBook({
        title: 'Преступление и наказание',
        authors: 'Фёдор Достоевский',
        description: 'Психологический роман',
        favorite: false,
        fileCover: null,
        fileName: null,
        fileBook: null
    });
    console.log('   ✅', book2.title, '(ID:', book2.id, ')');
    
    const book3 = await booksRepo.createBook({
        title: 'Анна Каренина',
        authors: 'Лев Толстой',
        description: 'Трагическая история любви',
        favorite: true,
        fileCover: null,
        fileName: null,
        fileBook: null
    });
    console.log('   ✅', book3.title, '(ID:', book3.id, ')');
    
    // 2. Получение всех книг
    console.log('\n📚 2. ПОЛУЧЕНИЕ ВСЕХ КНИГ\n');
    const allBooks = await booksRepo.getBooks();
    console.log(`   Всего книг: ${allBooks.length}`);
    allBooks.forEach((book, i) => {
        console.log(`   ${i + 1}. ${book.title} - ${book.authors}`);
    });
    
    // 3. Подсчёт книг
    console.log('\n🔢 3. ПОДСЧЁТ КНИГ\n');
    const count = await booksRepo.countBooks();
    console.log(`   Всего книг в библиотеке: ${count}`);
    
    // 4. Получение книги по ID
    console.log('\n🔍 4. ПОЛУЧЕНИЕ КНИГИ ПО ID\n');
    const foundBook = await booksRepo.getBook(book1.id);
    if (foundBook) {
        console.log(`   ✅ Найдена: ${foundBook.title} (${foundBook.authors})`);
    }
    
    // 5. Поиск по названию
    console.log('\n🔎 5. ПОИСК ПО НАЗВАНИЮ "война"\n');
    const byTitle = await booksRepo.findBooksByTitle('война');
    byTitle.forEach(book => {
        console.log(`   📖 ${book.title} - ${book.authors}`);
    });
    
    // 6. Поиск по автору
    console.log('\n🔎 6. ПОИСК ПО АВТОРУ "Толстой"\n');
    const byAuthor = await booksRepo.findBooksByAuthor('Толстой');
    byAuthor.forEach(book => {
        console.log(`   📖 ${book.title} - ${book.authors}`);
    });
    
    // 7. Получение избранных книг
    console.log('\n⭐ 7. ПОЛУЧЕНИЕ ИЗБРАННЫХ КНИГ\n');
    const favorites = await booksRepo.getFavoriteBooks();
    favorites.forEach(book => {
        console.log(`   ❤️ ${book.title} - ${book.authors}`);
    });
    
    // 8. Обновление книги
    console.log('\n✏️ 8. ОБНОВЛЕНИЕ КНИГИ\n');
    const updateData: IUpdateBook = {
        description: 'Обновлённое описание романа',
        favorite: false
    };
    const updatedBook = await booksRepo.updateBook(book2.id, updateData);
    if (updatedBook) {
        console.log(`   ✅ Обновлена: ${updatedBook.title}`);
        console.log(`   📝 Новое описание: ${updatedBook.description}`);
        console.log(`   ⭐ Избранное: ${updatedBook.favorite}`);
    }
    
    // 9. Проверка после обновления
    console.log('\n📖 9. ПРОВЕРКА ПОСЛЕ ОБНОВЛЕНИЯ\n');
    const afterUpdate = await booksRepo.getBook(book2.id);
    if (afterUpdate) {
        console.log(`   📚 ${afterUpdate.title}`);
        console.log(`   📝 ${afterUpdate.description}`);
        console.log(`   ⭐ ${afterUpdate.favorite ? 'В избранном' : 'Не в избранном'}`);
    }
    
    // 10. Удаление книги
    console.log('\n🗑️ 10. УДАЛЕНИЕ КНИГИ\n');
    const deleted = await booksRepo.deleteBook(book3.id);
    if (deleted) {
        console.log(`   ✅ Книга "${book3.title}" удалена`);
    }
    
    // 11. Финальная проверка
    console.log('\n📊 11. ФИНАЛЬНАЯ ПРОВЕРКА\n');
    const finalBooks = await booksRepo.getBooks();
    console.log(`   Осталось книг: ${finalBooks.length}`);
    finalBooks.forEach((book, i) => {
        console.log(`   ${i + 1}. ${book.title} - ${book.authors}`);
    });
    
    console.log('\n╔══════════════════════════════════════════════════════════════════╗');
    console.log('║                    🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ! 🎉                     ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');
}

// Запуск тестов
testAllMethods().catch(console.error);