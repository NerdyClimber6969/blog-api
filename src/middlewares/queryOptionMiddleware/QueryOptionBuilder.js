const  FilterHandler  = require('./FilterHandler')
/**
 * Builds query conditions for filtering, sorting, and pagination
 * @class QueryConditionBuilder
 */
class QueryOptionBuilder {
    /**
    * @type {FilterHandler[]}
    * @private
    */
    #chain

    /**
    * Creates an instance of QueryConditionBuilder
    * @param {FilterHandler[]} filterHandlers - Array of filter handler
    * @throws {TypeError} When filterHandlers is not an array, is an empty array, or element in filterHandlers is not an instance of filterHandlerChain
    */
    constructor(filterHandlers) { 
        if (!Array.isArray(filterHandlers)) {
            throw new TypeError('filterHandlers must be an array');
        };

        if (filterHandlers.length === 0) {
            throw new TypeError('filterHandlers must not be an empty array');;
        };

        this.#chain = filterHandlers
    };

    buildFilter(filter) {
        const whereClause = {};

        Object.entries(filter).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                const handler = this.#chain.find(h => h.canHandle(key, value));
                const handledResult = handler ? handler.handle(key, value) : null

                if (handledResult) {
                    Object.assign(whereClause, handledResult);
                };
            };
        });

        return whereClause;
    };

    buildSorting(orderBy, orderDir) {
        if (!orderBy || !orderDir) {
            throw new TypeError('orderBy and orderDir must be provided');
        };

        return { [orderBy]: orderDir };
    };


    buildPagination(options={}) {
        const {         
            page = 1,
            pageSize = 9,
            maxPageSize = 18,
        } = options;

        const normalizedPage = page; 
        const normalizedPageSize = Math.min(maxPageSize, pageSize); //maximun page size set to 18;

        return {
            //calculate the number of item to skip page, in other terms, calculating the page number. 
            skip: (normalizedPage - 1) * normalizedPageSize, 
            take: normalizedPageSize //size of a page
        };
    };

    buildOption({ filter = {}, sorting = {}, pagination = {} }) {
        const processedFilter = this.buildFilter(filter);
        const processedSorting = this.buildSorting(sorting.orderBy, sorting.orderDir);

        const { page, pageSize } = pagination;
        const usePagination = page !== undefined || pageSize !== undefined;
        if (usePagination) {
            const processedPagination = this.buildPagination(pagination);
            return { processedFilter, processedSorting, processedPagination };
        };

        return { processedFilter, processedSorting };
    };

    createMiddleware(filterCriteriaMapper = {}) {
        const buildOption = this.buildOption.bind(this);

        return function (req, res, next) {;
            const { orderBy='createdAt', orderDir='desc', page, pageSize } = req.query;
        
            const sorting = { orderBy, orderDir };
            const pagination = { page, pageSize };

            const filter = {}
            for (const [key, mapper] of Object.entries(filterCriteriaMapper)) {
                filter[key] = mapper(req);
            };
            
            const { processedFilter, processedSorting, processedPagination } = buildOption({ filter, sorting, pagination });

            const queryOption = { processedFilter, processedSorting, processedPagination }
            req.queryOption = queryOption

            next();
        };
    };
};

module.exports = QueryOptionBuilder;