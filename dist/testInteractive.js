"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const readline = __importStar(require("readline"));
const container_1 = require("./container");
const BooksRepository_1 = require("./repositories/BooksRepository");
// Создание интерфейса для ввода/вывода
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log('\n╔══════════════════════════════════════════════════════════════════╗');
console.log('║              📚 ТЕСТИРОВАНИЕ BOOKS REPOSITORY 📚                 ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');
// Диагностика: проверяем, что находится в контейнере
console.log('🔍 Диагностика контейнера:');
try {
    const testRepo = container_1.container.get(BooksRepository_1.BooksRepository);
    console.log('✅ BooksRepository получен из контейнера');
    console.log('📦 Тип:', testRepo.constructor.name);
    console.log('📋 Методы:', Object.getOwnPropertyNames(Object.getPrototypeOf(testRepo)));
}
catch (error) {
    console.error('❌ Ошибка получения BooksRepository:', error);
    process.exit(1);
}
console.log('\n' + '='.repeat(60) + '\n');
// Получаем экземпляр репозитория
const booksRepo = container_1.container.get(BooksRepository_1.BooksRepository);
// Функция для отображения меню
function showMenu() {
    console.log('\n┌─────────────────────────────────────────────────────────────┐');
    console.log('│                    📋 ДОСТУПНЫЕ КОМАНДЫ                      │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log('│  1. createBook     - Создать новую книгу                    │');
    console.log('│  2. getBook        - Найти книгу по ID                      │');
    console.log('│  3. getBooks       - Получить все книги                     │');
    console.log('│  4. updateBook     - Обновить книгу                         │');
    console.log('│  5. deleteBook     - Удалить книгу                          │');
    console.log('│  6. findByTitle    - Найти книги по названию                │');
    console.log('│  7. findByAuthor   - Найти книги по автору                  │');
    console.log('│  8. getFavorites   - Получить избранные книги               │');
    console.log('│  9. countBooks     - Подсчитать количество книг             │');
    console.log('│  10. exit          - Выйти из программы                     │');
    console.log('└─────────────────────────────────────────────────────────────┘');
    rl.question('\n👉 Выберите действие (1-10): ', handleCommand);
}
// Обработка команд
async function handleCommand(answer) {
    const command = answer.trim().toLowerCase();
    switch (command) {
        case '1':
        case 'createbook':
            await testCreateBook();
            break;
        case '2':
        case 'getbook':
            await testGetBook();
            break;
        case '3':
        case 'getbooks':
            await testGetBooks();
            break;
        case '4':
        case 'updatebook':
            await testUpdateBook();
            break;
        case '5':
        case 'deletebook':
            await testDeleteBook();
            break;
        case '6':
        case 'findbytitle':
            await testFindByTitle();
            break;
        case '7':
        case 'findbyauthor':
            await testFindByAuthor();
            break;
        case '8':
        case 'getfavorites':
            await testGetFavorites();
            break;
        case '9':
        case 'countbooks':
            await testCountBooks();
            break;
        case '10':
        case 'exit':
            console.log('\n👋 До свидания!');
            rl.close();
            return;
        default:
            console.log('❌ Неизвестная команда. Попробуйте снова.');
            showMenu();
    }
}
// Тестовые функции
async function testCreateBook() {
    console.log('\n📝 СОЗДАНИЕ НОВОЙ КНИГИ\n');
    rl.question('Название книги: ', (title) => {
        if (!title) {
            console.log('❌ Название книги обязательно!');
            return showMenu();
        }
        rl.question('Автор(ы): ', (authors) => {
            rl.question('Описание: ', (description) => {
                rl.question('Избранное? (true/false): ', (favorite) => {
                    const newBook = {
                        title: title,
                        authors: authors || null,
                        description: description || null,
                        favorite: favorite === 'true' || favorite === 'yes' || favorite === 'y',
                        fileCover: null,
                        fileName: null,
                        fileBook: null
                    };
                    console.log('\n⏳ Создание книги...');
                    booksRepo.createBook(newBook)
                        .then(book => {
                        console.log('\n✅ Книга успешно создана!');
                        console.log('📖 Результат:', JSON.stringify(book, null, 2));
                        console.log('\n💡 Сохраните ID для дальнейших операций:', book.id);
                        showMenu();
                    })
                        .catch(err => {
                        console.error('\n❌ Ошибка при создании:', err.message);
                        showMenu();
                    });
                });
            });
        });
    });
}
async function testGetBook() {
    console.log('\n🔍 ПОИСК КНИГИ ПО ID\n');
    rl.question('Введите ID книги: ', (id) => {
        if (!id) {
            console.log('❌ ID не может быть пустым');
            return showMenu();
        }
        console.log('\n⏳ Поиск книги...');
        booksRepo.getBook(id)
            .then(book => {
            if (book) {
                console.log('\n✅ Книга найдена!');
                console.log('📖 Результат:', JSON.stringify(book, null, 2));
            }
            else {
                console.log('\n❌ Книга с ID "' + id + '" не найдена');
            }
            showMenu();
        })
            .catch(err => {
            console.error('\n❌ Ошибка при поиске:', err.message);
            showMenu();
        });
    });
}
async function testGetBooks() {
    console.log('\n📚 ПОЛУЧЕНИЕ ВСЕХ КНИГ\n');
    console.log('⏳ Загрузка списка книг...');
    booksRepo.getBooks()
        .then(books => {
        console.log(`\n✅ Найдено книг: ${books.length}`);
        if (books.length > 0) {
            console.log('\n📖 Список книг:');
            books.forEach((book, index) => {
                console.log(`  ${index + 1}. "${book.title}" - ${book.authors || 'Автор не указан'} (ID: ${book.id})`);
            });
        }
        else {
            console.log('\n📭 В библиотеке пока нет книг');
        }
        showMenu();
    })
        .catch(err => {
        console.error('\n❌ Ошибка при получении списка:', err.message);
        showMenu();
    });
}
async function testUpdateBook() {
    console.log('\n✏️ ОБНОВЛЕНИЕ КНИГИ\n');
    rl.question('Введите ID книги для обновления: ', (id) => {
        if (!id) {
            console.log('❌ ID не может быть пустым');
            return showMenu();
        }
        console.log('\nВведите новые данные (оставьте пустым, чтобы не менять):\n');
        rl.question('Новое название: ', (title) => {
            rl.question('Новый автор: ', (authors) => {
                rl.question('Новое описание: ', (description) => {
                    rl.question('Избранное? (true/false): ', (favorite) => {
                        const updateData = {};
                        if (title)
                            updateData.title = title;
                        if (authors)
                            updateData.authors = authors;
                        if (description)
                            updateData.description = description;
                        if (favorite)
                            updateData.favorite = favorite === 'true';
                        if (Object.keys(updateData).length === 0) {
                            console.log('❌ Нет данных для обновления');
                            return showMenu();
                        }
                        console.log('\n⏳ Обновление книги...');
                        booksRepo.updateBook(id, updateData)
                            .then(book => {
                            if (book) {
                                console.log('\n✅ Книга успешно обновлена!');
                                console.log('📖 Результат:', JSON.stringify(book, null, 2));
                            }
                            else {
                                console.log('\n❌ Книга с ID "' + id + '" не найдена');
                            }
                            showMenu();
                        })
                            .catch(err => {
                            console.error('\n❌ Ошибка при обновлении:', err.message);
                            showMenu();
                        });
                    });
                });
            });
        });
    });
}
async function testDeleteBook() {
    console.log('\n🗑️ УДАЛЕНИЕ КНИГИ\n');
    rl.question('Введите ID книги для удаления: ', (id) => {
        if (!id) {
            console.log('❌ ID не может быть пустым');
            return showMenu();
        }
        rl.question(`Вы уверены, что хотите удалить книгу с ID "${id}"? (yes/no): `, (confirm) => {
            if (confirm.toLowerCase() === 'yes' || confirm.toLowerCase() === 'y') {
                console.log('\n⏳ Удаление книги...');
                booksRepo.deleteBook(id)
                    .then(success => {
                    if (success) {
                        console.log('\n✅ Книга успешно удалена');
                    }
                    else {
                        console.log('\n❌ Книга с ID "' + id + '" не найдена');
                    }
                    showMenu();
                })
                    .catch(err => {
                    console.error('\n❌ Ошибка при удалении:', err.message);
                    showMenu();
                });
            }
            else {
                console.log('\n❌ Удаление отменено');
                showMenu();
            }
        });
    });
}
async function testFindByTitle() {
    console.log('\n🔍 ПОИСК КНИГ ПО НАЗВАНИЮ\n');
    rl.question('Введите название (или его часть): ', (title) => {
        if (!title) {
            console.log('❌ Название не может быть пустым');
            return showMenu();
        }
        console.log('\n⏳ Поиск книг...');
        booksRepo.findBooksByTitle(title)
            .then(books => {
            console.log(`\n✅ Найдено книг: ${books.length}`);
            if (books.length > 0) {
                console.log('\n📖 Результаты поиска:');
                books.forEach((book, index) => {
                    console.log(`  ${index + 1}. "${book.title}" - ${book.authors || 'Автор не указан'}`);
                });
            }
            else {
                console.log('\n📭 Книги с названием "' + title + '" не найдены');
            }
            showMenu();
        })
            .catch(err => {
            console.error('\n❌ Ошибка при поиске:', err.message);
            showMenu();
        });
    });
}
async function testFindByAuthor() {
    console.log('\n🔍 ПОИСК КНИГ ПО АВТОРУ\n');
    rl.question('Введите имя автора (или его часть): ', (author) => {
        if (!author) {
            console.log('❌ Имя автора не может быть пустым');
            return showMenu();
        }
        console.log('\n⏳ Поиск книг...');
        booksRepo.findBooksByAuthor(author)
            .then(books => {
            console.log(`\n✅ Найдено книг: ${books.length}`);
            if (books.length > 0) {
                console.log('\n📖 Результаты поиска:');
                books.forEach((book, index) => {
                    console.log(`  ${index + 1}. "${book.title}" - ${book.authors || 'Автор не указан'}`);
                });
            }
            else {
                console.log('\n📭 Книги автора "' + author + '" не найдены');
            }
            showMenu();
        })
            .catch(err => {
            console.error('\n❌ Ошибка при поиске:', err.message);
            showMenu();
        });
    });
}
async function testGetFavorites() {
    console.log('\n⭐ ПОЛУЧЕНИЕ ИЗБРАННЫХ КНИГ\n');
    console.log('⏳ Загрузка избранных книг...');
    booksRepo.getFavoriteBooks()
        .then(books => {
        console.log(`\n✅ Избранных книг: ${books.length}`);
        if (books.length > 0) {
            console.log('\n📖 Список избранных книг:');
            books.forEach((book, index) => {
                console.log(`  ${index + 1}. "${book.title}" - ${book.authors || 'Автор не указан'}`);
            });
        }
        else {
            console.log('\n📭 В избранном пока нет книг');
        }
        showMenu();
    })
        .catch(err => {
        console.error('\n❌ Ошибка при получении списка:', err.message);
        showMenu();
    });
}
async function testCountBooks() {
    console.log('\n🔢 ПОДСЧЁТ КНИГ\n');
    console.log('⏳ Подсчёт количества книг...');
    booksRepo.countBooks()
        .then(count => {
        console.log(`\n✅ Всего книг в библиотеке: ${count}`);
        showMenu();
    })
        .catch(err => {
        console.error('\n❌ Ошибка при подсчёте:', err.message);
        showMenu();
    });
}
// Запуск приложения
console.log('🚀 Запуск интерактивного тестирования BooksRepository...\n');
showMenu();
//# sourceMappingURL=testInteractive.js.map