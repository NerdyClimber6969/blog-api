const config = require('./config');
const { AccessDeniedError }= require('../errors/Error.js');

class PermissionEvaluator {
    #config;
  
    constructor(config) {
        this.#config = config;
    }
  
    /**
    * Check if a user has permission to perform an action on a resource
    */
    can(resourceType, user, action, resource, context = {}) {
        // Default role if not specified
        const role = user?.role || 'visitor';
        
        const baseResult = {
            role: role,
            resourceType,
            requiredPermissions: action,
        };

        // Get resource config
        const resourceConfig = this.#config.resources[resourceType];
        if (!resourceConfig) {
            return {
                ...baseResult,
                granted: false,
                userPermissions: null,
                reason: 'Resource not found'
            };
        };
    
        // Get role-specific permissions for this resource
        const rolePermissions = resourceConfig[role];
            if (!rolePermissions) {
            return {
                ...baseResult,
                granted: false,
                userPermissions: null,
                reason: 'Role not allowed for this resource or not defined'
            };
        };
    
        // Get the specific permission rule
        const permissionRule = rolePermissions[action];
        const userPermissions = Object.keys(rolePermissions);
        // If no specific rule, check for default rule
        if (permissionRule === undefined) {
            return {
                ...baseResult,
                granted: false,
                userPermissions,
                reason: 'Action not allowed for this role or not defined'
            };
        };
    
        // If boolean permission
        if (typeof permissionRule === 'boolean') {
            return {
                ...baseResult,
                granted: permissionRule,
                userPermissions,
                reason: permissionRule ? 'Explicit allow' : 'Explicit deny'
            };
        };
    
        // If function permission
        if (typeof permissionRule === 'function') {
            const granted = permissionRule(user, resource, context);
            return {
                ...baseResult,
                granted,
                userPermissions,
                reason: granted ? 'Conditional allow' : 'Conditional deny'
            };
        };
    
        return false;
    };
};

/**
 * Permission system singleton that provides a clean API for permission checks
 */
class PermissionSystem {
    #evaluator;
    #actions;
    #routes;
  
    /**
    * Initialize the permission system with a config
    * @param {Object} config - The permission configuration
    */
    initialize(config) {
        this.#evaluator = new PermissionEvaluator(config);
        this.#actions = config.actions;
        this.#routes = config.routes;
        return this;
    };
  
    /**
    * Get the standard action types
    */
    get actions() {
        return this.#actions;
    };
  
    /**
    * Check if a user has permission for an action
    * @throws {Error} Throws an error if permission is denied
    */
    check(resource, user, action, data, context) {
        if (!this.#evaluator) {
            throw new Error('Permission system not initialized');
        };
        
        const result = this.#evaluator.can(resource, user, action, data, context);
        if (!result.granted) {
            throw new AccessDeniedError('You cannot access this resource', result);
        };
    
        return result.granted;
    };
  
    /**
    * Check if a user has permission without throwing errors
    * @returns {boolean} Whether the user has permission
    */
    can(resource, user, action, data, context) {
        if (!this.#evaluator) {
            throw new Error('Permission system not initialized');
        };
        
        const result = this.#evaluator.can(resource, user, action, data, context);
        return result.granted;
    };
  
    /**
    * Create middleware for Express
    * @param {Array} [customRouteMap] - Optional custom route mappings
    * @returns {Function} - Express middleware
    */
    createMiddleware(customRouteMap = []) {
        const hasPermission = this.check.bind(this);
        const routeMap = [...this.#routes, ...customRouteMap];
    
        return async (req, res, next) => {
            try {
                // Match the route to determine resource and action
                const fullPath = req.baseUrl + (req.route?.path === '/' ? '' : (req.route?.path || ''));
                
                const match = routeMap.find(mapping => 
                    mapping.method === req.method && mapping.route === fullPath
                );
                
                if (!match) {
                    return next();
                };
                
                // Extract the data using the custom extractor or default to req.body
                const data = match.dataExtractor ? match.dataExtractor(req) : req.body;
                
                // Get contextual information
                const context = {
                    ip: req.ip,
                    headers: req.headers,
                    params: req.params,
                    query: req.query
                };
                
                // Check permission
                hasPermission(match.resource, req.user, match.action, data, context);
                
                // Permission granted, continue
                next();
            } catch (error) {
                next(error);
            };
        };
    };
};

// Create and export singleton instance
const permissionSystem = new PermissionSystem().initialize(config);
module.exports = permissionSystem;