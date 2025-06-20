const { Router } = require('express');
const { getPostsMetaData, getPublishedPost } = require('../controllers/postController.js');
const { getComments } = require('../controllers/commentController.js');

const { createValidationMiddleware } = require('../middlewares/validationMiddlewares/validationMiddlewares.js');
const { postQueryChain, commentQueryChain } = require('../middlewares/validationMiddlewares/validationChains.js');
const createQueryOptionMiddleware = require('../middlewares/queryOptionMiddleware');

const validateQueryParams = createValidationMiddleware(postQueryChain);
const validateCommentQueryParams = createValidationMiddleware(commentQueryChain);

const buildPostQueryOption = createQueryOptionMiddleware({ 
    status: () => 'exact:published', 
    title: (req) => req.query?.search 
});
const buildCommentQueryOption = createQueryOptionMiddleware({ 
    content: (req) => req.query?.search,
    postId: (req) => req.params?.postId,
    post: () => ({ status: 'exact:published' }),
});

const postRouter = Router();

postRouter.get('/', validateQueryParams, buildPostQueryOption, getPostsMetaData); 
postRouter.get('/:postId', getPublishedPost); 
postRouter.get('/:postId/comments', validateCommentQueryParams, buildCommentQueryOption, getComments);

module.exports = postRouter;