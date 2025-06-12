const { Router } = require('express');
const CommentService = require('../services/CommentService.js');
const asyncHandler = require('express-async-handler');
const commentController = require('../controllers/commentController.js');
const checkPermission = require('../middlewares/permissionMiddlewares');
const { createValidationMiddleware } = require('../middlewares/validationMiddlewares/validationMiddlewares.js');
const { commentQueryChain } = require('../middlewares/validationMiddlewares/validationChains.js');
const createQueryOptionMiddleware = require('../middlewares/queryOptionMiddleware');
const commentRouter = Router();

const validateCommentQueryParams = createValidationMiddleware(commentQueryChain);
const buildCommentQueryOption = createQueryOptionMiddleware({ 
    content: (req) => req.query?.search,
    postId: (req) => req.query?.postId
})

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
    validateCommentQueryParams, 
    (req, res, next) => { req.permissionContext = { view: 'public' }; next(); },
    checkPermission,
    buildCommentQueryOption,
    commentController.getComments
);

module.exports = commentRouter;