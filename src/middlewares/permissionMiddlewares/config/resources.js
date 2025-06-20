const { CREATE, READ, UPDATE, DELETE, LIST } = require('./actions');

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
            [READ]: (user, post) => user.id === post.authorId,
            [UPDATE]: (user, post, context) => (user.id === post.authorId && context.newStatus !== 'banned'),
            [DELETE]: (user, post) => (user.id === post.authorId),
            [LIST]: true
        },
    },
    comments: {
        admin: {
            [CREATE]: true,
            [DELETE]: true
        },
        user: {
            [CREATE]: (user, post) => post.status === 'published',
            [DELETE]: (user, comment) => (user.id === comment.authorId),
            [LIST]: true 
        }
    },
    summary: {
        admin: {
            [READ]: true
        },
        user: {
            [READ]: true
        }
    }
};