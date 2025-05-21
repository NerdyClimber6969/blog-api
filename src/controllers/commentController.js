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
    const { orderBy, orderDir, page, pageSize, ...filter } = req.query;

    const sorting = { orderBy, orderDir };
    const pagination = { page, pageSize };

    const { totalPages, comments } = await CommentService.getComments({ filter, sorting, pagination });

    res.status(200).json({
        success: true,
        totalPages,
        comments
    });
});