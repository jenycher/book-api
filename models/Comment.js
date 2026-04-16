const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    bookId: {
        type: String,
        required: true,
        index: true,
    },
    userId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    userAvatar: {
        type: String,
        default: '?',
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Индекс для быстрого поиска комментариев книги
commentSchema.index({ bookId: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);