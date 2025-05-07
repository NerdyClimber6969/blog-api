const asyncHandler = require('express-async-handler');
const PostService = require('../services/PostService.js');
const CommentService = require('../services/CommentService.js');

module.exports.getPostsList = asyncHandler(async(req, res, next) => {
    const postsList = await PostService.getPostsList(true);

    return res.json({
        success: true,
        posts: postsList,
    });
});

module.exports.updatePost = asyncHandler(async(req, res, next) => {
    const { postId } = req.params;
    const { title, content } = req.body;
    
    const post = await PostService.updatePost(postId, title, content);

    res.status(200).json({
        success: true,
        userId: req.user.id,
        post: {
            id: post.id,
            title: post.title,
            content: post.content,
            status: post.status,
            updatedAt: post.updatedAt
        }
    });
});

module.exports.updatedPostStatus = asyncHandler(async(req, res, next) => {
    const { postId } = req.params;
    const { status } = req.body;

    const post = await PostService.updatePostStatus(postId, status);

    res.status(200).json({
        success: true,
        userId: req.user.id,
        post: {
            id: post.id,
            title: post.title,
            content: post.content,
            status: post.status,
            updatedAt: post.updatedAt
        }
    });
});

module.exports.getPostContent = asyncHandler(async(req, res, next) => {
    const comments = await CommentService.getCommentsByPostId(req.params.postId);
    return res.status(200).json({
        success: true,
        post: req.data,
        comments: comments,
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

module.exports.createComment = asyncHandler(async(req, res, next) => {
    const { postId } = req.params;
    const { content } = req.body;

    const comment = await CommentService.createComment(content, postId, req.user.id);
    
    return res.status(201).json({
        success: true,
        comment: comment,
    });
});

