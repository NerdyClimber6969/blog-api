const passport = require('../passport.js');
const AuthError = require('../errors/AuthError.js');

module.exports.localAuthen = passport.authenticate('local', { session: false });

module.exports.jwtAuthen = (req, res, next) => {
    passport.authenticate(
        'jwt', 
        { session: false },
        (err, user, info) => {
            try {
                if (!user) {
                    req.user = { role: 'visitor' };
                    return next();
                };

                if (user.exp < Math.floor(Date.now() / 1000)) {
                    throw new AuthError('Session expired');
                } else {
                    req.user = user;
                    return next();
                };
            } catch (err) {
                return next(err);
            };
        }
    )(req, res, next);
};