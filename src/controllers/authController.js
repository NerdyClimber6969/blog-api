const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { localAuthen } = require('../middlewares/authenMiddlewares.js');
const AuthenService = require('../services/AuthenService.js');
const UserService = require('../services/UserService.js');
const { AuthenticationError } = require('../errors/Error.js');
const { ValidationError } = require('../errors/Error.js');
const jwt = require('jsonwebtoken');

const validateUserData = [
    body('firstName').trim()
        .notEmpty().withMessage('enter your first name')
        .isAlpha().withMessage('first name can only contain a-zA-Z'),
    body('lastName').trim()
        .notEmpty().withMessage('enter your last name')
        .isAlpha().withMessage('last name can only contain a-zA-Z'),
    body('username').trim()
        .notEmpty().withMessage('enter your username')
        .isAlphanumeric().withMessage('username can only containe a-zA-Z0-9 ')
        .isLength({min: 8, max: 15}).withMessage('length of username should between 8 to 15 characters'),
    body('password').trim()
        .notEmpty().withMessage('enter your password')
        .isAlphanumeric().withMessage('password can only container a-zA-Z0-9 ')
        .isLength({min: 10, max: 20}).withMessage('length of username should between 10 to 20 characters'),
    body('confirm').trim()
        .notEmpty().withMessage('please confirm your password')
        .custom((value, { req }) => value === req.body.password).withMessage("passwords didn't matched, try again"),
];

const register = [
    validateUserData, 
    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError('Invalid inputs', errors.array());
        };

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

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            path: '/'
        });

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