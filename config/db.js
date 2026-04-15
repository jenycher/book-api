const mongoose = require('mongoose');

// Определяем URI в зависимости от окружения
const getMongoURI = () => {
    // Если запущено в Docker
    if (process.env.DOCKER_ENV === 'true' || process.env.MONGODB_URI) {
        return process.env.MONGODB_URI || 'mongodb://admin:secretpassword@mongo:27017/library_db?authSource=admin';
    }
    // Локальный запуск
    return 'mongodb://localhost:27017/library_db';
};

const MONGODB_URI = getMongoURI();

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB подключена успешно');
    } catch (error) {
        console.error('❌ Ошибка подключения к MongoDB:', error.message);
        console.log('🔄 Повторная попытка через 5 секунд...');
        setTimeout(connectDB, 5000);
    }
};

module.exports = connectDB;