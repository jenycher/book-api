const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// Сериализация пользователя (сохраняем ID в сессию)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Десериализация пользователя (получаем пользователя по ID из сессии)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findOne({ id: id });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Локальная стратегия аутентификации
passport.use('local', new LocalStrategy(
    {
        usernameField: 'email', // используем email как имя пользователя
        passwordField: 'password',
    },
    async (email, password, done) => {
        try {
            // Ищем пользователя по email
            const user = await User.findOne({ email: email.toLowerCase() });
            
            if (!user) {
                return done(null, false, { message: 'Неверный email или пароль' });
            }
            
            // Проверяем пароль
            const isMatch = await user.comparePassword(password);
            
            if (!isMatch) {
                return done(null, false, { message: 'Неверный email или пароль' });
            }
            
            // Обновляем время последнего входа
            user.lastLogin = new Date();
            await user.save();
            
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

module.exports = passport;