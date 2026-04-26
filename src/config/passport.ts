import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserModel } from '../models/User.model';

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await UserModel.findOne({ id });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
    },
    async (email: string, password: string, done) => {
        try {
            const user = await UserModel.findOne({ email: email.toLowerCase() });
            
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
        } catch (error) {
            return done(error);
        }
    }
));

export { passport };