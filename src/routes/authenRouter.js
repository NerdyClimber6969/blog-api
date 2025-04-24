const { Router } = require('express');
const authController = require('../controllers/authController.js');
const AuthError = require('../errors/AuthError.js');

const authenRouter = Router();

authenRouter.use((req, res, next) => {
    const path = req.path;

    if (path === '/sign-up' || path === 'login') {
        return next();
    };
    
    if (path === '/logout') {
        if (!req.user || !req.user.id) {
            const error = new AuthError('Please login before proceed');
            return next(error);
        };

        return next();
    };

    return next();
});

authenRouter.post('/sign-up', authController.register);
authenRouter.post('/login', authController.login);
authenRouter.post('/logout', authController.logout);

module.exports = authenRouter;