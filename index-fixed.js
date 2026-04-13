const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = 3000;

app.use(express.json());
connectDB();

// Подключаем минимальный роутер
const bookRoutes = require('./routes/books');
app.use('/api/books', bookRoutes); // <- БЕЗ вызова фабрики

app.listen(PORT, () => {
    console.log(`✅ Сервер на порту ${PORT}`);
    console.log(`✅ Тест: http://localhost:${PORT}/api/books/test`);
});