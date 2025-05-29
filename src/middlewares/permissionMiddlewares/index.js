const PermissionSystem = require('../../permissionSystem/permissionSystem.js')
const config = require('./config');

const permissionSystem = new PermissionSystem().initialize(config);

function createPermissionMiddleware() {
    const permissionMiddleware = permissionSystem.createMiddleware();
    return permissionMiddleware;
};

const checkPermission = createPermissionMiddleware();

module.exports = checkPermission;