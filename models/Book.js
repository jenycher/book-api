const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: null,
    },
    authors: {
        type: String,
        default: null,
    },
    favorite: {
        type: String,
        default: false,
    },
    fileCover: {
        type: String,
        default: null,
    },
    fileName: {
        type: String,
        default: null,
    },
    fileBook: {
        type: String,
        default: null,
    }
}, {
    timestamps: true, // добавляет поля createdAt и updatedAt
});

// Индексы для оптимизации поиска
bookSchema.index({ title: 'text', authors: 'text' });

module.exports = mongoose.model('Book', bookSchema);