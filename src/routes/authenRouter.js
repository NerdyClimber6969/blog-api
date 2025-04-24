const { Router } = require('express');
const authController = require('../controllers/authController.js');
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError.js');

const authenRouter = Router();

authenRouter.use((req, res, next) => {
    const path = req.path;

    if (path === '/sign-up' || path === '/login') {
        return next();
    };

    if (path === '/logout' || path === '/verify') {
        if (!req.cookies.accessToken) {
            return next(new AuthError('No token found', 401));
        };

        const accessToken = jwt.verify(req.cookies.accessToken, process.env.SECRET, { ignoreExpiration: true });
        if (!accessToken) {
            return next(new AuthError('Invalid token or please login before continue', 403));
        };

        req.user = accessToken;
        return next();
    };

    return next();
});

authenRouter.post('/sign-up', authController.register);
authenRouter.post('/login', authController.login);
authenRouter.post('/logout', authController.logout);
authenRouter.get('/verify', authController.verifyStatus);

module.exports = authenRouter;