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
                post: {
                    select : {
                        title: true,
                        author: { select: { username: true } }
                    }
                },  
                author: {
                    select : {
                        username: true
                    }
                }                      
            }
        });

        return comment;
    };

    static async getComments({ filter = {}, sorting = {}, pagination = {} }) {
        const [total, comments] = await prisma.$transaction([
            prisma.comment.count({ where: filter }),
            prisma.comment.findMany({
                where: filter,
                ...pagination,
                orderBy: sorting,
                include: {
                    post: {
                        select : {
                            title: true,
                            author: { select: { username: true } }
                        }
                    }, 
                    author: {
                        select : {
                            username: true
                        }
                    }                   
                }
            })
        ]);

        
        return { 
            total, 
            comments
        };
    };

    static async getCommentById(commentId) {
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

    static async deleteCommentById(commentId) {
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