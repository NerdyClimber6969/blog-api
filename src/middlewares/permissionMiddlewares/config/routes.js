const { CREATE, READ, UPDATE, DELETE, LIST } = require('./actions');

module.exports = [
    { 
        route: '/posts', 
        method: 'GET', 
        resource: 'posts', 
        action: LIST,
        dataExtractor: req => req.data,
        contextAttacher: (req, context) => context.view = 'public'
    },
    { 
        route: '/posts/:postId', 
        method: 'GET', 
        resource: 'posts', 
        action: READ,
        dataExtractor: req => req.data,
        contextAttacher: (req, context) => context.view = 'public'
    },
    {
        route: '/posts/:postId/comments',
        method: 'GET',
        resource:'comments',
        action: LIST,
        dataExtractor: req => req.data,
        contextAttacher: (req, context) => context.view = 'public'
    },
    { 
        route: '/users/posts/:postId/comments', 
        method: 'POST', 
        resource: 'comments', 
        action: CREATE,
        dataExtractor: req => req.data
    },
    { 
        route: '/users/posts', 
        method: 'GET', 
        resource: 'posts', 
        action: LIST,
        dataExtractor: req => req.data,
        contextAttacher: (req, context) => context.view = 'profile'
    },
    { 
        route: '/users/posts', 
        method: 'POST', 
        resource: 'posts', 
        action: CREATE,
        dataExtractor: req => req.data
    },
    { 
        route: '/users/posts/:postId', 
        method: 'PATCH', 
        resource: 'posts', 
        action: UPDATE,
        dataExtractor: req => req.data,
        contextAttacher: (req, context) => req.body?.status && (context.newStatus = req.body.status)
    },
    { 
        route: '/users/posts/:postId', 
        method: 'DELETE', 
        resource: 'posts', 
        action: DELETE,
        dataExtractor: req => req.data
    },
    { 
        route: '/users/posts/:postId', 
        method: 'GET', 
        resource: 'posts', 
        action: READ,
        dataExtractor: req => req.data ,
        contextAttacher: (req, context) => context.view = 'profile'
    },
    { 
        route: '/users/comments', 
        method: 'GET', 
        resource: 'comments', 
        action: LIST,
        dataExtractor: req => req.data,
        contextAttacher: (req, context) => context.view = 'profile'
    },
    { 
        route: '/users/comments/:commentId', 
        method: 'DELETE', 
        resource: 'comments', 
        action: DELETE,
        dataExtractor: req => req.data
    },
    { 
        route: '/users/summary', 
        method: 'GET', 
        resource: 'summary', 
        action: READ,
        dataExtractor: req => req.data,
        contextAttacher: (req, context) => context.view = 'profile'
    }
];