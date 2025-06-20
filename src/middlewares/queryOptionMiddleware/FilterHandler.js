/**
* Represents a filter handler that can process requests or pass them along.
* @class
*/
class FilterHandler {
    static #handlers = [];

    static register(handler) {
        if (!(handler.prototype instanceof FilterHandler)) {
            throw new TypeError('Handler must extend FilterHandler');
        };

        this.#handlers.push(handler);
    };

    static getHandlers() {
        return FilterHandler.#handlers;
    };

    static canHandle(key, value) {
        throw new Error('Must implement canHandle');
    };
    
    static handle(key, value) {
        throw new Error('Must implement handle');
    };
};


class StringHandler extends FilterHandler {
    static _sanitizeValue (value) {
        if (typeof value === 'string') {
            return value.trim();
        };

        return value;
    };

    static canHandle(key, value) {
        return typeof value === 'string' && !value.startsWith('exact:');
    };

    static handle(key, value) {
        const sanitizedValue = this._sanitizeValue(value);
        return { [key]: { contains: sanitizedValue, mode: 'insensitive' } };
    };
};

class ExactStringFilterHandler extends StringHandler {
    static canHandle(key, value) {
        return typeof value === 'string' && value.startsWith('exact:');
    };
    
    static handle(key, value) {
        const sanitizedValue = this._sanitizeValue(value.replace('exact:', ''));
        return { [key]: sanitizedValue };
    };
};

class RelationFilterHandler extends FilterHandler {
    static canHandle(key, value) {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    };

    static handle(key, value) {
        const handlers = this.getHandlers();
        const nestedWhere = {};

        for (const [subKey, subValue] of Object.entries(value)) {
            const handler = handlers.find(h => h.canHandle(subKey, subValue));
            const processedFilter = handler.handle(subKey, subValue);
            Object.assign(nestedWhere, processedFilter);
        };

        return { 
            [key]: nestedWhere
        };
    };
};

class DefaultFilterHandler extends FilterHandler {
    static canHandle(key, value) {
        return true; 
    };
    
    static handle(key, value) {
        return { [key]: value };
    };
};

module.exports = FilterHandler;
module.exports.variants = [ StringHandler, ExactStringFilterHandler, RelationFilterHandler, DefaultFilterHandler ];