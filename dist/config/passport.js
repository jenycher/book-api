"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passport = void 0;
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
const passport_local_1 = require("passport-local");
const User_model_1 = require("../models/User.model");
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_model_1.UserModel.findOne({ id });
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await User_model_1.UserModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return done(null, false, { message: 'Неверный email или пароль' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Неверный email или пароль' });
        }
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
//# sourceMappingURL=passport.js.map