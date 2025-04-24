const { user } = require('../../prisma/prismaClient');
const { CREATE, READ, UPDATE, DELETE, LIST, LOGOUT } = require('./actions');

module.exports = {
    posts: {
        admin: {
            [CREATE]: true,
            [READ]: true,
            [UPDATE]: true,
            [DELETE]: true,
            [LIST]: true
        },
        user: {
            [CREATE]: true,
            [READ]: (user, post) => (
                (user.id === post.authorId || post.status === 'published') &&
                post.status !== 'banned'
            ),
            [UPDATE]: (user, post) => (
                user.id === post.authorId &&    
                post.status !== 'banned'
            ),
            [DELETE]: (user, post) => (
                user.id === post.authorId && 
                post.status !== 'banned'
            ),
            [LIST]: true
        },
        visitor: {
            [READ]: (user, post) => (post.status === 'published'),
            [LIST]: true
        }
    },
    comments: {
        admin: {
            [CREATE]: true,
            [DELETE]: true
        },
        user: {
            [CREATE]: (user, post) => (user.role === 'user' && post.status === 'published'),
            [DELETE]: (user, comment) => (user.id === comment.authorId) 
        }
    },
    profiles: {
        admin: {
            [READ]: true
        },
        user: {
            [READ]: true
        }
    },
    status: {
        admin: {
            [UPDATE]: true
        },
        user: {
            [UPDATE]: (user, post) => (
                user.id === post.authorId && 
                post.newStatus !== 'banned'
            )
        }
    }
};