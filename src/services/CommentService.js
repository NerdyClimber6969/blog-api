const prisma = require("../prisma/prismaClient.js");
const { ResourceNotFoundError } = require('../errors/Error.js');

class CommentService {
    static async createComment(content, postId, userId) {
        if (!content || !postId || !userId) {
            throw new TypeError('Content, post id and user id are required');
        };

        const comment = await prisma.comment.create({
            data: {
                content: content,
                postId: postId,
                authorId: userId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        return comment;
    };

    static async getComment(commentId) {
        if (!commentId || typeof commentId !== 'string') {
            throw new TypeError('comment id is required and must be a string of uuid');
        };

        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            throw new ResourceNotFoundError('Comment not found', 'comments', commentId);
        };

        return comment;
    }

    static async getCommentsByPostId(postId) {
        if (!postId || typeof postId !== 'string') {
            throw new TypeError('post id is required and must be a string of uuid');
        };

        const comments = await prisma.comment.findMany({
            where: {
                postId: postId
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        if (!comments) {
            throw new ResourceNotFoundError('No comment found in this post', 'comments', postId);
        };

        return comments;
    };

    static async deleteComment(commentId) {
        if (!commentId || typeof commentId !== 'string') {
            throw new TypeError('comment id is required and must be a string of uuid');
        };

        const comment = await prisma.comment.delete({
            where: { id: commentId },
            include: {
                post: {
                    select: {
                        title: true,
                        author: {
                            select: {
                                username: true
                            }
                        }
                    }
                }
            }
        });

        if (!comment) {
            throw new ResourceNotFoundError('Comment not found', 'comments', commentId);
        };

        return comment;
    };
};

module.exports = CommentService;