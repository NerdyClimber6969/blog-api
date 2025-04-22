const { body, validationResult } = require("express-validator");

const validation = {
    firstName: body('firstName').trim()
        .notEmpty().withMessage('enter your first name')
        .isAlpha().withMessage('first name can only contain a-zA-Z'),
    lastName: body('lastName').trim()
        .notEmpty().withMessage('enter your last name')
        .isAlpha().withMessage('last name can only contain a-zA-Z'),
    username: body('username').trim()
        .notEmpty().withMessage('enter your username')
        .isAlphanumeric().withMessage('username can only containe a-zA-Z0-9 ')
        .isLength({min: 8, max: 15}).withMessage('length of username should between 8 to 15 characters'),
    password: body('password').trim()
        .notEmpty().withMessage('enter your password')
        .isAlphanumeric().withMessage('password can only container a-zA-Z0-9 ')
        .isLength({min: 10, max: 20}).withMessage('length of username should between 10 to 20 characters'),
    confirm: body('confirm').trim()
        .notEmpty().withMessage('please confirm your password')
        .custom((value, { req }) => value === req.body.confirm).withMessage("passwords didn't matched, try again"),
};

function createValdationChain(...args) {
    const chainLength = args.length;
    const chain = Array(chainLength);

    for (let i = 0; i < chainLength; i++) {
        chain[i] = validation[args[i]];
    };

    return chain;
}
// const validateUserData = [
//     body('firstName').trim()
//         .notEmpty().withMessage('enter your first name')
//         .isAlpha().withMessage('first name can only contain a-zA-Z'),
//     body('lastName').trim()
//         .notEmpty().withMessage('enter your last name')
//         .isAlpha().withMessage('last name can only contain a-zA-Z'),
//     body('username').trim()
//         .notEmpty().withMessage('enter your username')
//         .isAlphanumeric().withMessage('username can only containe a-zA-Z0-9 ')
//         .isLength({min: 8, max: 15}).withMessage('length of username should between 8 to 15 characters'),
//     body('password').trim()
//         .notEmpty().withMessage('enter your password')
//         .isAlphanumeric().withMessage('password can only container a-zA-Z0-9 ')
//         .isLength({min: 10, max: 20}).withMessage('length of username should between 10 to 20 characters'),
//     body('confirm').trim()
//         .notEmpty().withMessage('please confirm your password')
//         .custom((value, { req }) => value === req.body.confirm).withMessage("passwords didn't matched, try again"),
// ];

module.exports = { createValdationChain, validationResult }