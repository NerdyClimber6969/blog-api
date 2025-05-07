const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const UserService = require('./services/UserService.js');
const AuthenService = require('./services/AuthenService.js');
const { AuthenticationError } = require('./errors/Error.js');

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await UserService.getUserByUsername(username);
            if (!user) {
                throw new AuthenticationError('Incorrect username or password', 'invalid credential');
            };
    
            const match = await AuthenService.verifyPassword(password, user.hash);
            if (!match) {
                throw new AuthenticationError('Incorrect username or password', 'invalid credential');
            };
            
            done(null, user);
        } catch (error) {
            done(error, false);
        };
    })
);

function cookieExtractor(req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.accessToken;
    };

    return token;
};

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: cookieExtractor,
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