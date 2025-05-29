const { Router } = require('express');
const CommentService = require('../services/CommentService.js');
const asyncHandler = require('express-async-handler');
const commentController = require('../controllers/commentController.js');
const checkPermission = require('../middlewares/permissionMiddlewares');
const { createValidationMiddleware } = require('../middlewares/validationMiddlewares/validationMiddlewares.js');
const { baseQueryParamsChain } = require('../middlewares/validationMiddlewares/validationChains.js');
const createQueryOptionMiddleware = require('../middlewares/queryOptionMiddleware');
const commentRouter = Router();

const validateQueryParams = createValidationMiddleware(baseQueryParamsChain);

const buildCommentQueryOption = createQueryOptionMiddleware({ content: (req) => req.query?.search })

commentRouter.use('/:commentId', asyncHandler(async(req, res, next) => {
    if (!req.params?.commentId) {
        return next();
    };

    const comment = await CommentService.getCommentById(req.params.commentId);
    req.data = comment;
    return next();
}));

commentRouter.delete('/:commentId', checkPermission, commentController.deleteCommentById)

commentRouter.get('/', 
    validateQueryParams, 
    (req, res, next) => { req.context = { view: 'public' }; next(); },
    checkPermission,
    buildCommentQueryOption,
    commentController.getComments
);

module.exports = commentRouter;