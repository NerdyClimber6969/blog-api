const prisma = require("../prisma/prismaClient.js");
const ServiceError = require('../errors/ServiceError.js');

class PostService {
    static async getPostsList(userId, publishedOnly=true) {
        if (typeof userId === 'boolean') {
            publishedOnly = userId;
            userId = null;
        };
        userId = userId || null;

        if (userId && typeof userId !== 'string') {
            throw new TypeError('userId must be a string of uuid');
        };

        const filterCondition = {}
        if (userId) {
            filterCondition.authorId = userId;
        };

        if (publishedOnly) {
            filterCondition.status = 'published';
        };

        const postList = await prisma.post.findMany({
            where: { ...filterCondition },
            select: {
                id: true,
                title: true,
                summary: true,
                createdAt: true,
                author: {
                    select: {
                        username: true
                    }
                }
            }
        });

        return postList;
    };

    static async updatePostStatus(postId, status) {
        if (typeof status !== 'string') {
            throw new TypeError('Status must be string');
        };

        if (!['drafted', 'published', 'archived', 'banned'].includes(status)) {
            throw new TypeError('Undefined post status');
        };
        
        const post = prisma.post.update({
            where: {
                id: postId
            },
            data: {
                status
            }
        });

        if (!post) {
            throw new ServiceError('Post not found', 404);
        };

        return post;
    };

    static async updatePost(postId, title, content) {
        if (
            typeof postId !== 'string' ||
            typeof title !== 'string' ||
            typeof content !== 'string'
        ) {
            throw new TypeError('postId, title and content must be string');
        };

        const post = prisma.post.update({
            where: {
                id: postId
            },
            data: {
                title,
                content,
            }
        });

        if (!post) {
            throw new ServiceError('Post not found', 404);
        };
        
        return post;
    };

    static async createPost(title, content=null, userId) {
        const post = prisma.post.create({
            data: {
                title: title,
                content: content,
                authorId: userId
            },
            include: {
                author: {
                    select: {
                        username: true
                    }
                }
            }
        });

        return post;
    };

    static async getPost(postId) {
        if (!postId || typeof postId !== 'string') {
            throw new TypeError('postId is required and must be a string of uuid');
        };

        const post = await prisma.post.findUnique({
            where: { id: postId,},
            omit: { id: true }
        });

        if (!post) {
            throw new ServiceError('Post not found', 404);
        };

        return post;
    };

    static async deletePost(postId) {
        if (!postId || typeof postId !== 'string') {
            throw new TypeError('postId is required and must be a string of uuid');
        };

        const post = await prisma.post.delete({
            where: { id: postId }
        });

        if (!post) {
            throw new ServiceError('Post not found', 404);
        };

        return post;
    };
};

module.exports = PostService;