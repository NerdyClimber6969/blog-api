const { Router } = require('express');
const checkPermission = require('../middlewares/permissionMiddlewares');
const { getProfilePostsMetaData, getProfileComments, getSummary } = require('../controllers/profilesController.js');
const { createValidationMiddleware } = require('../middlewares/validationMiddlewares/validationMiddlewares.js');
const { baseQueryParamsChain } = require('../middlewares/validationMiddlewares/validationChains.js');
const createQueryOptionMiddleware = require('../middlewares/queryOptionMiddleware');

const profileRouter = Router();

const validateQueryParams = createValidationMiddleware(baseQueryParamsChain);

const buildPostQueryOption = createQueryOptionMiddleware({ 
    title: (req) => req.query?.search, 
    authorId: (req) => `exact:${req.user.id}` 
})

const buildCommentQueryOption = createQueryOptionMiddleware({ 
    content: (req) => req.query?.search, 
    authorId: (req) => `exact:${req.user.id}` 
})

const attachContext = (req, res, next) => {
    req.context = { view: 'profile' };
    next();
};

profileRouter.get('/comments', validateQueryParams, attachContext, checkPermission, buildCommentQueryOption, getProfileComments);
profileRouter.get('/posts', validateQueryParams, attachContext, checkPermission, buildPostQueryOption, getProfilePostsMetaData);
profileRouter.get('/summary', checkPermission, getSummary)

module.exports = profileRouter;