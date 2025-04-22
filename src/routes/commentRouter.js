const { Router } = require('express');
const CommentService = require('../services/CommentService.js');
const asyncHandler = require('express-async-handler');
const commentController = require('../controllers/commentController.js');
const permissionSystem = require('../permission/permissionSystem.js')

const commentRouter = Router();

commentRouter.use('/:commentId', asyncHandler(async(req, res, next) => {
    if (!req.params?.commentId) {
        return next();
    };

    const comment = await CommentService.getComment(req.params.commentId);
    req.data = comment;
    return next();
}));

commentRouter.delete('/:commentId', permissionSystem.createMiddleware(), commentController.deleteComment)

module.exports = commentRouter;