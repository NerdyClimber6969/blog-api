const { CREATE, READ, UPDATE, DELETE, LIST } = require('./actions');

module.exports = [
    { 
        route: '/posts', 
        method: 'POST', 
        resource: 'posts', 
        action: CREATE,
        dataExtractor: req => req.data
    },
    { 
        route: '/posts', 
        method: 'GET', 
        resource: 'posts', 
        action: LIST,
        dataExtractor: req => req.data
    },
    { 
        route: '/posts/:postId', 
        method: 'PATCH', 
        resource: 'posts', 
        action: UPDATE,
        dataExtractor: req => req.data
    },
    { 
        route: '/posts/:postId', 
        method: 'GET', 
        resource: 'posts', 
        action: READ,
        dataExtractor: req => req.data
    },
    { 
        route: '/posts/:postId', 
        method: 'DELETE', 
        resource: 'posts', 
        action: DELETE,
        dataExtractor: req => req.data
    },
    { 
        route: '/posts/:postId/comments', 
        method: 'POST', 
        resource: 'comments', 
        action: CREATE,
        dataExtractor: req => req.data
    },
    { 
        route: '/comments/:commentId', 
        method: 'DELETE', 
        resource: 'comments', 
        action: DELETE,
        dataExtractor: req => req.data
    },
    { 
        route: '/posts/:postId/status', 
        method: 'PATCH', 
        resource: 'status', 
        action: UPDATE,
        dataExtractor: req => req.data
    },
    { 
        route: '/profiles', 
        method: 'GET', 
        resource: 'profiles', 
        action: READ,
        dataExtractor: req => req.data 
    }
];