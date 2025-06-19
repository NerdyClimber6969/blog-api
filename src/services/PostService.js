const prisma = require('../prisma/prismaClient.js');
const { ResourceNotFoundError } = require('../errors/Error.js');

class PostService {
    static async getPostsMetaData({ filter = {}, sorting = {}, pagination = {} }) {
        const [total, posts] = await prisma.$transaction([
            prisma.post.count({ where: filter }),
            prisma.post.findMany({
                where: filter,
                ...pagination,
                include: {
                    author: {
                        select: {
                            username: true
                        }
                    }
                },
                omit: {
                    content: true
                },
                orderBy: sorting
            })
        ]);
        
        return { 
            total,
            posts 
        };
    };

    static async updatePost(postId, title, content, summary, status) {
        const post = await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                title,
                content,
                summary,
                status,
            }
        });

        if (!post) {
            throw new ResourceNotFoundError('Post not found', 'posts', postId);
        };
        
        return post;
    };

    static async createPost(title, content=null, userId) {
        const post = await prisma.post.create({
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

    static async getPostById(postId, publishedOnly=true) {
        if (!postId || typeof postId !== 'string') {
            throw new TypeError('postId is required and must be a string of uuid');
        };

        const filter = publishedOnly ? { id: postId, status: 'published' } : { id: postId };
        const post = await prisma.post.findUnique({
            where: filter,
            include: {
                author: {
                    select: { username: true }
                }
            }
        });

        if (!post) {
            throw new ResourceNotFoundError('Post not found', 'posts', postId);
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
            throw new ResourceNotFoundError('Post not found', 'posts', postId);
        };

        return post;
    };
};

module.exports = PostService;