const { Router } = require('express');
const PostService = require('../services/PostService.js');
const asyncHandler = require('express-async-handler');
const postController = require('../controllers/postController.js');
const checkPermission = require('../middlewares/permissionMiddlewares');
const { createValidationMiddleware } = require('../middlewares/validationMiddlewares/validationMiddlewares.js');
const { baseQueryParamsChain, postUpdateChain } = require('../middlewares/validationMiddlewares/validationChains.js');
const createQueryOptionMiddleware = require('../middlewares/queryOptionMiddleware');

const validateQueryParams = createValidationMiddleware(baseQueryParamsChain);
const validatePostUpdate = createValidationMiddleware(postUpdateChain);

const buildPostQueryOption = createQueryOptionMiddleware({ 
    status: () => 'exact:published', 
    title: (req) => req.query?.search 
})

const postRouter = Router();

postRouter.use(['/:postId', '/:postId/comments'], asyncHandler(async(req, res, next) => {
    if (!req.params?.postId) {
        return next();
    };

    const post = await PostService.getPostById(req.params.postId);
    req.data = post;

    return next();
}));


postRouter.post('/', checkPermission, postController.createPost); 

postRouter.post('/:postId/comments', checkPermission, postController.createComment); 

postRouter.patch('/:postId', 
    (req, res, next) => { req.data.newStatus = req.body?.status; next() },
    validatePostUpdate,
    checkPermission, 
    postController.updatePost
);

postRouter.delete('/:postId', checkPermission, postController.deletePost);

postRouter.get('/', 
    (req, res, next) => { req.context = { view: 'public' }; next() }, 
    validateQueryParams, 
    checkPermission, 
    buildPostQueryOption,
    postController.getPostsMetaData
);

postRouter.get('/:postId', 
    (req, res, next) => { req.context = { view: 'public' }; next() }, 
    checkPermission, 
    postController.getPostById
);

module.exports = postRouter;