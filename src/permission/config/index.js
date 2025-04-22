const resources = require('./resources');
const routes = require('./routes');

module.exports = {
    resources,
    routes,
    actions: {
        CREATE: 'create',
        READ: 'read',
        UPDATE: 'update',
        DELETE: 'delete',
        LIST: 'list'
    }
};