const bcryptjs = require('bcryptjs');
const prisma = require("../prisma/prismaClient.js");
const { AuthenticationError } = require('../errors/Error.js');

class UserService {
    static async getUserProfileById(userId) {
        const profile = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                posts: {
                    select: {
                        id: true,
                        title: true,
                        author: { select: { username: true } },
                        summary: true,
                        createdAt: true,
                        status: true,
                        like: true,
                        dislike: true
                    }
                },
                comments: {
                    select: {
                        id: true,
                        post: {
                            select : {
                                title: true,
                                author: { select: { username: true } }
                            }
                        },
                        content: true,
                        createdAt: true,
                        like: true,
                        dislike: true
                    }
                }
            }
        });
        
        return profile;
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