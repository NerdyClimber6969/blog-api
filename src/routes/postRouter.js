const { Router } = require('express');
const PostService = require('../services/PostService.js');
const asyncHandler = require('express-async-handler');
const postController = require('../controllers/postController.js');
const permissionSystem = require('../permission/permissionSystem.js')

const hasPermission = permissionSystem.createMiddleware();

const postRouter = Router();

postRouter.use(['/:postId', '/:postId/comments', '/:postId/status'], asyncHandler(async(req, res, next) => {
    if (!req.params?.postId) {
        return next();
    };

    const post = await PostService.getPost(req.params.postId);
    req.data = post;

    return next();
}));

postRouter.post('/', hasPermission, postController.createPost); 

postRouter.post('/:postId/comments', hasPermission, postController.createComment); 

postRouter.patch('/:postId', hasPermission, postController.updatePost);
postRouter.delete('/:postId', hasPermission, postController.deletePost);

postRouter.patch('/:postId/status', hasPermission, postController.updatedPostStatus);

postRouter.get('/', hasPermission, postController.getPostsList);
postRouter.get('/:postId', hasPermission, postController.getPostContent);

module.exports = postRouter;