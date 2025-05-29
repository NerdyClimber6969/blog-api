const bcryptjs = require('bcryptjs');
const prisma = require("../prisma/prismaClient.js");
const { AuthenticationError } = require('../errors/Error.js');
const { ResourceNotFoundError } = require('../errors/Error.js');

class UserService {
    static async getSummary(userId) {
        if (!userId) {
            throw new TypeError('user id must be provided!');
        };

        const [summary] = await prisma.$queryRaw`
            SELECT 
                t."authorId" as user_id,
                SUM(CASE WHEN data_type = 'published_post' THEN 1 ELSE 0 END) as published_posts,
                SUM(CASE WHEN data_type = 'drafted_post' THEN 1 ELSE 0 END) as drafted_posts,
                SUM(CASE WHEN data_type = 'comment' THEN 1 ELSE 0 END) as comments,
                SUM(CASE WHEN data_type <> 'comment' THEN "like" ELSE 0 END) post_likes,
                SUM(CASE WHEN data_type <> 'comment' THEN "dislike" ELSE 0 END) as post_dislikes,
                SUM(CASE WHEN data_type = 'comment' THEN "like" ELSE 0 END) as comment_likes,
                SUM(CASE WHEN data_type = 'comment' THEN "dislike" ELSE 0 END) as comment_dislikes
            FROM (
                SELECT "authorId", 'published_post' as data_type, "like", "dislike" FROM "Post" 
                WHERE status = 'published' AND "authorId" = ${userId}
                UNION ALL
                SELECT "authorId", 'drafted_post' as data_type, "like", "dislike" FROM "Post"
                WHERE status = 'drafted' AND "authorId" = ${userId}
                UNION ALL
                SELECT "authorId", 'comment' as data_type, "like", "dislike" FROM "Comment"
                WHERE "authorId" = ${userId}
            ) AS t
            GROUP BY user_id;
        `
        if (!summary) {
            throw new ResourceNotFoundError("user's summary not found", 'profiles', userId);
        };

        for (const key in summary) {
            if (typeof summary[key] === 'bigint') summary[key] = Number(summary[key]);
        };

        return summary;
    };

    static async getUserByUsername(username) {
        const user = await prisma.user.findUnique({ 
            where: { username: username }
        });

        return user;
    };

    static async createUser({ username, firstName, lastName, password, role='User'}) {
        if (!['User', 'Admin'].includes(role)) {
            throw new TypeError('Undifined role, only "User" or "Admin" allowed!');
        };

        // Check if user already exists
        const existingUser = await UserService.getUserByUsername(username);
        if (existingUser) {
            throw new AuthenticationError(
                'This username is already in use. Please choose a different username', 
                'user existed',
                409
            );
        };

        const hash = await bcryptjs.hash(password, 10);
        const newUser = await prisma.user.create({ 
            data: { username, firstName, lastName, hash } 
        });

        return newUser;
    };
};

module.exports = UserService;