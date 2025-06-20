const passport = require('../passport.js');
const { AuthenticationError } = require('../errors/Error.js');

module.exports.localAuthen = passport.authenticate('local', { session: false });

module.exports.jwtAuthen = (req, res, next) => {
    passport.authenticate(
        'jwt', 
        { session: false },
        (err, user, info) => {
            try {
                if (!user) {
                    throw new AuthenticationError('You are not authenticated to access this resource', info.message);
                };

                if (user.exp < Math.floor(Date.now() / 1000)) {
                    throw new AuthenticationError('Token passed its expiration time', 'Token expired');
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