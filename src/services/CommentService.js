const prisma = require("../prisma/prismaClient.js");
const QueryConditionBuilder = require('../utils/QueryConditionBuilder.js');
const { ResourceNotFoundError } = require('../errors/Error.js');

const queryConditionBuilder = new QueryConditionBuilder(Object.keys(prisma.comment.fields));

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

    static async getComments({ filter = {}, sorting = {}, pagination = {} }) {
        const { orderBy='createdAt', orderDir='desc' } = sorting;
        const conditions = queryConditionBuilder.buildConditions({ filter, sorting:{ orderBy, orderDir }, pagination });
        const { processedFilter, processedSorting, processedPagination } = conditions;

        const [total, comments] = await prisma.$transaction([
            prisma.comment.count({ where: processedFilter }),
            prisma.comment.findMany({
                where: processedFilter,
                ...processedPagination,
                orderBy: processedSorting,
                include: {
                    post: {
                        select : {
                            title: true,
                            author: { select: { username: true } }
                        }
                    },                    
                }
            })
        ]);

        const totalPages = processedPagination ? Math.ceil(total / processedPagination.take) : 1;
        
        return { 
            totalPages, 
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