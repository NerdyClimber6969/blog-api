const asyncHandler = require('express-async-handler');
const PostService = require('../services/PostService.js');

module.exports.getPostsMetaData = asyncHandler(async(req, res, next) => {
    const { processedFilter, processedSorting, processedPagination } = req.queryOption;

    const { total, posts } = await PostService.getPostsMetaData({ 
        filter: processedFilter, 
        sorting: processedSorting, 
        pagination: processedPagination
    });

    return res.status(200).json({
        success: true,
        total,
        posts
    });
});

module.exports.getPublishedPost = asyncHandler(async(req, res, next) => {
    const { postId } = req.params;
    const post = await PostService.getPostById(postId, true);

    return res.status(200).json({
        success: true,
        post: post,
    });
});

module.exports.updatePost = asyncHandler(async(req, res, next) => {
    const { postId } = req.params;
    const { title, content, summary, status } = req.body;
    
    const post = await PostService.updatePost(postId, title, content, summary, status);

    res.status(200).json({
        success: true,
        userId: req.user.id,
        post: {
            id: post.id,
            title: post.title,
            content: post.content,
            status: post.status,
            updatedAt: post.updatedAt,
            summary: post.summary,
        }
    });
});

module.exports.createPost = asyncHandler(async(req, res, next) => {
    const { title, content } = req.body;
    const post = await PostService.createPost(title, content,  req.user.id);

    return res.status(201).json({
        success: true,
        post: post
    });
});

module.exports.deletePost = asyncHandler(async(req, res, next) => {
    const { postId } = req.params;
    const post = await PostService.deletePost(postId);

    return res.status(200).json({
        success: true,
        post: post
    });
});