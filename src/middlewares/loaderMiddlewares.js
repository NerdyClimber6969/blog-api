const asyncHandler = require('express-async-handler');
const PostService = require('../services/PostService.js');
const CommentService = require('../services/CommentService.js');

/**
 * Loads a post by ID and attaches it to the request object
 */
const loadPost = asyncHandler(async(req, res, next) => {
    const { postId } = req.params;
    const post = await PostService.getPostById(postId, false);
    req.data = post;
    next();
});

/**
 * Loads a comment by ID and attaches it to the request object
 */
const loadComment = asyncHandler(async(req, res, next) => {
    const { commentId } = req.params;
    const comment = await CommentService.getCommentById(commentId);
    req.data = comment;
    next();
});

module.exports = {
    loadPost,
    loadComment
};