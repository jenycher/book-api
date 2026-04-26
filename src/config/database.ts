import mongoose from 'mongoose';

// Используем переменные окружения или значения по умолчанию
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_db';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB подключена успешно');
    } catch (error) {
        console.error('❌ Ошибка подключения к MongoDB:', error);
        // Не завершаем процесс, а ждем переподключения
        setTimeout(connectDB, 5000);
    }
};

// Обработка отключения
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB отключена. Попытка переподключения...');
    setTimeout(connectDB, 5000);
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Ошибка MongoDB:', err);
});