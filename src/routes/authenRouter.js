const { Router } = require('express');
const authController = require('../controllers/authController.js');
const authenRouter = Router();

authenRouter.post('/sign-up', authController.register);
authenRouter.post('/login', authController.login);
authenRouter.post('/logout', authController.logout);
authenRouter.get('/verify', authController.verifyStatus);

module.exports = authenRouter;