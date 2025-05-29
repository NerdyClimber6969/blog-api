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

module.exports = { StringHandler, ExactStringFilterHandler,  DefaultFilterHandler, FilterHandler };