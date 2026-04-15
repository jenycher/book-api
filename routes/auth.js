const express = require('express');
const router = express.Router();
const passport = require('passport');
const { v4: uuid } = require('uuid');
const User = require('../models/User');

// ============== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==============

// Middleware для проверки аутентификации
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // Если API запрос
    if (req.path.startsWith('/api/') || req.xhr) {
        return res.status(401).json({ message: 'Не авторизован' });
    }
    // Если веб-запрос
    res.redirect('/api/user/login');
};

// ============== ВЕБ-МАРШРУТЫ ==============

// GET /api/user/login - страница входа/регистрации
router.get('/login', (req, res) => {
    // Если уже авторизован, перенаправляем на профиль
    if (req.isAuthenticated()) {
        return res.redirect('/api/user/me');
    }
    
    res.render('auth/login', {
        title: 'Вход / Регистрация',
        message: req.query.message || null,
        error: null
    });
});

// GET /api/user/me - страница профиля
router.get('/me', ensureAuthenticated, (req, res) => {
    res.render('auth/profile', {
        title: 'Мой профиль',
        user: req.user,
        message: null
    });
});

// ============== API МАРШРУТЫ ==============

// POST /api/user/signup - регистрация
router.post('/signup', async (req, res) => {
    const { email, username, password, confirmPassword } = req.body;
    
    // Проверка на совпадение паролей
    if (password !== confirmPassword) {
        if (req.xhr || req.headers.accept?.includes('application/json')) {
            return res.status(400).json({ message: 'Пароли не совпадают' });
        }
        return res.render('auth/login', {
            title: 'Вход / Регистрация',
            message: null,
            error: 'Пароли не совпадают'
        });
    }
    
    try {
        // Проверка существования пользователя
        const existingUser = await User.findOne({ 
            $or: [{ email: email.toLowerCase() }, { username: username }] 
        });
        
        if (existingUser) {
            const error = existingUser.email === email.toLowerCase() 
                ? 'Пользователь с таким email уже существует'
                : 'Пользователь с таким именем уже существует';
            
            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.status(400).json({ message: error });
            }
            return res.render('auth/login', {
                title: 'Вход / Регистрация',
                message: null,
                error: error
            });
        }
        
        // Создание нового пользователя
        const newUser = new User({
            id: uuid(),
            email: email.toLowerCase(),
            username: username,
            password: password
        });
        
        await newUser.save();
        
        // Автоматический вход после регистрации
        req.login(newUser, (err) => {
            if (err) {
                console.error('Ошибка входа после регистрации:', err);
                if (req.xhr || req.headers.accept?.includes('application/json')) {
                    return res.status(500).json({ message: 'Ошибка при входе' });
                }
                return res.redirect('/api/user/login?message=Регистрация прошла успешно, но не удалось войти автоматически');
            }
            
            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.status(201).json({
                    message: 'Регистрация прошла успешно',
                    user: {
                        id: newUser.id,
                        email: newUser.email,
                        username: newUser.username
                    }
                });
            }
            res.redirect('/api/user/me');
        });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        if (req.xhr || req.headers.accept?.includes('application/json')) {
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
        res.render('auth/login', {
            title: 'Вход / Регистрация',
            message: null,
            error: 'Ошибка при регистрации. Попробуйте позже.'
        });
    }
});

// POST /api/user/login - вход
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Ошибка аутентификации:', err);
            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.status(500).json({ message: 'Ошибка сервера' });
            }
            return res.render('auth/login', {
                title: 'Вход / Регистрация',
                message: null,
                error: 'Ошибка при входе'
            });
        }
        
        if (!user) {
            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.status(401).json({ message: info?.message || 'Неверный email или пароль' });
            }
            return res.render('auth/login', {
                title: 'Вход / Регистрация',
                message: null,
                error: info?.message || 'Неверный email или пароль'
            });
        }
        
        req.logIn(user, (loginErr) => {
            if (loginErr) {
                console.error('Ошибка входа:', loginErr);
                if (req.xhr || req.headers.accept?.includes('application/json')) {
                    return res.status(500).json({ message: 'Ошибка при входе' });
                }
                return res.render('auth/login', {
                    title: 'Вход / Регистрация',
                    message: null,
                    error: 'Ошибка при входе'
                });
            }
            
            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.json({
                    message: 'Вход выполнен успешно',
                    user: {
                        id: user.id,
                        email: user.email,
                        username: user.username
                    }
                });
            }
            res.redirect('/api/user/me');
        });
    })(req, res, next);
});

// GET /api/user/logout - выход
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Ошибка выхода:', err);
        }
        
        if (req.xhr || req.headers.accept?.includes('application/json')) {
            return res.json({ message: 'Выход выполнен успешно' });
        }
        res.redirect('/');
    });
});

// GET /api/user/check - проверка статуса аутентификации (для API)
router.get('/check', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: {
                id: req.user.id,
                email: req.user.email,
                username: req.user.username
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

module.exports = router;