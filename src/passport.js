const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserService = require('./services/UserService.js');
const AuthenService = require('./services/AuthenService.js');
const AuthError = require('./errors/AuthError.js');

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await UserService.getUserByUsername(username);
            if (!user) {
                throw new AuthError(`Incorrect username or password`);
            };
    
            const match = await AuthenService.verifyPassword(password, user.hash);
            if (!match) {
                throw new AuthError('Incorrect username or password');
            };
            
            done(null, user);
        } catch (error) {
            done(error, false);
        };
    })
);

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET,
        }, 
        (user, done) => {
            try {
                return done(null, user);
            } catch (error) {
                return done(error, false);
            } 
        }
    )
);

module.exports = passport;