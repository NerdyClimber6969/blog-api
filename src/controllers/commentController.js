const asyncHandler = require('express-async-handler');
const CommentService = require('../services/CommentService.js');

module.exports.deleteComment = asyncHandler(async(req, res, next) => {
    const { commentId } = req.params;

    const comment = await CommentService.deleteComment(commentId);
    
    return res.status(201).json({
        success: true,
        comment: comment,
    });
});