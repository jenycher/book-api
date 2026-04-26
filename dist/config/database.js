"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Используем переменные окружения или значения по умолчанию
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_db';
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('✅ MongoDB подключена успешно');
    }
    catch (error) {
        console.error('❌ Ошибка подключения к MongoDB:', error);
        // Не завершаем процесс, а ждем переподключения
        setTimeout(exports.connectDB, 5000);
    }
};
exports.connectDB = connectDB;
// Обработка отключения
mongoose_1.default.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB отключена. Попытка переподключения...');
    setTimeout(exports.connectDB, 5000);
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('❌ Ошибка MongoDB:', err);
});
//# sourceMappingURL=database.js.map