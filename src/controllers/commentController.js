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

module.exports.getComments = asyncHandler(async (req, res, next) => {
    const { processedFilter, processedSorting, processedPagination } = req.queryOption;

    const { totalPages, comments } = await CommentService.getComments({ 
        filter: processedFilter, 
        sorting: processedSorting, 
        pagination: processedPagination
    });

    res.status(200).json({
        success: true,
        totalPages,
        comments
    });
});