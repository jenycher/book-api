import { Router } from 'express';
import { container } from '../container';
import { BooksController } from '../controllers/BooksController';

const router = Router();
const booksController = container.get(BooksController);

// Основные CRUD маршруты
router.get('/', booksController.getAllBooks);
router.get('/favorites', booksController.getFavorites);
router.get('/count', booksController.getCount);
router.get('/search/title', booksController.searchByTitle);
router.get('/search/author', booksController.searchByAuthor);
router.get('/:id', booksController.getBookById);
router.post('/', booksController.createBook);
router.put('/:id', booksController.updateBook);
router.delete('/:id', booksController.deleteBook);

export default router;