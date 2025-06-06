const { Router } = require('express');
const checkPermission = require('../middlewares/permissionMiddlewares');
const { getProfilePostsMetaData, getProfileComments, getSummary } = require('../controllers/profilesController.js');
const { createValidationMiddleware } = require('../middlewares/validationMiddlewares/validationMiddlewares.js');
const { profilePostQueryChain, profileCommentQueryChain } = require('../middlewares/validationMiddlewares/validationChains.js');
const createQueryOptionMiddleware = require('../middlewares/queryOptionMiddleware');

const profileRouter = Router();

const validatePostQueryParams = createValidationMiddleware(profilePostQueryChain);
const validateCommetnQueryParams = createValidationMiddleware(profileCommentQueryChain)

const buildPostQueryOption = createQueryOptionMiddleware({ 
    title: (req) => req.query?.search, 
    authorId: (req) => req.user.id,
    status: (req) => req.query?.status && `exact:${req.query?.status}`
})

const buildCommentQueryOption = createQueryOptionMiddleware({ 
    content: (req) => req.query?.search, 
    authorId: (req) => req.user.id
})

const attachContext = (req, res, next) => {
    req.context = { view: 'profile' };
    next();
};

profileRouter.get('/comments', validateCommetnQueryParams, attachContext, checkPermission, buildCommentQueryOption, getProfileComments);
profileRouter.get('/posts', validatePostQueryParams, attachContext, checkPermission, buildPostQueryOption, getProfilePostsMetaData);
profileRouter.get('/summary', checkPermission, getSummary)

module.exports = profileRouter;