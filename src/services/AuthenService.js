const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthenService {
    static async verifyPassword(password, hash) {
        if (!password || !hash) {
            return new TypeError('Password and hash must be provided');
        };

        const match = await bcryptjs.compare(password, hash);
        return match;
    };

    static generateToken(id, username, role, secretKey) {
        const exp = Date.now() + (60 * 60 * 1000);

        const token = jwt.sign(
            { id, username, role, exp }, 
            secretKey, 
        );

        return { token, exp };
    };
};

module.exports = AuthenService