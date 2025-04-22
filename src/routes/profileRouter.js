const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const permissionSystem = require('../permission/permissionSystem.js')
const UserService = require('../services/UserService.js');

const profileRouter = Router();

profileRouter.use(permissionSystem.createMiddleware());

profileRouter.get('/', asyncHandler(async(req, res, next) => {
    const profile = await UserService.getUserProfileById(req.user.id);

    return res.json({
        success: true,
        profile: profile,
    });
}));

module.exports = profileRouter;