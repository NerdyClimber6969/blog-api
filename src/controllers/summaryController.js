const asyncHandler = require('express-async-handler');
const UserService = require('../services/UserService.js');

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