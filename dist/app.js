"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const database_1 = require("./config/database");
const passport_1 = require("./config/passport");
const books_routes_1 = __importDefault(require("./routes/books.routes"));
// Загрузка переменных окружения
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Session
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}));
// Passport
app.use(passport_1.passport.initialize());
app.use(passport_1.passport.session());
// Database
(0, database_1.connectDB)();
// Routes
app.use('/api/books', books_routes_1.default);
// Error handling
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Что-то пошло не так' });
});
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
//# sourceMappingURL=app.js.map