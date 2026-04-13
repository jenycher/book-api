const mongoose = require('mongoose');

// Для Docker используем имя сервиса 'mongo', для локальной разработки - localhost
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:secretpassword@mongo:27017/library_db?authSource=admin';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB подключена успешно');
    } catch (error) {
        console.error('❌ Ошибка подключения к MongoDB:', error.message);
        // Не завершаем процесс, просто логируем
    }
};

module.exports = connectDB;