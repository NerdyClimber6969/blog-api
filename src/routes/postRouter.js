const { Router } = require('express');
const { getPostsMetaData, getPublishedPost } = require('../controllers/postController.js');
const { getComments } = require('../controllers/commentController.js');

const { createValidationMiddleware } = require('../middlewares/validationMiddlewares/validationMiddlewares.js');
const { postQueryChain, commentQueryChain } = require('../middlewares/validationMiddlewares/validationChains.js');
const createQueryOptionMiddleware = require('../middlewares/queryOptionMiddleware');

const validateQueryParams = createValidationMiddleware(postQueryChain);
const validateCommentQueryParams = createValidationMiddleware(commentQueryChain);

const { loadPost } = require('../middlewares/loaderMiddlewares.js');
const checkPermission = require('../middlewares/permissionMiddlewares');

const buildPostQueryOption = createQueryOptionMiddleware({ 
    status: () => 'exact:published', 
    title: (req) => req.query?.search 
});
const buildCommentQueryOption = createQueryOptionMiddleware({ 
    content: (req) => req.query?.search,
    postId: (req) => req.query?.postId,
});

const postRouter = Router();

postRouter.get('/', validateQueryParams, buildPostQueryOption, getPostsMetaData);
postRouter.get('/:postId', getPublishedPost);
postRouter.get('/:postId/comments', validateCommentQueryParams, loadPost, checkPermission, buildCommentQueryOption, getComments);

module.exports = postRouter;