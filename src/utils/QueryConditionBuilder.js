const { ValidationError } = require('../errors/Error.js');
const { filterHandlerChain } = require('./FilterHandlerChain.js');

/**
 * Builds query conditions for filtering, sorting, and pagination
 * @class QueryConditionBuilder
 */
class QueryConditionBuilder {
    /**
    * Creates an instance of QueryConditionBuilder
    * @param {string[]} allowedFields - Array of allowed field names
    * @throws {TypeError} When allowedFields is not an array
    */
    constructor(allowedFields) {
        if (!Array.isArray(allowedFields)) {
            throw new TypeError('allowedFields must be an array');
        };
            
        this.allowedFields = {};
        allowedFields.forEach(field => {
            this.allowedFields[field] = true;
        });
    
        this.filterHandlerChain = filterHandlerChain;
    };

    #validateFilterFields(filter) {
        const invalidFields = [];
        const filterFields = Object.keys(filter);

        for (const key of filterFields) {
            const isAllowedField = this.allowedFields[key];
            if (!isAllowedField) {
                invalidFields.push(key);
            };
        };

        if (invalidFields.length > 0 ) {
            throw new ValidationError('Invalid field', [{
                invalidFields,
                allowedFields: Object.keys(this.allowedFields), 
            }]);
        };

        return true;
    };

    buildFilter(filter) {
        this.#validateFilterFields(filter);

        const whereClause = {};
        Object.entries(filter).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                const handledResult = this.filterHandlerChain.handle(key, value);

                if (handledResult) {
                    Object.assign(whereClause, handledResult);
                };
            };
        });

        return whereClause;
    };

    buildSorting(orderBy, orderDir) {
        if (!orderBy || !orderDir) {
            throw new TypeError('orderBy or orderDir is missing');
        };

        if (orderDir !== 'asc' && orderDir !== 'desc') {
            throw new ValidationError('Invalid order direction', [{ 
                field: 'orderDir', 
                value: orderDir,
                expect: ['asc', 'desc']
            }]);
        };

        if (!this.allowedFields[orderBy]) {
            throw new ValidationError('Invalid order field', [{ 
                field: 'orderBy', 
                value: orderBy,
                expect: Object.keys(this.allowedFields)
            }]);
        };

        return { [orderBy]: orderDir };
    };


    buildPagination(options={}) {
        const {         
            page = 1,
            pageSize = 9,
            maxPageSize = 18,
        } = options;
        // Check if they're valid numbers
        for (const [optionKey, optionValue] of Object.entries({ page: page, pageSize: pageSize, maxPageSize: maxPageSize })) {
            if (!optionValue  || (!Number.isInteger(optionValue) || optionValue <= 0)) {
                throw new ValidationError(`${optionKey} must be a positive integer`, [{ field: optionKey, value: optionValue }]);
            };
        };
        
        const normalizedPage = page; 
        const normalizedPageSize = Math.min(maxPageSize, pageSize); //maximun page size set to 18;

        return {
            //calculate the number of item to skip page, in other terms, calculating the page number. 
            skip: (normalizedPage - 1) * normalizedPageSize, 
            take: normalizedPageSize //size of a page
        };
    };

    buildConditions({ filter = {}, sorting = {}, pagination = {} }) {
        const processedFilter = this.buildFilter(filter);
        const processedSorting = this.buildSorting(sorting.orderBy, sorting.orderDir);

        const { page, pageSize } = pagination;
        const usePagination = page !== undefined || pageSize !== undefined;
        if (usePagination) {
            const options = {};
            if (page !== undefined) options.page = Number(page);
            if (pageSize !== undefined) options.pageSize = Number(pageSize);
            const processedPagination = this.buildPagination(options);
            return { processedFilter, processedSorting, processedPagination };
        };

        return { processedFilter, processedSorting };
    };
};

module.exports = QueryConditionBuilder;