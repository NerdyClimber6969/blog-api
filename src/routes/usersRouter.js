const { Router } = require('express');

const { loadPost, loadComment } = require('../middlewares/loaderMiddlewares.js');
const checkPermission = require('../middlewares/permissionMiddlewares/index.js');

const { createValidationMiddleware } = require('../middlewares/validationMiddlewares/validationMiddlewares.js');
const { profilePostQueryChain, profileCommentQueryChain, postUpdateChain } = require('../middlewares/validationMiddlewares/validationChains.js');
const createQueryOptionMiddleware = require('../middlewares/queryOptionMiddleware/index.js');

const { getSummary } = require('../controllers/summaryController.js');
const { getPostsMetaData, createPost, updatePost, deletePost } = require('../controllers/postController.js');
const { getComments, createComment, deleteCommentById } = require('../controllers/commentController.js');

const usersRouter = Router();

const validatePostQueryParams = createValidationMiddleware(profilePostQueryChain);
const validateCommetnQueryParams = createValidationMiddleware(profileCommentQueryChain);
const validatePostUpdate = createValidationMiddleware(postUpdateChain);

const buildPostQueryOption = createQueryOptionMiddleware({ 
    title: (req) => req.query?.search, 
    authorId: (req) => req.users.id,
    status: (req) => req.query?.status && `exact:${req.query?.status}`
});

const buildCommentQueryOption = createQueryOptionMiddleware({ 
    content: (req) => req.query?.search, 
    authorId: (req) => req.users.id
});

usersRouter.get('/posts', validatePostQueryParams, checkPermission, buildPostQueryOption, getPostsMetaData );
usersRouter.post('/posts', (req,res,next) => {console.log('this'); next()}, checkPermission, createPost); //works but need to add validation

usersRouter.use(['/posts/:postId', '/posts/:postId/comments'], loadPost);
usersRouter.post('/posts/:postId/comments', checkPermission, createComment); //works but need to add validation
usersRouter.patch('/posts/:postId', validatePostUpdate, checkPermission, updatePost); 
usersRouter.delete('/posts/:postId', checkPermission, deletePost);
usersRouter.get('/posts/:postId', checkPermission, (req, res, next) => {
    return res.status(200).json({
        success: true,
        post: req.data,
    });
});

usersRouter.get('/summary', checkPermission, getSummary);

usersRouter.get('/comments', validateCommetnQueryParams, checkPermission, buildCommentQueryOption, getComments);
usersRouter.delete('/comments/:commentId', loadComment, checkPermission, deleteCommentById);

module.exports = usersRouter;