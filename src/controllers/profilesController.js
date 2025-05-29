const asyncHandler = require('express-async-handler');
const PostService = require('../services/PostService.js');
const CommentService = require('../services/CommentService.js');
const UserService = require('../services/UserService.js');

module.exports.getProfilePostsMetaData = asyncHandler(async(req, res, next) => {
    const { processedFilter, processedSorting, processedPagination } = req.queryOption;

    const { totalPages, posts } = await PostService.getPostsMetaData({ 
        filter: processedFilter, 
        sorting: processedSorting, 
        pagination: processedPagination 
    });

    return res.status(200).json({
        success: true,
        totalPages,
        posts
    });
})

module.exports.getProfileComments = asyncHandler(async(req, res, next) => {
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
})

module.exports.getSummary = asyncHandler(async(req, res, next) => {
    const summary = await UserService.getSummary(req.user.id);

    res.status(200).json({
        success: true,
        post: {
            quantity: {
                total: summary.published_posts + summary.drafted_posts,
                published: summary.published_posts,
                draft: summary.drafted_posts,
            },
            likes: summary.post_likes,
            dislikes: summary.post_dislikes
        },
        comment: {
            quantity: { total: summary.comments },
            likes: summary.comment_likes,
            dislikes: summary.comment_dislikes
        },
    });
});