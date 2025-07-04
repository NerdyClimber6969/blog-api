const { Router } = require('express');

const { loadPost, loadComment } = require('../middlewares/loaderMiddlewares.js');
const checkPermission = require('../middlewares/permissionMiddlewares/index.js');

const { createValidationMiddleware } = require('../middlewares/validationMiddlewares/validationMiddlewares.js');
const { profilePostQueryChain, profileCommentQueryChain, postUpdateChain, commentCreationChain, postCreationChain } = require('../middlewares/validationMiddlewares/validationChains.js');
const createQueryOptionMiddleware = require('../middlewares/queryOptionMiddleware/index.js');

const { jwtAuthen } = require('../middlewares/authenMiddlewares.js');

const { getSummary } = require('../controllers/summaryController.js');
const { getPostsMetaData, createPost, updatePost, deletePost } = require('../controllers/postController.js');
const { getComments, createComment, deleteCommentById } = require('../controllers/commentController.js');

const usersRouter = Router();

const validatePostQueryParams = createValidationMiddleware(profilePostQueryChain);
const validateCommetnQueryParams = createValidationMiddleware(profileCommentQueryChain);
const validatePostUpdate = createValidationMiddleware(postUpdateChain);
const validateCommentCreation = createValidationMiddleware(commentCreationChain);
const validatePostCreation = createValidationMiddleware(postCreationChain)

const buildPostQueryOption = createQueryOptionMiddleware({ 
    title: (req) => req.query?.search, 
    authorId: (req) => req.user.id,
    status: (req) => req.query?.status && `exact:${req.query?.status}`
});

const buildCommentQueryOption = createQueryOptionMiddleware({ 
    content: (req) => req.query?.search, 
    authorId: (req) => req.user.id
});

usersRouter.use('/', jwtAuthen);

usersRouter.get('/posts', validatePostQueryParams, checkPermission, buildPostQueryOption, getPostsMetaData ); 
usersRouter.post('/posts', validatePostCreation, checkPermission, createPost);

usersRouter.use(['/posts/:postId', '/posts/:postId/comments'], loadPost);
usersRouter.post('/posts/:postId/comments', validateCommentCreation, checkPermission, createComment);
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