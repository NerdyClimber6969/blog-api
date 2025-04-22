const policyRegistry = require('../policy/PolicyRegistry.js');
const AuthError = require('../errors/AuthError.js');

class AuthorService {
    #policyRegistry

    constructor(policyRegistry) {
        this.#policyRegistry = policyRegistry;
    };

    hasPermission(policyName, user, action, data, environment) {
        const policy = this.#policyRegistry.get(policyName);
        if (!policy) {
            throw new Error('Policy not found');
        };

        const hasPermission = policy.evaluate(user, action, data, environment);

        if (!hasPermission) {
            throw new AuthError('Access denied, you are not allowed to access this resource', 403);
        };

        return hasPermission;
    };
};

const authorService = new AuthorService(policyRegistry);
module.exports = authorService;