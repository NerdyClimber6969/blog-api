const QueryOptionBuilder = require('./QueryOptionBuilder.js');
const { StringHandler, ExactStringFilterHandler,  DefaultFilterHandler } = require('./FilterHandler.js');

const handlers = [new StringHandler(), new ExactStringFilterHandler(), new DefaultFilterHandler()];
const queryOptionBuilder = new QueryOptionBuilder(handlers);

function createQueryOptionMiddleware(defaultFilter) {
    const queryOptionMiddleware = queryOptionBuilder.createMiddleware(defaultFilter);
    return queryOptionMiddleware;
};

module.exports = createQueryOptionMiddleware;