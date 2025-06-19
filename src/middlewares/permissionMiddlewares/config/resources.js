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
            [READ]: (user, post, context) => ((context.view === 'profile' && user.id === post.authorId) || (post.status === 'published' && context.view === 'public')),
            [UPDATE]: (user, post, context) => (user.id === post.authorId && context.newStatus !== 'banned'),
            [DELETE]: (user, post) => (user.id === post.authorId),
            [LIST]: true
        },
        visitor: {
            [READ]: (user, post, context) => (post.status === 'published' && context.view === 'public'),
            [LIST]: (user, post, context) => (context.view === 'public')
        }
    },
    comments: {
        admin: {
            [CREATE]: true,
            [DELETE]: true
        },
        user: {
            [CREATE]: (user, post) => (user.role === 'user' && post.status === 'published'),
            [DELETE]: (user, comment) => (user.id === comment.authorId),
            [LIST]: (user, post, context) => ((context.view === 'profile' && user.id === post.authorId) || (post.status === 'published' && context.view === 'public'))
        },
        visitor: {
            [LIST]: (user, comment, context) => (context.view === 'public')
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