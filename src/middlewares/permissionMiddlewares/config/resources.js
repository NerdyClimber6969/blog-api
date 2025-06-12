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
            [READ]: (user, post) => (
                (user.id === post.authorId || post.status === 'published') &&
                post.status !== 'banned'
            ),
            [UPDATE]: (user, post, context) => (
                user.id === post.authorId &&    
                post.status !== 'banned' && 
                context.newStatus !== 'banned'
            ),
            [DELETE]: (user, post) => (
                user.id === post.authorId && 
                post.status !== 'banned'
            ),
            [LIST]: true
        },
        visitor: {
            [READ]: (user, post) => (post.status === 'published'),
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
            [LIST]: true
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