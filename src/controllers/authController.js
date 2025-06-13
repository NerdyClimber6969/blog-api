const asyncHandler = require('express-async-handler');
const { localAuthen } = require('../middlewares/authenMiddlewares.js');
const AuthenService = require('../services/AuthenService.js');
const UserService = require('../services/UserService.js');
const { AuthenticationError } = require('../errors/Error.js');
const jwt = require('jsonwebtoken');
const { signUpChain } = require('../middlewares/validationMiddlewares/validationChains.js');
const { createValidationMiddleware } = require('../middlewares/validationMiddlewares/validationMiddlewares.js');

const register = [
    createValidationMiddleware(signUpChain),
    asyncHandler(async(req, res, next) => {
        const { id, username, role } = await UserService.createUser(req.body);

        res.status(201).json({
            success: true,
            user: { id, username, role }
        });
    })
];

const login = [
    localAuthen,
    (req, res, next) => {
        const { id, username, role } = req.user;
        const accessToken = AuthenService.generateToken(id, username, role, process.env.SECRET);

        const cookieOption = {
            httpOnly: true,
            domain: process.env.COOKIE_DOMAIN || 'localhost',
            secure: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging',
            path: '/',
            maxAge: 1000 * 60 * 60,
        };
        (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') && (cookieOption.sameSite = 'None');

        res.cookie('accessToken', accessToken, cookieOption);

        return res.status(201).json({      
            success: true,
            username: username,
        });
    }
];

function logout(req, res, next) {
    res.clearCookie('accessToken', {
        httpOnly: true,
        path: '/'
    });

    return res.status(200).json({      
        success: true,
    });
};

function verifyStatus(req, res, next) {
    if (!req.cookies.accessToken) {
        return next(new AuthenticationError('No token was provided', 'token missing'));
    };

    const accessToken = jwt.verify(req.cookies.accessToken, process.env.SECRET, { ignoreExpiration: true });
    if (!accessToken) {
        return next(new AuthenticationError('Signature verification failed', 'invalid token'));
    };

    const timeNow = Math.floor(Date.now() / 1000);

    if (accessToken.exp <= timeNow) {
        return next(new AuthenticationError('Token passed its expiration time', 'token expired'));
    };

    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
    });

    return res.status(200).json({
        success: true,
        isAuthenticated: true,
        expired: false,
        username: accessToken.username
    });
};

module.exports = { register, login, logout, verifyStatus };