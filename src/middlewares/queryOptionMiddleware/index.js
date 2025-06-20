const QueryOptionBuilder = require('./QueryOptionBuilder.js');
const FilterHandler = require('./FilterHandler.js');
const { variants } = require('./FilterHandler.js');

variants.forEach(v => FilterHandler.register(v));
const queryOptionBuilder = new QueryOptionBuilder(FilterHandler.getHandlers());

function createQueryOptionMiddleware(defaultFilter) {
    const queryOptionMiddleware = queryOptionBuilder.createMiddleware(defaultFilter);
    return queryOptionMiddleware;
};

module.exports = createQueryOptionMiddleware;