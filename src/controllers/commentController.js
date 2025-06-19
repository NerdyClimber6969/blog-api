const asyncHandler = require('express-async-handler');
const CommentService = require('../services/CommentService.js');

module.exports.deleteCommentById = asyncHandler(async(req, res, next) => {
    const { commentId } = req.params;

    const comment = await CommentService.deleteCommentById(commentId);
    
    return res.status(201).json({
        success: true,
        comment: comment
    });
});

module.exports.createComment = asyncHandler(async(req, res, next) => {
    const { postId } = req.params;
    const { content } = req.body;

    const comment = await CommentService.createComment(content, postId, req.user.id);
    
    return res.status(201).json({
        success: true,
        comment: comment,
    });
});

module.exports.getComments = asyncHandler(async (req, res, next) => {
    const { processedFilter, processedSorting, processedPagination } = req.queryOption;

    const { total, comments } = await CommentService.getComments({ 
        filter: processedFilter, 
        sorting: processedSorting, 
        pagination: processedPagination
    });

    res.status(200).json({
        success: true,
        total,
        comments
    });
});