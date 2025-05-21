/**
* Represents a filter handler that can process requests or pass them along.
* @class
*/
class FilterHandler {
    canHandle(key, value) {
        throw new Error('Must implement canHandle');
    };
    
    handle(key, value) {
        throw new Error('Must implement handle');
    };
};

class DefaultFilterHandler extends FilterHandler {
    canHandle(key, value) {
        return true; 
    };
    
    handle(key, value) {
        return { [key]: value };
    };
};

class StringHandler extends FilterHandler {
    _sanitizeValue (value) {
        if (typeof value === 'string') {
            return value.trim();
        };

        return value;
    };

    canHandle(key, value) {
        return typeof value === 'string' && !value.startsWith('exact:');
    };

    handle(key, value) {
        const sanitizedValue = this._sanitizeValue(value);
        return { [key]: { contains: sanitizedValue, mode: 'insensitive' } };
    };
};

class ExactStringFilterHandler extends StringHandler {
    canHandle(key, value) {
        return typeof value === 'string' && value.startsWith('exact:');
    };
    
    handle(key, value) {
        const sanitizedValue = this._sanitizeValue(value.replace('exact:', ''));
        return { [key]: sanitizedValue };
    };
};

/**
 * Builds a chain of filtering criteria handlers, 
 * each handler in the chain decides either to process the request 
 * or to pass it along the chain to the next handler.
 * @class 
 */
class FilterHandlerChain {
    /**
    * @type {FilterHandler[]}
    * @private
    */
    #filterHandlers

    /**
    * Creates an instance of FilterHandlerChain
    * @param {FilterHandler[]} filterHandlers - Array of FilterHandler
    * @throws {TypeError} When handlers is not an array 
    * or handler in the array is not an instance of FilterHandler
    */
    constructor(filterHandlers=[]) {
        if (!Array.isArray(filterHandlers)) {
            throw new TypeError('Handlers must be an array');
        };

        if (filterHandlers.length < 1) {
            this.#filterHandlers = [];
            return;
        };

        for (const handler of filterHandlers) {
            if (!(handler instanceof FilterHandler)) {
                throw new TypeError('Must pass handler to the handler chain');
            };
        };

        this.#filterHandlers = filterHandlers;
        return;
    };

    addHandler(handler) {
        this.#filterHandlers.push(handler);
        console.log(handler);
        return this;
    };

    handle(key, value) {
        const handler = this.#filterHandlers.find(h => h.canHandle(key, value));
        return handler ? handler.handle(key, value) : null;
    };
};

const handlers = [new StringHandler(), new ExactStringFilterHandler(), new DefaultFilterHandler()];
const filterHandlerChain = new FilterHandlerChain(handlers);

module.exports = { filterHandlerChain, FilterHandlerChain };