const { body, query } = require('express-validator');

const signUpChain = [
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
        .custom((value, { req }) => value === req.body.password).withMessage("passwords didn't matched, try again")
];

const commentCreationChain = [
    body('content').trim()
        .exists({ values: 'falsy' }).withMessage('content must be provided and not be empty')
        .isString().withMessage('content must be a string')
];

const postCreationChain = [
    body('title').trim()
        .exists({ values: 'falsy' }).withMessage('title must be provided and not be empty')
        .isString().withMessage('title must be a string')
];

const postUpdateChain =  [
    body('title').optional().trim()
        .notEmpty().withMessage('title must not be empty')
        .isString().withMessage('title must be a string'),
    body('summary').optional().trim()
        .isString().withMessage('summary must be a string'),
    body('content').optional().trim()
        .isString().withMessage('content must be a string'),
    body('status').optional().trim().toLowerCase()
        .isString().withMessage('status must be a string')
        .isIn(['drafted', 'published', 'archived', 'banned']).withMessage('status can only be drafted, published, archived or banned'), 
];

const baseQueryParamsChain = [ 
    query('orderDir').optional().trim()
        .isString().withMessage('orderDir must be string')
        .isIn(['asc', 'desc']).withMessage('orderDir can only be asc and desc'),
    query('page').optional().trim()
        .isInt({ gt: 0 }).withMessage('page can only be positive integer'),
    query('pageSize').optional().trim()
        .isInt({ gt: 0 }).withMessage('pageSize can only be positive integer'),
    query('search').optional().trim()
        .isString().withMessage('search must be an string'),
];

const postQueryChain = [
    query('orderBy').optional().trim()
        .isString().withMessage('orderBy must be string')
        .isIn(['createdAt', 'updatedAt', 'like', 'dislike', 'title']).withMessage('invalid query value'),
    ...baseQueryParamsChain
];

const profilePostQueryChain = [
    query('status').optional().trim().toLowerCase()
        .isString().withMessage('status must be a string')
        .isIn(['drafted', 'published', 'archived', 'banned']).withMessage('status can only be drafted, published, archived or banned'),
    ...postQueryChain
];

const profileCommentQueryChain = [
    query('orderBy').optional().trim()
        .isString().withMessage('orderBy must be string')
        .isIn(['createdAt', 'updatedAt', 'like', 'dislike', 'content']).withMessage('invalid query value'),
    ...baseQueryParamsChain
];

const commentQueryChain = [
    query('postId').optional().trim()
        .isString().withMessage('postId must be string'),
    ...profileCommentQueryChain
];

module.exports = { 
    signUpChain, 
    postUpdateChain, 
    postQueryChain, 
    commentQueryChain, 
    profilePostQueryChain, 
    profileCommentQueryChain, 
    commentCreationChain,
    postCreationChain
};